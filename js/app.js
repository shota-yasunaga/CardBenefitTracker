function App() {
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('creditCardBenefits');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    });
    const [viewMode, setViewMode] = useState('unused'); // 'card', 'list', 'unused'
    const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'add-cards', 'settings', 'history'
    const [usageHistory, setUsageHistory] = useState(() => {
        const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Failed to parse usage history, resetting to empty.', error);
            return [];
        }
    });

    // Add dark mode state
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

    // Add state for recently used benefits
    const [recentlyUsed, setRecentlyUsed] = useState(new Set());
    const [undoableUsed, setUndoableUsed] = useState(new Set());

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    // Add timer effect for recently used benefits
    useEffect(() => {
        if (recentlyUsed.size > 0) {
            const timer = setTimeout(() => {
                setRecentlyUsed(new Set());
            }, 30000); // 30 seconds

            return () => clearTimeout(timer);
        }
    }, [recentlyUsed.size > 0]);

    useEffect(() => {
        localStorage.setItem('creditCardBenefits', JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(usageHistory.slice(0, HISTORY_MAX_ENTRIES)));
    }, [usageHistory]);

    const appendUsageEvent = ({
        action,
        cardId = null,
        cardName = null,
        benefitId = null,
        benefitName = null,
        frequency = null,
        amountUsed = null
    }) => {
        const timestamp = new Date().toISOString();
        const periodKey = frequency ? getPeriodKey(frequency, timestamp, { name: benefitName || '' }) : null;
        const event = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp,
            action,
            cardId,
            cardName,
            benefitId,
            benefitName,
            frequency,
            periodKey,
            amountUsed
        };
        setUsageHistory((prev) => [event, ...prev].slice(0, HISTORY_MAX_ENTRIES));
    };

    const handleToggle = (cardId, benefitId) => {
        setCards(prevCards => {
            return prevCards.map(card => {
                if (card.id === cardId) {
                    return {
                        ...card,
                        benefits: card.benefits.map(benefit => {
                            if (benefit.id === benefitId) {
                                if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
                                    // Track subscription toggle
                                    if (!benefit.subscribed) {
                                        setUndoableUsed(prev => new Set([...prev, benefitId]));
                                    }
                                    appendUsageEvent({
                                        action: benefit.subscribed ? 'unsubscribed' : 'subscribed',
                                        cardId: card.id,
                                        cardName: card.name,
                                        benefitId: benefit.id,
                                        benefitName: benefit.name,
                                        frequency: benefit.frequency
                                    });
                                    if (typeof gtag !== 'undefined') {
                                        gtag('event', 'subscription_toggle', {
                                            card_name: card.name,
                                            benefit_name: benefit.name,
                                            action: benefit.subscribed ? 'unsubscribe' : 'subscribe'
                                        });
                                    }
                                    return { ...benefit, subscribed: !benefit.subscribed };
                                } else if (benefit.type === BENEFIT_TYPE.CREDIT || benefit.type === BENEFIT_TYPE.ONE_TIME) {
                                    // Track benefit usage and add to recently used
                                    if (!benefit.used) {
                                        setRecentlyUsed(prev => new Set([...prev, benefitId]));
                                        setUndoableUsed(prev => new Set([...prev, benefitId]));
                                        appendUsageEvent({
                                            action: 'used',
                                            cardId: card.id,
                                            cardName: card.name,
                                            benefitId: benefit.id,
                                            benefitName: benefit.name,
                                            frequency: benefit.frequency,
                                            amountUsed: benefit.value
                                        });
                                    }
                                    if (typeof gtag !== 'undefined') {
                                        gtag('event', 'benefit_used', {
                                            card_name: card.name,
                                            benefit_name: benefit.name,
                                            benefit_value: benefit.value
                                        });
                                    }
                                    return { ...benefit, used: true };
                                }
                            }
                            return benefit;
                        })
                    };
                }
                return card;
            });
        });
    };

    // Add undo function
    const handleUndo = (cardId, benefitId) => {
        setCards(prevCards => {
            return prevCards.map(card => {
                if (card.id === cardId) {
                    return {
                        ...card,
                        benefits: card.benefits.map(benefit => {
                            if (benefit.id === benefitId) {
                                if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
                                    appendUsageEvent({
                                        action: 'unsubscribed',
                                        cardId: card.id,
                                        cardName: card.name,
                                        benefitId: benefit.id,
                                        benefitName: benefit.name,
                                        frequency: benefit.frequency
                                    });
                                    return { ...benefit, subscribed: false };
                                } else if (benefit.type === BENEFIT_TYPE.CREDIT || benefit.type === BENEFIT_TYPE.ONE_TIME) {
                                    appendUsageEvent({
                                        action: 'undo_used',
                                        cardId: card.id,
                                        cardName: card.name,
                                        benefitId: benefit.id,
                                        benefitName: benefit.name,
                                        frequency: benefit.frequency
                                    });
                                    return { ...benefit, used: false };
                                }
                            }
                            return benefit;
                        })
                    };
                }
                return card;
            });
        });
        // Remove from recently used
        setRecentlyUsed(prev => {
            const newSet = new Set(prev);
            newSet.delete(benefitId);
            return newSet;
        });
        // Remove from undoable used
        setUndoableUsed(prev => {
            const newSet = new Set(prev);
            newSet.delete(benefitId);
            return newSet;
        });
    };

    const handleAddCard = (cardId) => {
        const newCard = JSON.parse(JSON.stringify(availableCards[cardId])); // Deep clone
        // Generate unique IDs for benefits to avoid conflicts
        newCard.benefits = newCard.benefits.map(benefit => ({
            ...benefit,
            id: `${cardId}-${benefit.id}-${Date.now()}`
        }));
        setCards(prevCards => [...prevCards, newCard]);
        
        // Track card addition
        if (typeof gtag !== 'undefined') {
            gtag('event', 'card_added', {
                card_name: newCard.name,
                card_issuer: newCard.issuer,
                annual_fee: newCard.annualFee,
                benefits_count: newCard.benefits.length
            });
        }
    };

    const handleAddCustomCard = (customCard) => {
        setCards((prevCards) => [...prevCards, customCard]);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'card_added', {
                card_name: customCard.name,
                card_issuer: customCard.issuer,
                annual_fee: customCard.annualFee,
                benefits_count: customCard.benefits?.length || 0,
                custom: true
            });
        }
    };

    const handleRemoveCard = (cardId) => {
        if (window.confirm('Are you sure you want to remove this card?')) {
            const cardToRemove = cards.find(card => card.id === cardId);
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
            
            // Track card removal
            if (typeof gtag !== 'undefined' && cardToRemove) {
                gtag('event', 'card_removed', {
                    card_name: cardToRemove.name,
                    card_issuer: cardToRemove.issuer
                });
            }
        }
    };

    // Reset functions
    const handleResetAll = () => {
        appendUsageEvent({
            action: 'reset_all',
            cardId: null,
            cardName: null,
            benefitId: null,
            benefitName: null
        });
        setCards([]);
        localStorage.removeItem('creditCardBenefits');
        
        // Track reset all
        if (typeof gtag !== 'undefined') {
            gtag('event', 'data_reset_all');
        }
    };

    const handleResetBenefitUsage = () => {
        appendUsageEvent({
            action: 'reset_usage',
            cardId: null,
            cardName: null,
            benefitId: null,
            benefitName: null
        });
        setCards(prevCards => {
            return prevCards.map(card => ({
                ...card,
                benefits: card.benefits.map(benefit => {
                    const resetBenefit = { ...benefit };
                    // Reset usage states to defaults
                    if (benefit.type === BENEFIT_TYPE.CREDIT || benefit.type === BENEFIT_TYPE.ONE_TIME) {
                        resetBenefit.used = false;
                    }
                    if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
                        resetBenefit.subscribed = false;
                    }
                    if (benefit.type === BENEFIT_TYPE.FEATURE) {
                        resetBenefit.activated = true; // Features are typically active by default
                    }
                    return resetBenefit;
                })
            }));
        });
        
        // Clear tracking states
        setRecentlyUsed(new Set());
        setUndoableUsed(new Set());
        
        // Track reset benefit usage
        if (typeof gtag !== 'undefined') {
            gtag('event', 'data_reset_benefits');
        }
    };

    const getAllBenefits = () => {
        return cards.flatMap(card => 
            card.benefits.map(benefit => ({
                ...benefit,
                cardId: card.id,
                cardName: card.name
            }))
        );
    };

    const getUnusedBenefits = () => {
        return getAllBenefits().filter(benefit => 
            (!benefit.used && !benefit.subscribed && benefit.type !== BENEFIT_TYPE.FEATURE) ||
            recentlyUsed.has(benefit.id)
        );
    };

    if (currentPage === 'cardfit') {
        return <CardFitPage userCards={cards} onBackToTracker={() => setCurrentPage('dashboard')} />;
    }

    if (currentPage === 'add-cards') {
        return (
            <AddCardPage
                onAddCard={handleAddCard}
                onAddCustom={handleAddCustomCard}
                onBack={() => setCurrentPage('dashboard')}
                existingCardIds={cards.map(card => card.id)}
            />
        );
    }

    if (currentPage === 'settings') {
        return (
            <SettingsPage
                onBack={() => setCurrentPage('dashboard')}
                onResetAll={handleResetAll}
                onResetBenefitUsage={handleResetBenefitUsage}
            />
        );
    }

    if (currentPage === 'history') {
        return (
            <UsageHistoryPage
                historyEvents={usageHistory}
                cards={cards}
                onBack={() => setCurrentPage('dashboard')}
            />
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Credit Card Benefits</h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track and maximize your card rewards</p>
                                </div>
                                <button
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200"
                                >
                                    {isDarkMode ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            {/* Enhanced Tab Navigation */}
                            <div className="flex bg-slate-100/60 dark:bg-slate-700/60 p-1 rounded-xl backdrop-blur-sm">
                                <button
                                    onClick={() => {
                                        setCurrentPage('dashboard');
                                        setViewMode('unused');
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'dashboard' && viewMode === 'unused'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    Benefit Lists
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentPage('dashboard');
                                        setViewMode('card');
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'dashboard' && viewMode === 'card'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    Card View
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentPage('add-cards');
                                        if (typeof gtag !== 'undefined') {
                                            gtag('event', 'page_view', {
                                                page_title: 'Add Cards',
                                                page_location: 'add-cards'
                                            });
                                        }
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'add-cards'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    Add Cards
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage('cardfit');
                                        if (typeof gtag !== 'undefined') {
                                            gtag('event', 'page_view', { page_title: 'CardFit', page_location: 'cardfit' });
                                        }
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'cardfit'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    CardFit
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentPage('settings');
                                        if (typeof gtag !== 'undefined') {
                                            gtag('event', 'page_view', {
                                                page_title: 'Settings',
                                                page_location: 'settings'
                                            });
                                        }
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'settings'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentPage('history');
                                        if (typeof gtag !== 'undefined') {
                                            gtag('event', 'page_view', {
                                                page_title: 'Usage History',
                                                page_location: 'history'
                                            });
                                        }
                                    }}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        currentPage === 'history'
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                                    }`}
                                >
                                    History
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cards.length === 0 && (
                    <div className="text-center py-20">
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">No credit cards added yet</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">Get started by adding your credit cards to track and maximize your benefits</p>
                        <button
                            onClick={() => {
                                setCurrentPage('add-cards');
                                // Track first card addition intent
                                if (typeof gtag !== 'undefined') {
                                    gtag('event', 'first_card_intent', {
                                        page_title: 'Add Cards',
                                        page_location: 'add-cards'
                                    });
                                }
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Your First Card
                        </button>
                    </div>
                )}

                {viewMode === 'card' && cards.map(card => (
                    <CreditCardSection
                        key={card.id}
                        card={card}
                        onToggle={handleToggle}
                        onRemove={handleRemoveCard}
                        onUndo={handleUndo}
                        recentlyUsed={recentlyUsed}
                        undoableUsed={undoableUsed}
                    />
                ))}

                {viewMode === 'unused' && (
                    <div className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Benefit Lists</h2>
                            <p className="text-slate-600 dark:text-slate-400">Track and manage all your credit card benefits</p>
                        </div>
                        <ContextualFeedbackForm
                            contextType="benefits-summary"
                            title="Spot a benefit issue?"
                            prompt="Report a missing benefit, incorrect amount, or stale details."
                            defaultIssueType="missing_benefit"
                            pageMeta={`dashboard-${viewMode}`}
                            quickActions={[
                                { label: 'Report missing benefit', issueType: 'missing_benefit' },
                                { label: 'Report wrong benefit', issueType: 'incorrect_benefit' }
                            ]}
                        />
                        
                        {getAllBenefits().length === 0 ? (
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No benefits to track</h3>
                                <p className="text-slate-600 dark:text-slate-400">Add some credit cards to start tracking benefits</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Unused Benefits Section */}
                                {getUnusedBenefits().length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                            Unused Benefits ({getUnusedBenefits().length})
                                        </h3>
                                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-x-auto">
                                            <div className="grid benefits-table-grid min-w-[660px]">
                                                <div className="sticky left-0 z-20 px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.3)]">
                                                    Benefit
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Card
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Expires
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Value
                                                </div>
                                                <div className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Action
                                                </div>
                                                    {getUnusedBenefits().map((benefit) => (
                                                        <BenefitCard
                                                            key={`${benefit.cardId}-${benefit.id}`}
                                                            benefit={benefit}
                                                            cardId={benefit.cardId}
                                                            cardName={benefit.cardName}
                                                            onToggle={handleToggle}
                                                            onUndo={handleUndo}
                                                            isRecentlyUsed={recentlyUsed.has(benefit.id)}
                                                            isUndoableUsed={undoableUsed.has(benefit.id)}
                                                            viewMode="list"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Used Benefits Section */}
                                {getAllBenefits().filter(benefit => (benefit.used || benefit.subscribed || benefit.activated) && !recentlyUsed.has(benefit.id)).length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            Used Benefits ({getAllBenefits().filter(benefit => (benefit.used || benefit.subscribed || benefit.activated) && !recentlyUsed.has(benefit.id)).length})
                                        </h3>
                                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 max-h-96 overflow-auto">
                                            <div className="grid benefits-table-grid min-w-[660px]">
                                                <div className="sticky left-0 z-20 px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.3)]">
                                                    Benefit
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Card
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Expires
                                                </div>
                                                <div className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Value
                                                </div>
                                                <div className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-50 dark:bg-slate-700">
                                                    Action
                                                </div>
                                                    {getAllBenefits().filter(benefit => (benefit.used || benefit.subscribed || benefit.activated) && !recentlyUsed.has(benefit.id)).map((benefit) => (
                                                        <BenefitCard
                                                            key={`${benefit.cardId}-${benefit.id}`}
                                                            benefit={benefit}
                                                            cardId={benefit.cardId}
                                                            cardName={benefit.cardName}
                                                            onToggle={handleToggle}
                                                            onUndo={handleUndo}
                                                            isRecentlyUsed={recentlyUsed.has(benefit.id)}
                                                            isUndoableUsed={undoableUsed.has(benefit.id)}
                                                            viewMode="list"
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                </main>

                <footer className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 text-white py-8 mt-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm text-slate-300">
                            Track your credit card benefits and maximize your rewards.
                        </p>
                        <p className="text-xs mt-2 text-slate-400">
                            Data is stored locally in your browser. No information is sent to any server.
                        </p>
                        <div className="mt-4 max-w-2xl mx-auto">
                            <ContextualFeedbackForm
                                contextType="footer-support"
                                title="Support and feature requests"
                                prompt="Send us bug reports or ideas directly from the app."
                                compact={true}
                                defaultIssueType="other"
                                pageMeta={`footer-${currentPage}-${viewMode}`}
                                quickActions={[
                                    { label: 'Send feedback', issueType: 'other' },
                                    { label: 'Feature request', issueType: 'feature_request' }
                                ]}
                            />
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
