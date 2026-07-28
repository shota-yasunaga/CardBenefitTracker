function getOpenBenefitCount(card) {
    return (card.benefits || []).filter((benefit) => (
        benefit.type !== BENEFIT_TYPE.FEATURE &&
        !benefit.used &&
        !benefit.subscribed
    )).length;
}

function hasUrgentOpenBenefits(cards) {
    return cards.some((card) => (card.benefits || []).some((benefit) => {
        if (benefit.type === BENEFIT_TYPE.FEATURE || benefit.used || benefit.subscribed) return false;
        const amount = getCurrentBenefitAmount(benefit, benefit.frequency);
        const daysLeft = daysUntilExpiration(getExpirationDate(benefit.frequency));
        const isCurrentPeriod = benefit.frequency !== BENEFIT_FREQUENCY.SEMI_ANNUAL || amount > 0;
        return isCurrentPeriod && daysLeft >= 0 && daysLeft <= BENEFIT_URGENCY_DAYS;
    }));
}

function Sidebar({
    cards,
    currentPage,
    viewMode,
    selectedCardId,
    onNavigate,
    onSelectCard,
    onAddCard
}) {
    const unusedBenefitCount = cards.reduce((total, card) => total + getOpenBenefitCount(card), 0);
    const hasUrgentBenefits = hasUrgentOpenBenefits(cards);
    const navItems = [
        {
            label: 'Today',
            isActive: currentPage === 'dashboard' && viewMode === 'unused',
            onClick: () => onNavigate('dashboard', 'unused'),
            count: unusedBenefitCount
        },
        {
            label: 'All benefits',
            isActive: currentPage === 'dashboard' && viewMode === 'list',
            onClick: () => onNavigate('dashboard', 'list')
        },
        {
            label: 'Log',
            isActive: currentPage === 'history',
            onClick: () => onNavigate('history')
        },
        {
            label: 'Setup',
            isActive: currentPage === 'settings',
            onClick: () => onNavigate('settings')
        },
        {
            label: 'CardFit',
            isActive: currentPage === 'cardfit',
            onClick: () => onNavigate('cardfit')
        }
    ];

    return (
        <aside className="w-[250px] shrink-0 h-screen sticky top-0 overflow-y-auto bg-paper-rail border-r border-line p-[26px_18px] flex flex-col">
            <div className="px-3 mb-7">
                <h1 className="text-[17px] font-semibold tracking-[-.02em] text-ink leading-tight">
                    Benefits
                </h1>
                <div className="mt-1 font-mono text-[9.5px] tracking-[.16em] text-ink-muted">
                    TRACKER
                </div>
            </div>

            <nav className="flex flex-col gap-[2px]" aria-label="Primary">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        onClick={item.onClick}
                        className={`w-full flex items-center justify-between px-3 py-[9px] rounded-[9px] text-[14px] font-medium tracking-[-.01em] text-left ${
                            item.isActive ? 'bg-ink text-night-text' : 'text-ink-3'
                        }`}
                    >
                        <span>{item.label}</span>
                        {typeof item.count === 'number' && (
                            <span className={`font-mono text-[10.5px] ${
                                hasUrgentBenefits
                                    ? item.isActive ? 'text-rust-night' : 'text-rust'
                                    : item.isActive ? 'text-night-muted' : 'text-ink-muted'
                            }`}>
                                {item.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="px-3 pt-[30px] pb-[10px] font-mono text-[9.5px] tracking-[.14em] text-ink-muted">
                YOUR CARDS
            </div>

            <div>
                {cards.map((card) => {
                    const isSelected = currentPage === 'card' && selectedCardId === card.id;
                    const image = window.getCardImage(card);
                    return (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => onSelectCard(card.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] border border-line-card mb-[7px] text-left ${
                                isSelected ? 'bg-ink' : 'bg-paper-raised'
                            }`}
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt=""
                                    className="w-9 h-[23px] shrink-0 rounded-[3px] object-cover"
                                />
                            ) : (
                                <span
                                    aria-hidden="true"
                                    className={`w-9 h-[23px] shrink-0 rounded-[3px] ${card.color || 'card-gradient-custom'}`}
                                />
                            )}
                            <span className="min-w-0 flex-1">
                                <span className={`block truncate text-[13.5px] font-medium leading-tight ${
                                    isSelected ? 'text-night-text' : 'text-ink'
                                }`}>
                                    {card.name}
                                </span>
                                <span className="block truncate mt-0.5 font-mono text-[9px] tracking-[.1em] text-ink-muted">
                                    {card.issuer}
                                </span>
                            </span>
                            <span className={`shrink-0 font-mono text-[10.5px] ${isSelected ? 'text-night-muted' : 'text-ink-muted'}`}>
                                {getOpenBenefitCount(card)}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 min-h-5" />

            <button
                type="button"
                onClick={onAddCard}
                className="w-full border border-dashed border-dash rounded-[9px] p-2.5 text-center text-[13px] font-medium text-ink-4"
            >
                + Add card
            </button>
        </aside>
    );
}

function AppShell({ children, ...sidebarProps }) {
    return (
        <div className="flex min-h-screen bg-paper">
            <Sidebar {...sidebarProps} />
            <main className="flex-1 min-w-0 px-[34px] py-[30px] overflow-hidden">
                {children}
            </main>
        </div>
    );
}

function App() {
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('creditCardBenefits');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    });
    const [viewMode, setViewMode] = useState('unused'); // 'unused' | 'list'
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
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

    // Add state for recently used benefits
    const [recentlyUsed, setRecentlyUsed] = useState(new Set());
    const [undoableUsed, setUndoableUsed] = useState(new Set());

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
        newCard.addedAt = new Date().toISOString();
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
        const newCustomCard = {
            ...customCard,
            addedAt: customCard.addedAt || new Date().toISOString()
        };
        setCards((prevCards) => [...prevCards, newCustomCard]);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'card_added', {
                card_name: newCustomCard.name,
                card_issuer: newCustomCard.issuer,
                annual_fee: newCustomCard.annualFee,
                benefits_count: newCustomCard.benefits?.length || 0,
                custom: true
            });
        }
    };

    const handleRemoveCard = (cardId) => {
        const cardToRemove = cards.find(card => card.id === cardId);
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));

        // Track card removal
        if (typeof gtag !== 'undefined' && cardToRemove) {
            gtag('event', 'card_removed', {
                card_name: cardToRemove.name,
                card_issuer: cardToRemove.issuer
            });
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

    useEffect(() => {
        if (currentPage === 'card' && !cards.some((card) => card.id === selectedCardId)) {
            setSelectedCardId(null);
            setCurrentPage('dashboard');
            setViewMode('unused');
        }
    }, [cards, currentPage, selectedCardId]);

    const handleNavigate = (page, nextViewMode) => {
        setCurrentPage(page);
        setSelectedCardId(null);
        if (nextViewMode === 'unused' || nextViewMode === 'list') {
            setViewMode(nextViewMode);
        }
        if (typeof gtag !== 'undefined' && page !== 'dashboard') {
            gtag('event', 'page_view', {
                page_title: page === 'history' ? 'Usage History' : page === 'settings' ? 'Settings' : 'CardFit',
                page_location: page
            });
        }
    };

    const handleSelectCard = (cardId) => {
        setSelectedCardId(cardId);
        setCurrentPage('card');
    };

    const openAddCardModal = () => {
        setShowAddCardModal(true);
        if (typeof gtag !== 'undefined') {
            gtag('event', cards.length === 0 ? 'first_card_intent' : 'page_view', {
                page_title: 'Add Cards',
                page_location: 'add-card-modal'
            });
        }
    };

    const addCardModal = showAddCardModal ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
            <button
                type="button"
                className="absolute inset-0 w-full h-full cursor-default modal-scrim"
                onClick={() => setShowAddCardModal(false)}
                aria-label="Close add card modal"
            />
            <div
                className="relative flex w-[840px] max-w-[calc(100vw-48px)] max-h-[726px] overflow-hidden rounded-[20px] bg-paper modal-shadow"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-card-title"
            >
                <AddCardPage
                    onAddCard={handleAddCard}
                    onAddCustom={handleAddCustomCard}
                    onBack={() => setShowAddCardModal(false)}
                    existingCardIds={cards.map(card => card.id)}
                />
            </div>
        </div>
    ) : null;

    if (cards.length === 0) {
        return (
            <>
                <FirstRunPage onAddCard={openAddCardModal} />
                {addCardModal}
            </>
        );
    }

    const selectedCard = cards.find((card) => card.id === selectedCardId);
    let pageBody;

    if (currentPage === 'cardfit') {
        pageBody = (
            <CardFitPage
                userCards={cards}
                onBackToTracker={() => {
                    setCurrentPage('dashboard');
                    setSelectedCardId(null);
                }}
            />
        );
    } else if (currentPage === 'settings') {
        pageBody = (
            <SettingsPage
                onResetAll={handleResetAll}
                onResetBenefitUsage={handleResetBenefitUsage}
            />
        );
    } else if (currentPage === 'history') {
        pageBody = <UsageHistoryPage historyEvents={usageHistory} cards={cards} />;
    } else if (currentPage === 'card' && selectedCard) {
        pageBody = (
            <CreditCardSection
                card={selectedCard}
                onToggle={handleToggle}
                onRemove={handleRemoveCard}
                onUndo={handleUndo}
                recentlyUsed={recentlyUsed}
                undoableUsed={undoableUsed}
            />
        );
    } else {
        const allBenefits = getAllBenefits();
        pageBody = viewMode === 'list' ? (
            <AllBenefitsDashboard
                cards={cards}
                benefits={allBenefits}
                recentlyUsed={recentlyUsed}
                onToggle={handleToggle}
                onUndo={handleUndo}
            />
        ) : (
            <TodayDashboard
                benefits={allBenefits}
                recentlyUsed={recentlyUsed}
                onToggle={handleToggle}
                onUndo={handleUndo}
                onShowAll={() => setViewMode('list')}
            />
        );
    }

    return (
        <AppShell
            cards={cards}
            currentPage={currentPage}
            viewMode={viewMode}
            selectedCardId={selectedCardId}
            onNavigate={handleNavigate}
            onSelectCard={handleSelectCard}
            onAddCard={openAddCardModal}
        >
            {pageBody}
            {addCardModal}
        </AppShell>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
