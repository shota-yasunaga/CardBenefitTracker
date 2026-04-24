const { useState, useEffect } = React;
// Formspree setup:
// 1) Create a form at https://formspree.io/ and copy your endpoint.
// 2) Replace REPLACE_ME below with your form ID.
// 3) Verify recipient email and submit one test message from the app.
const FEEDBACK_FORM_ENDPOINT = 'https://formspree.io/f/xvzdabnp';
const FEEDBACK_FALLBACK_EMAIL = 'shotadevelops@gmail.com';

function ContextualFeedbackForm({
    contextType,
    title = 'Share feedback',
    prompt = 'Tell us what is missing or incorrect.',
    compact = false,
    quickActions = [],
    defaultIssueType = 'other',
    pageMeta = ''
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [issueType, setIssueType] = useState(defaultIssueType);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIssueType(defaultIssueType);
    }, [defaultIssueType]);

    const isEndpointConfigured = !FEEDBACK_FORM_ENDPOINT.includes('REPLACE_ME');

    const openFeedback = (nextIssueType) => {
        setIsExpanded(true);
        if (nextIssueType) {
            setIssueType(nextIssueType);
        }
    };

    const closeFeedback = () => {
        setIsExpanded(false);
        setStatus({ type: '', text: '' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!message.trim()) {
            setStatus({ type: 'error', text: 'Please add a short description before submitting.' });
            return;
        }

        if (!isEndpointConfigured) {
            setStatus({
                type: 'error',
                text: `Feedback form is not connected yet. Replace FEEDBACK_FORM_ENDPOINT, or email ${FEEDBACK_FALLBACK_EMAIL}.`
            });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const response = await fetch(FEEDBACK_FORM_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    issueType,
                    message: message.trim(),
                    email: email.trim() || undefined,
                    contextType,
                    pageMeta,
                    submittedAt: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent
                })
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            setStatus({ type: 'success', text: 'Thanks for the report. It was sent successfully.' });
            setMessage('');
            setEmail('');
            setIssueType(defaultIssueType);
        } catch (error) {
            setStatus({
                type: 'error',
                text: `We could not send your feedback right now. You can also email ${FEEDBACK_FALLBACK_EMAIL}.`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`feedback-card ${compact ? 'feedback-card-compact' : ''}`}>
            {!isExpanded ? (
                <div>
                    <div className="feedback-card-header">
                        <h4 className="feedback-card-title">{title}</h4>
                        <p className="feedback-card-prompt">{prompt}</p>
                    </div>
                    <div className="feedback-cta-group">
                        {quickActions.map((action) => (
                            <button
                                key={`${contextType}-${action.issueType}-${action.label}`}
                                onClick={() => openFeedback(action.issueType)}
                                className="feedback-cta-button"
                                type="button"
                            >
                                {action.label}
                            </button>
                        ))}
                        {quickActions.length === 0 && (
                            <button
                                onClick={() => openFeedback(defaultIssueType)}
                                className="feedback-cta-button"
                                type="button"
                            >
                                Open feedback form
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="feedback-form-row">
                        <label htmlFor={`${contextType}-issueType`} className="feedback-label">Issue type</label>
                        <select
                            id={`${contextType}-issueType`}
                            className="feedback-input"
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                        >
                            <option value="missing_card">Missing card</option>
                            <option value="missing_benefit">Missing benefit</option>
                            <option value="incorrect_benefit">Incorrect benefit details</option>
                            <option value="feature_request">Feature request</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="feedback-form-row">
                        <label htmlFor={`${contextType}-message`} className="feedback-label">What should be fixed?</label>
                        <textarea
                            id={`${contextType}-message`}
                            className="feedback-input feedback-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Example: Chase Freedom Flex is missing, or the dining credit amount is outdated."
                            rows="3"
                        />
                    </div>

                    <div className="feedback-form-row">
                        <label htmlFor={`${contextType}-email`} className="feedback-label">Email (optional)</label>
                        <input
                            id={`${contextType}-email`}
                            type="email"
                            className="feedback-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    {status.text && (
                        <p className={`feedback-status ${status.type === 'success' ? 'feedback-status-success' : 'feedback-status-error'}`}>
                            {status.text}
                        </p>
                    )}

                    <div className="feedback-form-actions">
                        <button type="button" className="feedback-secondary-button" onClick={closeFeedback}>
                            Cancel
                        </button>
                        <button type="submit" className="feedback-primary-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send feedback'}
                        </button>
                    </div>
                </form>
            )}
            {!isEndpointConfigured && (
                <p className="feedback-helper-text">
                    Setup needed: replace `FEEDBACK_FORM_ENDPOINT` with your Formspree URL to enable submissions.
                </p>
            )}
        </div>
    );
}


// Components
function BenefitCard({ benefit, cardId, cardName, onToggle, onUndo, isRecentlyUsed, isUndoableUsed, viewMode = 'card' }) {
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
                <div className="flex gap-2">
                    <button
                        onClick={() => onToggle(cardId, benefit.id)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            benefit.subscribed
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {benefit.subscribed ? 'Subscribed' : 'Mark subscribed'}
                    </button>
                    {isUndoableUsed && benefit.subscribed && (
                        <button
                            onClick={() => onUndo(cardId, benefit.id)}
                            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                        >
                            Undo
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="flex gap-2">
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
                {isUndoableUsed && benefit.used && (
                    <button
                        onClick={() => onUndo(cardId, benefit.id)}
                        className="px-3 py-1 rounded-md text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                        Undo
                    </button>
                )}
            </div>
        );
    };

    if (viewMode === 'list') {
        const stickyCellClass = `sticky left-0 z-10 py-3 px-6 min-w-[200px] ${isUsed ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-800'} shadow-[2px_0_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.3)]`;
        return (
            <div className={`grid grid-cols-subgrid col-span-5 border-b border-slate-200 dark:border-slate-700 ${isUsed ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
                <div className={stickyCellClass}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                            {categoryIcons[benefit.category]}
                        </div>
                        <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">{benefit.name}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</div>
                        </div>
                    </div>
                </div>
                <div className="py-3 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">{cardName}</div>
                <div className="py-3 px-6">
                    <span className={`text-xs px-2 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                    </span>
                </div>
                <div className="py-3 px-6 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR 
                        ? formatCurrency(currentAmount) 
                        : formatCurrency(benefit.value)}
                </div>
                <div className="py-3 px-6 text-right">{renderButton()}</div>
            </div>
        );
    }

    return (
        <div className={`benefit-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50 ${isUsed ? 'opacity-60' : ''} hover:shadow-2xl transition-all duration-300`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                            {categoryIcons[benefit.category]}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{benefit.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(currentAmount)}
                        </span>
                    )}
                    {benefit.frequency === BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(benefit.value)}
                        </span>
                    )}
                </div>
                
                {renderButton()}
            </div>
        </div>
    );
}

