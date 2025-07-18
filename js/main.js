// Data definitions
const BENEFIT_FREQUENCY = {
    MONTHLY: 'monthly',
    SEMI_ANNUAL: 'semi_annual',
    ANNUAL: 'annual',
    FOUR_YEAR: 'four_year',
    ONE_TIME: 'one_time'
};

const BENEFIT_TYPE = {
    CREDIT: 'credit',
    SUBSCRIPTION: 'subscription',
    FEATURE: 'feature',
    ONE_TIME: 'one_time'
};

const BENEFIT_CATEGORY = {
    TRAVEL: 'travel',
    DINING: 'dining',
    ENTERTAINMENT: 'entertainment',
    SHOPPING: 'shopping',
    RIDESHARE: 'rideshare',
    LOUNGE: 'lounge',
    INSURANCE: 'insurance'
};

// Available credit cards database
const availableCards = {
    'chase-sapphire-reserve': {
        id: 'chase-sapphire-reserve',
        name: 'Chase Sapphire Reserve',
        issuer: 'Chase',
        annualFee: 795,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'csr-travel-credit',
                name: '$300 Travel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Annual travel credit for flights, hotels, car rentals, and more',
                used: false
            },
            {
                id: 'csr-doordash',
                name: 'DoorDash DashPass',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 120,
                description: 'Complimentary DoorDash DashPass membership',
                subscribed: false
            },
            {
                id: 'csr-stubhub',
                name: '$300 StubHub/Viagogo Credit',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Annual credit for event tickets ($25/month accumulation)',
                used: false
            },
            {
                id: 'csr-hotel-jan',
                name: '$250 The Edit Hotel (Jan-Jun)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Semi-annual hotel credit for The Edit properties',
                used: false
            },
            {
                id: 'csr-hotel-jul',
                name: '$250 The Edit Hotel (Jul-Dec)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Semi-annual hotel credit for The Edit properties',
                used: false
            },
            {
                id: 'csr-tsa',
                name: 'TSA PreCheck/Global Entry',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 120,
                description: '$120 credit every 4 years',
                used: false
            },
            {
                id: 'csr-priority-pass',
                name: 'Priority Pass + Lounges',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 429,
                description: 'Unlimited lounge access',
                activated: true
            }
        ]
    },
    'united-quest': {
        id: 'united-quest',
        name: 'United Quest',
        issuer: 'Chase',
        annualFee: 350,
        color: 'card-gradient-united',
        benefits: [
            {
                id: 'uq-travel-bank',
                name: '$200 United TravelBank',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Annual United travel credit',
                used: false
            },
            {
                id: 'uq-hotel-credit',
                name: '$150 Renowned Hotels',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Annual hotel credit',
                used: false
            },
            {
                id: 'uq-jsx',
                name: '$150 JSX Flights',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Annual JSX flight credit',
                used: false
            },
            {
                id: 'uq-instacart-10',
                name: '$10 Instacart Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Monthly Instacart credit',
                used: false
            },
            {
                id: 'uq-instacart-5',
                name: '$5 Instacart Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 5,
                description: 'Additional monthly Instacart credit',
                used: false
            },
            {
                id: 'uq-rideshare',
                name: '$8 Rideshare Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 8,
                description: 'Monthly rideshare credit ($12 in December)',
                used: false
            },
            {
                id: 'uq-avis-budget',
                name: '$80 Avis/Budget',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 80,
                description: 'Annual car rental credits',
                used: false
            },
            {
                id: 'uq-tsa',
                name: 'TSA PreCheck/Global Entry',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 120,
                description: '$120 credit every 4 years',
                used: false
            },
            {
                id: 'uq-checked-bags',
                name: '2 Free Checked Bags',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 360,
                description: 'Save up to $360/year on bag fees',
                activated: true
            }
        ]
    },
    'amex-platinum': {
        id: 'amex-platinum',
        name: 'Amex Platinum',
        issuer: 'American Express',
        annualFee: 695,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'amex-airline',
                name: '$200 Airline Fee Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Selected airline incidental fees',
                used: false
            },
            {
                id: 'amex-hotel',
                name: '$200 Hotel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Fine Hotels + Resorts or Hotel Collection',
                used: false
            },
            {
                id: 'amex-uber',
                name: '$15 Uber Cash',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 15,
                description: 'Monthly Uber credit ($35 in December)',
                used: false
            },
            {
                id: 'amex-entertainment',
                name: '$20 Digital Entertainment',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 20,
                description: 'Disney+, Hulu, ESPN+, NYT, WSJ, Peacock',
                subscribed: false
            },
            {
                id: 'amex-saks-jan',
                name: '$50 Saks (Jan-Jun)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Semi-annual Saks Fifth Avenue credit',
                used: false
            },
            {
                id: 'amex-saks-jul',
                name: '$50 Saks (Jul-Dec)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Semi-annual Saks Fifth Avenue credit',
                used: false
            },
            {
                id: 'amex-tsa',
                name: 'TSA PreCheck/Global Entry',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 100,
                description: '$100 credit every 4 years',
                used: false
            },
            {
                id: 'amex-centurion',
                name: 'Centurion Lounges',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 500,
                description: 'Unlimited Centurion Lounge access',
                activated: true
            },
            {
                id: 'amex-walmart',
                name: 'Walmart+ Membership',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 155,
                description: 'Complimentary Walmart+ membership',
                subscribed: false
            }
        ]
    },
    'amex-gold': {
        id: 'amex-gold',
        name: 'Amex Gold',
        issuer: 'American Express',
        annualFee: 325,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'amex-gold-dining',
                name: '$120 Dining Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: '$10/month at Grubhub, The Cheesecake Factory, and others',
                used: false
            },
            {
                id: 'amex-gold-uber',
                name: '$120 Uber Cash',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: '$10/month Uber credit',
                used: false
            },
            {
                id: 'amex-gold-resy',
                name: '$100 Resy Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Annual Resy credit',
                used: false
            }
        ]
    },
    'chase-sapphire-preferred': {
        id: 'chase-sapphire-preferred',
        name: 'Chase Sapphire Preferred',
        issuer: 'Chase',
        annualFee: 95,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'csp-hotel-credit',
                name: '$50 Hotel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Annual hotel credit through Chase Travel',
                used: false
            }
        ]
    },
    'capital-one-venture-x': {
        id: 'capital-one-venture-x',
        name: 'Capital One Venture X',
        issuer: 'Capital One',
        annualFee: 395,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'venture-x-travel',
                name: '$300 Travel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Annual travel credit through Capital One Travel',
                used: false
            },
            {
                id: 'venture-x-tsa',
                name: 'TSA PreCheck/Global Entry',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 100,
                description: '$100 credit every 4 years',
                used: false
            },
            {
                id: 'venture-x-lounge',
                name: 'Priority Pass + Plaza Premium',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 429,
                description: 'Unlimited lounge access',
                activated: true
            }
        ]
    },
    'citi-prestige': {
        id: 'citi-prestige',
        name: 'Citi Prestige',
        issuer: 'Citi',
        annualFee: 495,
        color: 'card-gradient-united',
        benefits: [
            {
                id: 'prestige-travel-credit',
                name: '$250 Travel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Annual travel credit',
                used: false
            }
        ]
    }
};

