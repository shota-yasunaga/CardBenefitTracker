function App() {
    const [cards, setCards] = React.useState(() => {
        const saved = localStorage.getItem('creditCardBenefits');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    });
    const [viewMode, setViewMode] = React.useState('unused'); // 'card', 'list', 'unused'
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState('dashboard'); // 'dashboard', 'settings'

    React.useEffect(() => {
        localStorage.setItem('creditCardBenefits', JSON.stringify(cards));
    }, [cards]);

    const handleToggle = (cardId, benefitId) => {
        setCards(prevCards => {
            return prevCards.map(card => {
                if (card.id === cardId) {
                    return {
                        ...card,
                        benefits: card.benefits.map(benefit => {
                            if (benefit.id === benefitId) {
                                if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
                                    return { ...benefit, subscribed: !benefit.subscribed };
                                } else if (benefit.type === BENEFIT_TYPE.CREDIT || benefit.type === BENEFIT_TYPE.ONE_TIME) {
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

    const handleAddCard = (cardId) => {
        const newCard = JSON.parse(JSON.stringify(availableCards[cardId])); // Deep clone
        // Generate unique IDs for benefits to avoid conflicts
        newCard.benefits = newCard.benefits.map(benefit => ({
            ...benefit,
            id: `${cardId}-${benefit.id}-${Date.now()}`
        }));
        setCards(prevCards => [...prevCards, newCard]);
    };

    const handleAddCustomCard = (customCard) => {
        // Custom card already has unique IDs from createCustomCard function
        setCards(prevCards => [...prevCards, customCard]);
    };

    const handleRemoveCard = (cardId) => {
        if (window.confirm('Are you sure you want to remove this card?')) {
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
        }
    };

    // Reset functions
    const handleResetAll = () => {
        setCards([]);
        localStorage.removeItem('creditCardBenefits');
    };

    const handleResetBenefitUsage = () => {
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
            !benefit.used && !benefit.subscribed && benefit.type !== BENEFIT_TYPE.FEATURE
        );
    };

    // Render settings page
    if (currentPage === 'settings') {
        return (
            <SettingsPage
                onBack={() => setCurrentPage('dashboard')}
                onResetAll={handleResetAll}
                onResetBenefitUsage={handleResetBenefitUsage}
            />
        );
    }

    // Render dashboard
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Credit Card Benefit Tracker</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage('settings')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Settings
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                Add Card
                            </button>
                            <select
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                            >
                                <option value="unused">Unused Only</option>
                                <option value="card">Card View</option>
                                <option value="list">List View</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cards.length === 0 && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No credit cards added yet</h2>
                        <p className="text-gray-600 mb-6">Add your credit cards to start tracking benefits</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                        >
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
                    />
                ))}

                {viewMode === 'list' && (
                    <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Benefit
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Card
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expires
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Value
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getAllBenefits().map((benefit) => (
                                    <BenefitCard
                                        key={`${benefit.cardId}-${benefit.id}`}
                                        benefit={benefit}
                                        cardId={benefit.cardId}
                                        cardName={benefit.cardName}
                                        onToggle={handleToggle}
                                        viewMode="list"
                                    />
                                ))}
                                {/* Add Card Shortcut Row */}
                                <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <td colSpan="4" className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-lg">➕</span>
                                            <span className="text-sm">Want to track more benefits?</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            Add Card
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {viewMode === 'unused' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unused Benefits</h2>
                        {getUnusedBenefits().length === 0 ? (
                            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                                <p className="text-gray-600">No unused benefits found. Great job using your benefits!</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Benefit
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Card
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expires
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getUnusedBenefits().map((benefit) => (
                                            <BenefitCard
                                                key={`${benefit.cardId}-${benefit.id}`}
                                                benefit={benefit}
                                                cardId={benefit.cardId}
                                                cardName={benefit.cardName}
                                                onToggle={handleToggle}
                                                viewMode="list"
                                            />
                                        ))}
                                        {/* Add Card Shortcut Row */}
                                        <tr className="bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <td colSpan="4" className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <span className="text-lg">➕</span>
                                                    <span className="text-sm">Want to track more benefits?</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => setShowAddModal(true)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                                >
                                                    Add Card
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">
                        Track your credit card benefits and maximize your rewards.
                    </p>
                    <p className="text-xs mt-2 text-gray-400">
                        Data is stored locally in your browser. No information is sent to any server.
                    </p>
                </div>
            </footer>

            <AddCardModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddCard}
                onAddCustom={handleAddCustomCard}
                existingCardIds={cards.map(card => card.id)}
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);