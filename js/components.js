// Add card modal component
function AddCardModal({ isOpen, onClose, onAdd, onAddCustom, existingCardIds }) {
    const [selectedCard, setSelectedCard] = React.useState('');
    const [showCustomModal, setShowCustomModal] = React.useState(false);

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

    const handleCreateCustom = () => {
        setShowCustomModal(true);
    };

    const handleCustomCardCreated = (customCard) => {
        onAddCustom(customCard);
        setShowCustomModal(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Add Credit Card</h2>
                    
                    {/* Create Custom Card Option */}
                    <div className="mb-4">
                        <label className="block p-4 border-2 border-purple-300 bg-purple-50 rounded-lg cursor-pointer transition-all hover:border-purple-400">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-purple-900">⭐ Create Custom Card</h3>
                                    <p className="text-sm text-purple-700">Design your own card with custom benefits</p>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={handleCreateCustom}
                                        className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-sm text-gray-500">or choose from existing cards</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    
                    {availableToAdd.length === 0 ? (
                        <p className="text-gray-600 mb-4">All available predefined cards have been added!</p>
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

            {/* Custom Card Modal */}
            <CustomCardModal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                onAdd={handleCustomCardCreated}
            />
        </>
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
        [BENEFIT_CATEGORY.INSURANCE]: '🛡️',
        [BENEFIT_CATEGORY.CUSTOM]: '⭐'
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
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{card.name}</h2>
                            {card.isCustom && (
                                <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full font-medium">
                                    ⭐ Custom
                                </span>
                            )}
                        </div>
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

// Custom Benefit Builder Component
function CustomBenefitBuilder({ benefit, onUpdate, onRemove, index }) {
    const [benefitData, setBenefitData] = React.useState(benefit || {
        name: '',
        description: '',
        category: BENEFIT_CATEGORY.CUSTOM,
        frequency: BENEFIT_FREQUENCY.ANNUAL,
        type: BENEFIT_TYPE.CREDIT,
        value: 0
    });

    React.useEffect(() => {
        onUpdate(index, benefitData);
    }, [benefitData]);

    const categoryOptions = [
        { value: BENEFIT_CATEGORY.TRAVEL, label: '✈️ Travel' },
        { value: BENEFIT_CATEGORY.DINING, label: '🍽️ Dining' },
        { value: BENEFIT_CATEGORY.ENTERTAINMENT, label: '🎭 Entertainment' },
        { value: BENEFIT_CATEGORY.SHOPPING, label: '🛍️ Shopping' },
        { value: BENEFIT_CATEGORY.RIDESHARE, label: '🚗 Rideshare' },
        { value: BENEFIT_CATEGORY.LOUNGE, label: '🛋️ Lounge' },
        { value: BENEFIT_CATEGORY.INSURANCE, label: '🛡️ Insurance' },
        { value: BENEFIT_CATEGORY.CUSTOM, label: '⭐ Custom' }
    ];

    const frequencyOptions = [
        { value: BENEFIT_FREQUENCY.MONTHLY, label: 'Monthly' },
        { value: BENEFIT_FREQUENCY.SEMI_ANNUAL, label: 'Semi-Annual' },
        { value: BENEFIT_FREQUENCY.ANNUAL, label: 'Annual' },
        { value: BENEFIT_FREQUENCY.FOUR_YEAR, label: 'Every 4 Years' },
        { value: BENEFIT_FREQUENCY.ONE_TIME, label: 'One Time' }
    ];

    const typeOptions = [
        { value: BENEFIT_TYPE.CREDIT, label: 'Credit' },
        { value: BENEFIT_TYPE.SUBSCRIPTION, label: 'Subscription' },
        { value: BENEFIT_TYPE.FEATURE, label: 'Feature' },
        { value: BENEFIT_TYPE.ONE_TIME, label: 'One-Time Credit' }
    ];

    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Benefit #{index + 1}</h4>
                <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove benefit"
                >
                    ✕
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Benefit Name *
                    </label>
                    <input
                        type="text"
                        value={benefitData.name}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., $10 Dining Credit"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value ($) *
                    </label>
                    <input
                        type="number"
                        value={benefitData.value}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        value={benefitData.category}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                    </label>
                    <select
                        value={benefitData.frequency}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, frequency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {frequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                    </label>
                    <select
                        value={benefitData.type}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {typeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={benefitData.description}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional description of the benefit"
                        rows="2"
                    />
                </div>
            </div>
        </div>
    );
}

// Custom Card Modal Component
function CustomCardModal({ isOpen, onClose, onAdd }) {
    const [cardData, setCardData] = React.useState({
        name: '',
        issuer: '',
        annualFee: 0,
        color: 'card-gradient-custom'
    });

    const [benefits, setBenefits] = React.useState([{
        name: '',
        description: '',
        category: BENEFIT_CATEGORY.CUSTOM,
        frequency: BENEFIT_FREQUENCY.ANNUAL,
        type: BENEFIT_TYPE.CREDIT,
        value: 0
    }]);

    const [errors, setErrors] = React.useState({});

    const colorOptions = [
        { value: 'card-gradient-custom', label: '🟣 Purple (Default)', color: 'linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%)' },
        { value: 'card-gradient-chase', label: '🔵 Blue', color: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' },
        { value: 'card-gradient-united', label: '🔷 Light Blue', color: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)' },
        { value: 'card-gradient-amex', label: '⚫ Gray', color: 'linear-gradient(135deg, #475569 0%, #64748b 100%)' }
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!cardData.name.trim()) {
            newErrors.cardName = 'Card name is required';
        }
        
        if (!cardData.issuer.trim()) {
            newErrors.issuer = 'Issuer is required';
        }
        
        if (cardData.annualFee < 0) {
            newErrors.annualFee = 'Annual fee cannot be negative';
        }

        // Validate benefits
        const benefitErrors = benefits.map((benefit, index) => {
            const errors = {};
            if (!benefit.name.trim()) {
                errors.name = 'Benefit name is required';
            }
            if (benefit.value < 0) {
                errors.value = 'Value cannot be negative';
            }
            return Object.keys(errors).length > 0 ? errors : null;
        }).filter(Boolean);

        if (benefitErrors.length > 0) {
            newErrors.benefits = benefitErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateBenefit = (index, benefitData) => {
        setBenefits(prev => {
            const newBenefits = [...prev];
            newBenefits[index] = benefitData;
            return newBenefits;
        });
    };

    const handleRemoveBenefit = (index) => {
        if (benefits.length > 1) {
            setBenefits(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddBenefit = () => {
        setBenefits(prev => [...prev, {
            name: '',
            description: '',
            category: BENEFIT_CATEGORY.CUSTOM,
            frequency: BENEFIT_FREQUENCY.ANNUAL,
            type: BENEFIT_TYPE.CREDIT,
            value: 0
        }]);
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        // Create the custom card with benefits
        const customCard = createCustomCard({
            ...cardData,
            benefits: benefits.map(benefit => createCustomBenefit(benefit))
        });

        onAdd(customCard);
        
        // Reset form
        setCardData({
            name: '',
            issuer: '',
            annualFee: 0,
            color: 'card-gradient-custom'
        });
        setBenefits([{
            name: '',
            description: '',
            category: BENEFIT_CATEGORY.CUSTOM,
            frequency: BENEFIT_FREQUENCY.ANNUAL,
            type: BENEFIT_TYPE.CREDIT,
            value: 0
        }]);
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Create Custom Card</h2>
                
                {/* Card Details Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Name *
                            </label>
                            <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.cardName ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., My Custom Card"
                            />
                            {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issuer *
                            </label>
                            <input
                                type="text"
                                value={cardData.issuer}
                                onChange={(e) => setCardData(prev => ({ ...prev, issuer: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.issuer ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., Chase, Amex, Custom Bank"
                            />
                            {errors.issuer && <p className="text-red-500 text-xs mt-1">{errors.issuer}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Annual Fee ($)
                            </label>
                            <input
                                type="number"
                                value={cardData.annualFee}
                                onChange={(e) => setCardData(prev => ({ ...prev, annualFee: parseFloat(e.target.value) || 0 }))}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.annualFee ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0"
                                min="0"
                                step="0.01"
                            />
                            {errors.annualFee && <p className="text-red-500 text-xs mt-1">{errors.annualFee}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Color
                            </label>
                            <select
                                value={cardData.color}
                                onChange={(e) => setCardData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {colorOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Benefits</h3>
                        <button
                            onClick={handleAddBenefit}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                            + Add Benefit
                        </button>
                    </div>
                    
                    {benefits.map((benefit, index) => (
                        <CustomBenefitBuilder
                            key={index}
                            benefit={benefit}
                            index={index}
                            onUpdate={handleUpdateBenefit}
                            onRemove={handleRemoveBenefit}
                        />
                    ))}
                </div>
                
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Create Custom Card
                    </button>
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