// Helper function to get current benefit amount based on date
const getCurrentBenefitAmount = (benefit, frequency) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    switch (frequency) {
        case BENEFIT_FREQUENCY.SEMI_ANNUAL:
            // For semi-annual benefits, return half the value
            if (benefit.name.includes('Jan-Jun') && currentMonth >= 6) {
                return 0; // This period has passed
            }
            if (benefit.name.includes('Jul-Dec') && currentMonth < 6) {
                return 0; // This period hasn't started
            }
            return benefit.value;
        case BENEFIT_FREQUENCY.ANNUAL:
            // For annual benefits that accumulate monthly
            if (benefit.name === '$300 StubHub/Viagogo Credit') {
                // $25 per month
                return Math.min(25 * (currentMonth + 1), 300);
            }
            return benefit.value;
        case BENEFIT_FREQUENCY.FOUR_YEAR:
            // TSA PreCheck is $120 every 4 years, not annual
            return benefit.value;
        default:
            return benefit.value;
    }
};

// Helper functions
const getExpirationDate = (frequency) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    switch (frequency) {
        case BENEFIT_FREQUENCY.MONTHLY:
            return new Date(currentYear, currentMonth + 1, 0);
        case BENEFIT_FREQUENCY.SEMI_ANNUAL:
            if (currentMonth < 6) {
                return new Date(currentYear, 5, 30);
            } else {
                return new Date(currentYear, 11, 31);
            }
        case BENEFIT_FREQUENCY.ANNUAL:
            return new Date(currentYear, 11, 31);
        case BENEFIT_FREQUENCY.FOUR_YEAR:
            return new Date(currentYear + 4, 11, 31);
        default:
            return new Date(currentYear, 11, 31);
    }
};

const daysUntilExpiration = (expirationDate) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

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

    const handleRemoveCard = (cardId) => {
        if (window.confirm('Are you sure you want to remove this card?')) {
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
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
            !benefit.used && !benefit.subscribed && benefit.type !== BENEFIT_TYPE.FEATURE
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Credit Card Benefit Tracker</h1>
                        <div className="flex gap-2">
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
                existingCardIds={cards.map(card => card.id)}
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);