function CreditCardSection({ card, onToggle, onRemove, onUndo, recentlyUsed, undoableUsed }) {
    return (
        <div className="mb-8">
            <div className={`${card.color} text-white rounded-t-xl p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{card.name}</h2>
                        <p className="text-white/90 text-lg">{card.issuer}</p>
                        <p className="text-white/80 text-sm mt-1">Annual Fee: {formatCurrency(card.annualFee)}</p>
                    </div>
                    <button
                        onClick={() => onRemove(card.id)}
                        className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
                        title="Remove card"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-b-xl p-6 shadow-lg border-x border-b border-slate-200 dark:border-slate-700">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {card.benefits.map(benefit => (
                        <BenefitCard
                            key={benefit.id}
                            benefit={benefit}
                            cardId={card.id}
                            cardName={card.name}
                            onToggle={onToggle}
                            onUndo={onUndo}
                            isRecentlyUsed={recentlyUsed.has(benefit.id)}
                            isUndoableUsed={undoableUsed.has(benefit.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Add Card Page Component
function AddCardPage({ onAddCard, onAddCustom, onBack, existingCardIds }) {
    const [selectedCards, setSelectedCards] = useState(new Set());
    const [showQuickAddModal, setShowQuickAddModal] = useState(false);
    
    // Group cards by issuer
    const groupedCards = Object.values(availableCards).reduce((acc, card) => {
        if (!existingCardIds.includes(card.id)) {
            if (!acc[card.issuer]) {
                acc[card.issuer] = [];
            }
            acc[card.issuer].push(card);
        }
        return acc;
    }, {});
    
    const handleCardToggle = (cardId) => {
        const newSelected = new Set(selectedCards);
        if (newSelected.has(cardId)) {
            newSelected.delete(cardId);
        } else {
            newSelected.add(cardId);
        }
        setSelectedCards(newSelected);
    };
    
    const handleAddSelected = () => {
        selectedCards.forEach(cardId => onAddCard(cardId));
        setSelectedCards(new Set());
        onBack();
    };
    
    const totalBenefitValue = (card) => {
        return card.benefits.reduce((sum, benefit) => sum + benefit.value, 0);
    };
    
    // Add at the top of AddCardPage function, after const [selectedCards...
    const cardImages = {
        'chase-sapphire-reserve': 'assets/cards/chase-sapphire-reserve.png',
        'chase-sapphire-preferred': 'assets/cards/chase-sapphire-preferred.jpg',
        'united-quest': 'assets/cards/united-quest.png',
        'world-of-hyatt': 'assets/cards/world-of-hyatt.jpg',
        'ihg-one-rewards': 'assets/cards/ihg-one-rewards.jpg',
        'amex-platinum': 'assets/cards/amex-platinum.jpg',
        'amex-gold': 'assets/cards/amex-gold.jpg',
        'amex-green': 'assets/cards/amex-green.jpg',
        'amex-business-platinum': 'assets/cards/amex-business-platinum.jpg',
        'amex-marriott-brilliant': 'assets/cards/amex-marriott-brilliant.jpg',
        'amex-hilton-aspire': 'assets/cards/amex-hilton-aspire.jpg',
        'amex-delta-reserve': 'assets/cards/amex-delta-reserve.jpg',
        'capital-one-venture-x': 'assets/cards/capital-one-venture-x.jpg',
        'capital-one-venture': 'assets/cards/capital-one-venture.jpg',
        'capital-one-savor': 'assets/cards/capital-one-savor.jpg',
        'citi-prestige': 'assets/cards/citi-prestige.jpg',
        'citi-premier': 'assets/cards/citi-premier.jpg',
        'citi-aadvantage-executive': 'assets/cards/citi-aadvantage-executive.jpg',
        'wells-fargo-autograph': 'assets/cards/wells-fargo-autograph.jpg',
        'bofa-premium-rewards': 'assets/cards/bofa-premium-rewards.jpg'
    };
    
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
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
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Credit Cards</h1>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setShowQuickAddModal(true)}
                                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Quick add / custom card
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedCards.size} card{selectedCards.size !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={handleAddSelected}
                                disabled={selectedCards.size === 0}
                                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                    selectedCards.size > 0
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Add Selected Cards
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {Object.keys(groupedCards).length === 0 ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">All Available Cards Added</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">You've already added all available premium credit cards to your collection.</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    Object.entries(groupedCards).map(([issuer, cards]) => (
                        <div key={issuer} className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                                    issuer === 'Chase' ? 'bg-blue-600' :
                                    issuer === 'American Express' ? 'bg-gray-600' :
                                    issuer === 'Capital One' ? 'bg-red-600' :
                                    issuer === 'Citi' ? 'bg-blue-800' :
                                    issuer === 'Wells Fargo' ? 'bg-green-600' :
                                    issuer === 'Bank of America' ? 'bg-red-700' : 'bg-indigo-600'
                                }`}>
                                    {issuer[0]}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {issuer} Cards
                                </h2>
                            </div>
                            <hr className="mb-6 border-gray-200 dark:border-gray-700" />
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {cards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                                            selectedCards.has(card.id)
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                        onClick={() => handleCardToggle(card.id)}
                                    >
                                        {selectedCards.has(card.id) && (
                                            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                                ✓
                                            </div>
                                        )}
                                        
                                        <div className={`${card.color} text-white rounded-t-lg p-4`}>
                                            <h3 className="text-lg font-bold mb-1">{card.name}</h3>
                                            <p className="text-white/80 text-sm">Annual Fee: {formatCurrency(card.annualFee)}</p>
                                        </div>
                                        
                                        <div className="p-4 bg-white dark:bg-gray-800">
                                            <div
                                                className="relative w-full max-w-md mx-auto rounded-lg shadow-md overflow-hidden bg-gray-100 dark:bg-gray-700"
                                                style={{ aspectRatio: '1.586 / 1' }}
                                            >
                                                <img 
                                                    src={cardImages[card.id] || `https://via.placeholder.com/300x200?text=${encodeURIComponent(card.name)}`} 
                                                    alt={`${card.name} card`} 
                                                    className="absolute inset-0 w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {card.benefits.length} benefit{card.benefits.length !== 1 ? 's' : ''}
                                                </p>
                                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                                    Total Value: {formatCurrency(totalBenefitValue(card))}
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                {card.benefits.slice(0, 3).map(benefit => (
                                                    <div key={benefit.id} className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-700 dark:text-gray-300 truncate">{benefit.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 font-medium ml-2">
                                                            {formatCurrency(benefit.value)}
                                                        </span>
                                                    </div>
                                                ))}
                                                {card.benefits.length > 3 && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                        +{card.benefits.length - 3} more benefit{card.benefits.length - 3 !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <div className="mt-8">
                    <ContextualFeedbackForm
                        contextType="add-cards-page"
                        title="Don't see your credit card?"
                        prompt="Report missing cards or request a new card to be added."
                        defaultIssueType="missing_card"
                        pageMeta="add-cards"
                        quickActions={[
                            { label: "Don't see your card?", issueType: 'missing_card' },
                            { label: 'Request a new card', issueType: 'feature_request' }
                        ]}
                    />
                </div>
            </main>
            <AddCardModal
                isOpen={showQuickAddModal}
                onClose={() => setShowQuickAddModal(false)}
                onAdd={onAddCard}
                onAddCustom={onAddCustom}
                existingCardIds={existingCardIds}
            />
        </div>
    );
}

// Settings Page Component
function SettingsPage({ onBack, onResetAll, onResetBenefitUsage }) {
    const [showResetAllModal, setShowResetAllModal] = useState(false);
    const [showResetBenefitsModal, setShowResetBenefitsModal] = useState(false);

    const handleResetAll = () => {
        onResetAll();
        setShowResetAllModal(false);
    };

    const handleResetBenefitUsage = () => {
        onResetBenefitUsage();
        setShowResetBenefitsModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <span className="text-xl">←</span>
                                <span>Back to Dashboard</span>
                            </button>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Data Management</h2>
                    
                    <div className="space-y-6">
                        {/* Reset Benefit Usage */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Reset Benefit Usage</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
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
                        <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Reset All Data</h3>
                            <p className="text-red-700 dark:text-red-400 mb-4">
                                <strong>Warning:</strong> This will permanently delete all your cards and active benefit usage state.
                                Usage history records are retained for audit purposes.
                            </p>
                            <button
                                onClick={() => setShowResetAllModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                            >
                                Reset All Data
                            </button>
                        </div>

                        {/* Data Info */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Data Storage</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
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
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Confirm Reset All Data</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to delete all your cards and active usage state?
                            Usage history will be kept.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowResetAllModal(false)}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Confirm Reset Benefit Usage</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Are you sure you want to reset all benefit usage? This will mark all benefits as unused 
                            but keep your cards. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowResetBenefitsModal(false)}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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

function UsageHistoryPage({ historyEvents, cards, onBack }) {
    const [selectedCardId, setSelectedCardId] = useState('all');
    const [selectedAction, setSelectedAction] = useState('all');
    const [groupMode, setGroupMode] = useState('date');
    const [fromDate, setFromDate] = useState('');
    const [toDateFilter, setToDateFilter] = useState('');

    const cardOptions = React.useMemo(() => {
        const options = [{ id: 'all', name: 'All Cards' }];
        cards.forEach((card) => options.push({ id: card.id, name: card.name }));
        return options;
    }, [cards]);

    const filteredEvents = React.useMemo(() => {
        return historyEvents.filter((event) => {
            if (selectedCardId !== 'all' && event.cardId !== selectedCardId) return false;
            if (selectedAction !== 'all' && event.action !== selectedAction) return false;

            const eventDate = toDate(event.timestamp);
            if (fromDate) {
                const from = new Date(`${fromDate}T00:00:00`);
                if (eventDate < from) return false;
            }
            if (toDateFilter) {
                const to = new Date(`${toDateFilter}T23:59:59`);
                if (eventDate > to) return false;
            }
            return true;
        });
    }, [historyEvents, selectedCardId, selectedAction, fromDate, toDateFilter]);

    const groupedEvents = React.useMemo(() => {
        return filteredEvents.reduce((acc, event) => {
            const date = toDate(event.timestamp);
            const groupKey = groupMode === 'period'
                ? `${event.periodKey || 'unknown'}::${event.frequency || 'unknown'}`
                : date.toISOString().slice(0, 10);
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(event);
            return acc;
        }, {});
    }, [filteredEvents, groupMode]);

    const sortedGroupKeys = React.useMemo(() => {
        return Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));
    }, [groupedEvents]);

    const actionLabel = {
        used: 'Marked used',
        undo_used: 'Usage undone',
        subscribed: 'Subscribed',
        unsubscribed: 'Unsubscribed',
        reset_usage: 'Reset benefit usage',
        reset_all: 'Reset all data'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <span className="text-xl">←</span>
                                <span>Back to Dashboard</span>
                            </button>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usage History</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <select
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"
                        >
                            {cardOptions.map((card) => (
                                <option key={card.id} value={card.id}>{card.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedAction}
                            onChange={(e) => setSelectedAction(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"
                        >
                            <option value="all">All Actions</option>
                            <option value="used">Marked used</option>
                            <option value="undo_used">Usage undone</option>
                            <option value="subscribed">Subscribed</option>
                            <option value="unsubscribed">Unsubscribed</option>
                            <option value="reset_usage">Reset usage</option>
                            <option value="reset_all">Reset all</option>
                        </select>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"
                        />
                        <input
                            type="date"
                            value={toDateFilter}
                            onChange={(e) => setToDateFilter(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"
                        />
                        <select
                            value={groupMode}
                            onChange={(e) => setGroupMode(e.target.value)}
                            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"
                        >
                            <option value="date">Group by Date</option>
                            <option value="period">Group by Period</option>
                        </select>
                    </div>
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No usage events yet</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Mark a benefit as used or subscription as subscribed to start building history.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {sortedGroupKeys.map((groupKey) => {
                            const events = groupedEvents[groupKey].slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                            const [periodKey, frequency] = groupKey.split('::');
                            const title = groupMode === 'period'
                                ? formatPeriodLabel(periodKey, frequency)
                                : groupKey;
                            return (
                                <div key={groupKey} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-slate-200/70 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-700/60">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-200/70 dark:divide-slate-700/70">
                                        {events.map((event) => (
                                            <div key={event.id} className="px-5 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {event.benefitName || 'Bulk action'} {actionLabel[event.action] || event.action}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {event.cardName || 'All cards'} · {new Date(event.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                                    {event.periodKey ? `Period: ${formatPeriodLabel(event.periodKey, event.frequency)}` : 'No period'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

// Restored: modal-based add flow (includes custom card builder) — not duplicated in old inline app
// Add card modal component
function AddCardModal({ isOpen, onClose, onAdd, onAddCustom, existingCardIds }) {
    const [selectedCard, setSelectedCard] = useState('');
    const [showCustomModal, setShowCustomModal] = useState(false);

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

function CustomBenefitBuilder({ benefit, onUpdate, onRemove, index }) {
    const [benefitData, setBenefitData] = useState(benefit || {
        name: '',
        description: '',
        category: BENEFIT_CATEGORY.CUSTOM,
        frequency: BENEFIT_FREQUENCY.ANNUAL,
        type: BENEFIT_TYPE.CREDIT,
        value: 0
    });

    useEffect(() => {
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
    const [cardData, setCardData] = useState({
        name: '',
        issuer: '',
        annualFee: 0,
        color: 'card-gradient-custom'
    });

    const [benefits, setBenefits] = useState([{
        name: '',
        description: '',
        category: BENEFIT_CATEGORY.CUSTOM,
        frequency: BENEFIT_FREQUENCY.ANNUAL,
        type: BENEFIT_TYPE.CREDIT,
        value: 0
    }]);

    const [errors, setErrors] = useState({});

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
