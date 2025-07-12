// Add card modal component
function AddCardModal({ isOpen, onClose, onAdd, existingCardIds }) {
    const [selectedCard, setSelectedCard] = React.useState('');

    const availableToAdd = Object.values(availableCards).filter(
        card => !existingCardIds.includes(card.id)
    );

    const handleAdd = () => {
        if (selectedCard) {
            onAdd(selectedCard);
            setSelectedCard('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add Credit Card</h2>
                
                {availableToAdd.length === 0 ? (
                    <p className="text-gray-600 mb-4">All available cards have been added!</p>
                ) : (
                    <>
                        <div className="space-y-3 mb-6">
                            {availableToAdd.map(card => (
                                <label
                                    key={card.id}
                                    className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedCard === card.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="card"
                                        value={card.id}
                                        checked={selectedCard === card.id}
                                        onChange={(e) => setSelectedCard(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{card.name}</h3>
                                            <p className="text-sm text-gray-600">{card.issuer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${card.annualFee}/year</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-4">
                            Note: Some cards may have simplified benefits. You can customize after adding.
                        </div>
                    </>
                )}
                
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    {availableToAdd.length > 0 && (
                        <button
                            onClick={handleAdd}
                            disabled={!selectedCard}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                selectedCard
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Add Card
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Components
function BenefitCard({ benefit, cardId, cardName, onToggle, viewMode = 'card' }) {
    const expirationDate = getExpirationDate(benefit.frequency);
    const daysLeft = daysUntilExpiration(expirationDate);
    const currentAmount = getCurrentBenefitAmount(benefit, benefit.frequency);
    
    let expirationColor = 'text-gray-600';
    let expirationBg = 'bg-gray-100';
    if (daysLeft <= 7) {
        expirationColor = 'text-red-600';
        expirationBg = 'bg-red-100';
    } else if (daysLeft <= 30) {
        expirationColor = 'text-orange-600';
        expirationBg = 'bg-orange-100';
    }

    const categoryIcons = {
        [BENEFIT_CATEGORY.TRAVEL]: '✈️',
        [BENEFIT_CATEGORY.DINING]: '🍽️',
        [BENEFIT_CATEGORY.ENTERTAINMENT]: '🎭',
        [BENEFIT_CATEGORY.SHOPPING]: '🛍️',
        [BENEFIT_CATEGORY.RIDESHARE]: '🚗',
        [BENEFIT_CATEGORY.LOUNGE]: '🛋️',
        [BENEFIT_CATEGORY.INSURANCE]: '🛡️'
    };

    const isUsed = benefit.used || benefit.subscribed || benefit.activated;

    // Don't show in unused view if it's used or if it's a feature that's always active
    if (viewMode === 'unused' && (isUsed || benefit.type === BENEFIT_TYPE.FEATURE)) {
        return null;
    }

    // Don't show expired semi-annual benefits
    if (benefit.frequency === BENEFIT_FREQUENCY.SEMI_ANNUAL && currentAmount === 0) {
        return null;
    }

    const renderButton = () => {
        if (benefit.type === BENEFIT_TYPE.FEATURE) {
            return (
                <span className="text-sm text-green-600 font-medium">
                    ✓ Active
                </span>
            );
        }

        if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
            return (
                <button
                    onClick={() => onToggle(cardId, benefit.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        benefit.subscribed
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {benefit.subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            );
        }

        return (
            <button
                onClick={() => onToggle(cardId, benefit.id)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    benefit.used
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={benefit.used}
            >
                {benefit.used ? 'Used' : 'Mark Used'}
            </button>
        );
    };

    if (viewMode === 'list') {
        return (
            <tr className={`border-b ${isUsed ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryIcons[benefit.category]}</span>
                        <div>
                            <div className="font-medium text-gray-900">{benefit.name}</div>
                            <div className="text-sm text-gray-600">{benefit.description}</div>
                        </div>
                    </div>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-gray-700">{cardName}</td>
                <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                    </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium">
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR 
                        ? formatCurrency(currentAmount) 
                        : formatCurrency(benefit.value)}
                </td>
                <td className="py-3 px-4 text-right">{renderButton()}</td>
            </tr>
        );
    }

    return (
        <div className={`benefit-card bg-white rounded-lg p-4 shadow-md border border-gray-200 ${isUsed ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{categoryIcons[benefit.category]}</span>
                        <h4 className="font-semibold text-gray-900">{benefit.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="text-sm text-gray-700 font-medium">
                            {formatCurrency(currentAmount)}
                        </span>
                    )}
                    {benefit.frequency === BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="text-sm text-gray-700 font-medium">
                            {formatCurrency(benefit.value)}
                        </span>
                    )}
                </div>
                
                {renderButton()}
            </div>
        </div>
    );
}

function CreditCardSection({ card, onToggle, onRemove }) {
    return (
        <div className="mb-8">
            <div className={`${card.color} text-white rounded-t-lg p-6`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{card.name}</h2>
                        <p className="text-white/80">Annual Fee: {formatCurrency(card.annualFee)}</p>
                    </div>
                    <button
                        onClick={() => onRemove(card.id)}
                        className="text-white/80 hover:text-white transition-colors"
                        title="Remove card"
                    >
                        ✕
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-50 rounded-b-lg p-4">
                <div className="grid gap-3 md:grid-cols-2">
                    {card.benefits.map(benefit => (
                        <BenefitCard
                            key={benefit.id}
                            benefit={benefit}
                            cardId={card.id}
                            cardName={card.name}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Settings Page Component
function SettingsPage({ onBack, onResetAll, onResetBenefitUsage }) {
    const [showResetAllModal, setShowResetAllModal] = React.useState(false);
    const [showResetBenefitsModal, setShowResetBenefitsModal] = React.useState(false);

    const handleResetAll = () => {
        onResetAll();
        setShowResetAllModal(false);
    };

    const handleResetBenefitUsage = () => {
        onResetBenefitUsage();
        setShowResetBenefitsModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <span className="text-xl">←</span>
                                <span>Back to Dashboard</span>
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Management</h2>
                    
                    <div className="space-y-6">
                        {/* Reset Benefit Usage */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Benefit Usage</h3>
                            <p className="text-gray-600 mb-4">
                                This will reset all benefit usage states (used, subscribed, activated) back to their default values. 
                                Your cards will remain, but all benefits will be marked as unused.
                            </p>
                            <button
                                onClick={() => setShowResetBenefitsModal(true)}
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                            >
                                Reset Benefit Usage
                            </button>
                        </div>

                        {/* Reset All Data */}
                        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Reset All Data</h3>
                            <p className="text-red-700 mb-4">
                                <strong>Warning:</strong> This will permanently delete all your data including cards and benefit usage. 
                                This action cannot be undone.
                            </p>
                            <button
                                onClick={() => setShowResetAllModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                            >
                                Reset All Data
                            </button>
                        </div>

                        {/* Data Info */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Storage</h3>
                            <p className="text-gray-600 text-sm">
                                Your data is stored locally in your browser. No information is sent to any external servers. 
                                Data persists until you clear your browser data or use the reset functions above.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reset All Data Modal */}
            {showResetAllModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Reset All Data</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete all your data? This will remove all cards and benefit usage history. 
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowResetAllModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetAll}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                            >
                                Yes, Reset All Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Benefit Usage Modal */}
            {showResetBenefitsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Reset Benefit Usage</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to reset all benefit usage? This will mark all benefits as unused 
                            but keep your cards. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowResetBenefitsModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetBenefitUsage}
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
                            >
                                Yes, Reset Benefit Usage
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}