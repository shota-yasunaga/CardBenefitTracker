const { useState, useEffect, useRef } = React;
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
    
    let expirationColor = 'text-ink-muted';
    let expirationBg = 'bg-paper-rail';
    if (daysLeft <= 7) {
        expirationColor = 'text-rust';
        expirationBg = 'bg-rust-tint-bg';
    } else if (daysLeft <= 30) {
        expirationColor = 'text-rust';
        expirationBg = 'bg-rust-tint-bg';
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
                <span className="text-sm text-ink font-medium">
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
                                ? 'bg-ink text-night-text'
                                : 'bg-ink text-night-text'
                        }`}
                    >
                        {benefit.subscribed ? 'Subscribed' : 'Mark subscribed'}
                    </button>
                    {isUndoableUsed && benefit.subscribed && (
                        <button
                            onClick={() => onUndo(cardId, benefit.id)}
                            className="rounded-[11px] px-3 py-1 text-sm font-medium bg-ink text-night-text"
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
                            ? 'bg-pill-bg text-ink-faint cursor-not-allowed'
                            : 'bg-ink text-night-text'
                    }`}
                    disabled={benefit.used}
                >
                    {benefit.used ? 'Used' : 'Mark Used'}
                </button>
                {isUndoableUsed && benefit.used && (
                    <button
                        onClick={() => onUndo(cardId, benefit.id)}
                        className="rounded-[11px] px-3 py-1 text-sm font-medium bg-ink text-night-text"
                    >
                        Undo
                    </button>
                )}
            </div>
        );
    };

    if (viewMode === 'list') {
        const stickyCellClass = `sticky left-0 z-10 py-3 px-6 min-w-[200px] ${isUsed ? 'bg-paper-rail' : 'bg-paper-raised'}`;
        return (
            <div className="grid grid-cols-subgrid col-span-5 border-b border-rule">
                <div className={stickyCellClass}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-night-text text-sm">
                            {categoryIcons[benefit.category]}
                        </div>
                        <div>
                            <div className="font-medium text-ink">{benefit.name}</div>
                            <div className="text-sm text-ink-muted">{benefit.description}</div>
                        </div>
                    </div>
                </div>
                <div className="py-3 px-6 text-sm font-medium text-ink-3">{cardName}</div>
                <div className="py-3 px-6">
                    <span className={`text-xs px-2 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                    </span>
                </div>
                <div className="py-3 px-6 text-sm font-medium text-ink">
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR 
                        ? formatCurrency(currentAmount) 
                        : formatCurrency(benefit.value)}
                </div>
                <div className="py-3 px-6 text-right">{renderButton()}</div>
            </div>
        );
    }

    return (
        <div className={`benefit-card bg-paper-raised rounded-[18px] p-6 border border-line-card ${isUsed ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-night-text text-lg">
                            {categoryIcons[benefit.category]}
                        </div>
                        <div>
                            <h4 className="font-semibold text-ink text-lg">{benefit.name}</h4>
                            <p className="text-sm text-ink-muted">{benefit.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-rule">
                <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${expirationBg} ${expirationColor} font-medium`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                    {benefit.type === BENEFIT_TYPE.CREDIT && benefit.frequency !== BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="font-mono text-[12px] text-ink-muted">
                            {formatCurrency(currentAmount)}
                        </span>
                    )}
                    {benefit.frequency === BENEFIT_FREQUENCY.FOUR_YEAR && (
                        <span className="font-mono text-[12px] text-ink-muted">
                            {formatCurrency(benefit.value)}
                        </span>
                    )}
                </div>
                
                {renderButton()}
            </div>
        </div>
    );
}

const BENEFIT_URGENCY_DAYS = 30;
const TODAY_MAIN_LIST_DAYS = 92;

const benefitFrequencyLabels = {
    [BENEFIT_FREQUENCY.MONTHLY]: 'MONTHLY',
    [BENEFIT_FREQUENCY.SEMI_ANNUAL]: 'SEMI-ANNUAL',
    [BENEFIT_FREQUENCY.ANNUAL]: 'ANNUAL',
    [BENEFIT_FREQUENCY.FOUR_YEAR]: 'EVERY 4 YEARS',
    [BENEFIT_FREQUENCY.ONE_TIME]: 'ONE TIME'
};

const benefitTypeLabels = {
    [BENEFIT_TYPE.CREDIT]: 'CREDIT',
    [BENEFIT_TYPE.SUBSCRIPTION]: 'SUBSCRIPTION',
    [BENEFIT_TYPE.FEATURE]: 'FEATURE',
    [BENEFIT_TYPE.ONE_TIME]: 'ONE-TIME'
};

function isBenefitComplete(benefit) {
    if (benefit.type === BENEFIT_TYPE.FEATURE) return true;
    if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) return Boolean(benefit.subscribed);
    return Boolean(benefit.used);
}

function isActionableBenefit(benefit) {
    return benefit.type !== BENEFIT_TYPE.FEATURE;
}

function getBenefitPeriodStart(benefit, referenceDate = new Date()) {
    const periodKey = getPeriodKey(benefit.frequency, referenceDate, benefit);
    const year = referenceDate.getFullYear();

    switch (benefit.frequency) {
        case BENEFIT_FREQUENCY.MONTHLY:
            return new Date(year, referenceDate.getMonth(), 1);
        case BENEFIT_FREQUENCY.SEMI_ANNUAL:
            return new Date(year, periodKey.endsWith('H1') ? 0 : 6, 1);
        case BENEFIT_FREQUENCY.FOUR_YEAR:
            return new Date(Number(periodKey.split('-')[0]), 0, 1);
        case BENEFIT_FREQUENCY.ANNUAL:
        case BENEFIT_FREQUENCY.ONE_TIME:
        default:
            return new Date(year, 0, 1);
    }
}

function getBenefitPeriodMeta(benefit, referenceDate = new Date()) {
    const expirationDate = getExpirationDate(benefit.frequency, referenceDate);
    const startDate = getBenefitPeriodStart(benefit, referenceDate);
    const elapsed = referenceDate.getTime() - startDate.getTime();
    const duration = Math.max(1, expirationDate.getTime() - startDate.getTime());

    return {
        expirationDate,
        startDate,
        daysLeft: daysUntilExpiration(expirationDate),
        progress: Math.max(0, Math.min(100, Math.round((elapsed / duration) * 100)))
    };
}

function formatBenefitDate(date) {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date).toUpperCase();
}

function formatTodayHeading(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    }).format(date).toUpperCase();
}

function formatDaysRemaining(days) {
    if (days < 0) return 'EXPIRED';
    if (days === 0) return 'TODAY';
    return `${days} ${days === 1 ? 'DAY' : 'DAYS'}`;
}

function DashboardPill({ active, onClick, children, pressed }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={typeof pressed === 'boolean' ? pressed : active}
            className={`font-mono text-[10.5px] tracking-[.08em] px-[13px] py-[7px] rounded-full border ${
                active ? 'bg-ink border-ink text-night-text' : 'bg-transparent border-line-strong text-ink-4'
            }`}
        >
            {children}
        </button>
    );
}

function BenefitCircle({ benefit, cardId, onToggle, onUndo, urgent = false }) {
    const complete = isBenefitComplete(benefit);
    const isFeature = benefit.type === BENEFIT_TYPE.FEATURE;
    const actionWord = benefit.type === BENEFIT_TYPE.SUBSCRIPTION ? 'subscribed' : 'used';
    const label = isFeature
        ? `${benefit.name} is always active`
        : complete
            ? `Undo ${actionWord} status for ${benefit.name}`
            : `Mark ${benefit.name} ${actionWord}`;

    return (
        <button
            type="button"
            onClick={() => complete ? onUndo(cardId, benefit.id) : onToggle(cardId, benefit.id)}
            disabled={isFeature}
            aria-label={label}
            aria-pressed={complete}
            className={`w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center text-[12px] ${
                complete
                    ? 'bg-ink text-night-text'
                    : `border-[1.5px] ${urgent ? 'border-circle-open' : 'border-circle-calm'}`
            } ${isFeature ? 'cursor-default' : ''}`}
        >
            {complete ? '✓' : ''}
        </button>
    );
}

function TodayBenefitRow({ item, urgent, onToggle, onUndo }) {
    const currentAmount = getCurrentBenefitAmount(item, item.frequency);

    return (
        <div className="flex items-center gap-4 py-[15px] px-1 border-t border-rule">
            <BenefitCircle benefit={item} cardId={item.cardId} onToggle={onToggle} onUndo={onUndo} urgent={urgent} />
            <span className={`flex-1 min-w-0 text-[15.5px] font-medium tracking-[-.012em] ${urgent ? 'text-ink' : 'text-ink-2'}`}>
                {item.name}
            </span>
            <span className={`w-[150px] shrink-0 text-[13.5px] ${urgent ? 'text-ink-4' : 'text-ink-muted'}`}>
                {item.cardName}
            </span>
            <span className="w-[86px] shrink-0 font-mono text-[9.5px] tracking-[.1em] text-ink-muted">
                {benefitFrequencyLabels[item.frequency] || String(item.frequency).toUpperCase()}
            </span>
            <span className="w-[48px] shrink-0 text-right font-mono text-[12px] text-ink-muted">
                {formatCurrency(currentAmount)}
            </span>
        </div>
    );
}

function TodayDashboard({ benefits, recentlyUsed, onToggle, onUndo, onShowAll }) {
    const now = new Date();
    const alwaysOn = benefits.filter((benefit) => (
        benefit.type === BENEFIT_TYPE.FEATURE ||
        (benefit.type === BENEFIT_TYPE.SUBSCRIPTION && benefit.subscribed)
    ));
    const currentActionable = benefits.filter((benefit) => (
        isActionableBenefit(benefit) && (
            benefit.frequency !== BENEFIT_FREQUENCY.SEMI_ANNUAL ||
            getCurrentBenefitAmount(benefit, benefit.frequency, now) > 0
        )
    ));
    const openBenefits = currentActionable.filter((benefit) => !isBenefitComplete(benefit));
    const visibleBenefits = currentActionable.filter((benefit) => (
        !isBenefitComplete(benefit) || recentlyUsed.has(benefit.id)
    ));

    const buildGroups = (items) => {
        const groupsByDate = items.reduce((groups, benefit) => {
            const period = getBenefitPeriodMeta(benefit, now);
            const key = period.expirationDate.getTime();
            if (!groups.has(key)) groups.set(key, { key, period, benefits: [] });
            groups.get(key).benefits.push(benefit);
            return groups;
        }, new Map());
        return Array.from(groupsByDate.values()).sort((a, b) => a.key - b.key);
    };

    const openGroups = buildGroups(openBenefits);
    const visibleGroups = buildGroups(visibleBenefits);
    const nearestOpenGroup = openGroups[0] || null;
    const mainGroups = visibleGroups.filter((group) => group.period.daysLeft <= TODAY_MAIN_LIST_DAYS);
    const runwayItems = visibleGroups
        .filter((group) => group.period.daysLeft > TODAY_MAIN_LIST_DAYS)
        .flatMap((group) => group.benefits.map((benefit) => ({ benefit, period: group.period })));
    const heroIsUrgent = Boolean(
        nearestOpenGroup && nearestOpenGroup.period.daysLeft >= 0 &&
        nearestOpenGroup.period.daysLeft <= BENEFIT_URGENCY_DAYS
    );

    let heroLabel = 'ALL CLEAR';
    let heroTitle = 'Nothing needs your attention';
    let heroSub = 'Your active benefits are either complete or safely outside the near-deadline window.';
    let heroStart = 'TODAY';
    let heroEnd = 'NO DEADLINE';
    let heroProgress = 0;

    if (nearestOpenGroup) {
        const groupAmount = nearestOpenGroup.benefits.reduce((total, benefit) => (
            total + getCurrentBenefitAmount(benefit, benefit.frequency, now)
        ), 0);
        const cardCount = new Set(nearestOpenGroup.benefits.map((benefit) => benefit.cardId)).size;
        const deadlineText = nearestOpenGroup.period.daysLeft <= 7
            ? new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(nearestOpenGroup.period.expirationDate)
            : formatBenefitDate(nearestOpenGroup.period.expirationDate);
        const sharedFrequency = nearestOpenGroup.benefits.every((benefit) => (
            benefit.frequency === nearestOpenGroup.benefits[0].frequency
        )) ? benefitFrequencyLabels[nearestOpenGroup.benefits[0].frequency].toLowerCase() : '';

        heroLabel = heroIsUrgent
            ? `${formatDaysRemaining(nearestOpenGroup.period.daysLeft)} LEFT`
            : `${formatDaysRemaining(nearestOpenGroup.period.daysLeft)} OF RUNWAY`;
        heroTitle = groupAmount > 0
            ? `${formatCurrency(groupAmount)} in ${sharedFrequency ? `${sharedFrequency} ` : ''}benefits expire ${deadlineText}`
            : `${nearestOpenGroup.benefits.length} benefits expire ${deadlineText}`;
        heroSub = `${nearestOpenGroup.benefits.length} unused ${nearestOpenGroup.benefits.length === 1 ? 'benefit' : 'benefits'} across ${cardCount} ${cardCount === 1 ? 'card' : 'cards'}.`;
        heroStart = formatBenefitDate(nearestOpenGroup.period.startDate);
        heroEnd = formatBenefitDate(nearestOpenGroup.period.expirationDate);
        heroProgress = nearestOpenGroup.period.progress;
    }

    return (
        <div>
            <div className="flex items-end justify-between mb-[22px]">
                <div>
                    <h2 className="m-0 text-[30px] leading-none font-semibold tracking-[-.03em]">Today</h2>
                    <div className="mt-[7px] font-mono text-[10.5px] tracking-[.12em] text-ink-muted">{formatTodayHeading(now)}</div>
                </div>
                <div className="flex gap-[7px]">
                    <DashboardPill active={true} onClick={() => {}}>UNUSED</DashboardPill>
                    <DashboardPill active={false} onClick={onShowAll}>ALL {benefits.length}</DashboardPill>
                </div>
            </div>

            <section className="bg-ink rounded-[20px] p-[26px_30px] text-night-text flex items-center gap-10 mb-[30px]" aria-label="Nearest benefit deadline">
                <div className="flex-1 min-w-0">
                    <div className={`font-mono text-[10.5px] tracking-[.14em] mb-3 ${heroIsUrgent ? 'text-rust-night' : 'text-night-body'}`}>{heroLabel}</div>
                    <div className="text-[27px] font-semibold tracking-[-.028em] leading-[1.15]">{heroTitle}</div>
                    <div className="text-[14px] text-night-body mt-[9px]">{heroSub}</div>
                </div>
                <div className="w-[300px] shrink-0">
                    <div className="h-[3px] rounded-[2px] bg-night-border overflow-hidden">
                        <div className={`h-full ${heroIsUrgent ? 'bg-rust-night' : 'bg-night-body'}`} style={{ width: `${heroProgress}%` }} />
                    </div>
                    <div className="flex justify-between mt-[9px] font-mono text-[10px] tracking-[.08em] text-night-muted">
                        <span>{heroStart}</span><span>{heroEnd}</span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-[minmax(0,1fr)_316px] gap-[34px] items-start">
                <div>
                    {mainGroups.length === 0 ? (
                        <div className="border-t border-rule py-8 text-[14px] text-ink-muted">No benefits need action in the next three months.</div>
                    ) : mainGroups.map((group, groupIndex) => {
                        const urgent = Boolean(
                            nearestOpenGroup && group.key === nearestOpenGroup.key &&
                            group.period.daysLeft >= 0 && group.period.daysLeft <= BENEFIT_URGENCY_DAYS
                        );
                        return (
                            <section key={group.key} className={groupIndex > 0 ? 'mt-7' : ''}>
                                <div className="flex items-baseline justify-between pb-[10px] px-1">
                                    <span className={`font-mono text-[10.5px] tracking-[.13em] ${urgent ? 'text-rust' : 'text-ink-muted'}`}>
                                        ENDS {formatBenefitDate(group.period.expirationDate)} · {formatDaysRemaining(group.period.daysLeft)}
                                    </span>
                                    <span className="font-mono text-[10.5px] tracking-[.08em] text-ink-muted">
                                        {group.benefits.length} {group.benefits.length === 1 ? 'ITEM' : 'ITEMS'}
                                    </span>
                                </div>
                                {group.benefits.map((benefit) => (
                                    <TodayBenefitRow key={`${benefit.cardId}-${benefit.id}`} item={benefit} urgent={urgent} onToggle={onToggle} onUndo={onUndo} />
                                ))}
                            </section>
                        );
                    })}
                </div>

                <aside className="flex flex-col gap-[18px]" aria-label="Other benefits">
                    <section className="bg-paper-raised border border-line-card rounded-[18px] p-[18px_18px_6px]">
                        <h3 className="m-0 pb-[6px] font-mono text-[10px] font-normal tracking-[.13em] text-ink-muted">MONTHS OF RUNWAY</h3>
                        {runwayItems.length === 0 ? (
                            <div className="py-[11px] border-t border-line-soft text-[13px] text-ink-muted">No later tasks.</div>
                        ) : runwayItems.map(({ benefit, period }) => (
                            <div key={`${benefit.cardId}-${benefit.id}`} className="flex items-center gap-3 py-[11px] border-t border-line-soft">
                                <div className="flex-1 min-w-0">
                                    <div className="text-[14px] font-medium tracking-[-.012em] truncate">{benefit.name}</div>
                                    <div className="mt-[3px] font-mono text-[9px] tracking-[.1em] text-ink-muted truncate">{benefit.cardName}</div>
                                </div>
                                <span className="shrink-0 font-mono text-[10px] tracking-[.06em] text-ink-muted">{formatDaysRemaining(period.daysLeft)}</span>
                            </div>
                        ))}
                    </section>

                    <section className="bg-paper-rail border border-line rounded-[18px] p-[18px_18px_6px]">
                        <h3 className="m-0 pb-[6px] font-mono text-[10px] font-normal tracking-[.13em] text-ink-muted">ALWAYS ON · NOTHING TO DO</h3>
                        {alwaysOn.length === 0 ? (
                            <div className="py-[11px] border-t border-line text-[13px] text-ink-muted">No always-on benefits.</div>
                        ) : alwaysOn.map((benefit) => (
                            <div key={`${benefit.cardId}-${benefit.id}`} className="py-[11px] border-t border-line">
                                <div className="text-[14px] font-medium tracking-[-.012em] text-ink-2">{benefit.name}</div>
                                <div className="mt-[3px] font-mono text-[9px] tracking-[.1em] text-ink-muted">{benefit.cardName}</div>
                            </div>
                        ))}
                    </section>
                </aside>
            </div>

            <div className="mt-10 max-w-[520px]">
                <ContextualFeedbackForm contextType="benefits-summary" title="Spot a benefit issue?" prompt="Report a missing benefit, incorrect amount, or stale detail." compact={true} defaultIssueType="missing_benefit" pageMeta="dashboard-unused" quickActions={[{ label: 'Send feedback', issueType: 'incorrect_benefit' }]} />
            </div>
        </div>
    );
}

function AllBenefitsDashboard({ cards, benefits, recentlyUsed, onToggle, onUndo }) {
    const [sortMode, setSortMode] = useState('reset');
    const [unusedOnly, setUnusedOnly] = useState(false);
    const openCount = benefits.filter((benefit) => isActionableBenefit(benefit) && !isBenefitComplete(benefit)).length;
    const rows = benefits
        .filter((benefit) => !unusedOnly || (
            (isActionableBenefit(benefit) && !isBenefitComplete(benefit)) || recentlyUsed.has(benefit.id)
        ))
        .map((benefit) => ({ benefit, period: getBenefitPeriodMeta(benefit) }))
        .sort((a, b) => {
            if (sortMode === 'card') {
                return a.benefit.cardName.localeCompare(b.benefit.cardName) ||
                    a.period.expirationDate - b.period.expirationDate ||
                    a.benefit.name.localeCompare(b.benefit.name);
            }
            return a.period.expirationDate - b.period.expirationDate ||
                a.benefit.cardName.localeCompare(b.benefit.cardName) ||
                a.benefit.name.localeCompare(b.benefit.name);
        });
    const columnClass = 'shrink-0 font-mono text-[9.5px] tracking-[.12em] text-ink-muted';

    return (
        <div>
            <div className="flex items-end justify-between mb-5">
                <div>
                    <h2 className="m-0 text-[30px] leading-none font-semibold tracking-[-.03em]">All benefits</h2>
                    <div className="mt-[7px] font-mono text-[10.5px] tracking-[.12em] text-ink-muted">
                        {benefits.length} TRACKED · {openCount} OPEN · {cards.length} {cards.length === 1 ? 'CARD' : 'CARDS'}
                    </div>
                </div>
                <div className="flex gap-[7px]">
                    <DashboardPill active={sortMode === 'reset'} onClick={() => setSortMode('reset')}>BY RESET DATE</DashboardPill>
                    <DashboardPill active={sortMode === 'card'} onClick={() => setSortMode('card')}>BY CARD</DashboardPill>
                    <DashboardPill active={unusedOnly} pressed={unusedOnly} onClick={() => setUnusedOnly((current) => !current)}>UNUSED ONLY</DashboardPill>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    <div className="flex items-center gap-4 px-1 pb-[9px]">
                        <span className="w-[22px] shrink-0" />
                        <span className="flex-1 font-mono text-[9.5px] tracking-[.12em] text-ink-muted">BENEFIT</span>
                        <span className={`w-[158px] ${columnClass}`}>CARD</span>
                        <span className={`w-[112px] ${columnClass}`}>TYPE</span>
                        <span className={`w-[104px] ${columnClass}`}>FREQUENCY</span>
                        <span className={`w-[74px] ${columnClass}`}>RESETS</span>
                        <span className={`w-[46px] text-right ${columnClass}`}>VALUE</span>
                    </div>
                    {rows.map(({ benefit, period }) => {
                        const urgent = period.daysLeft >= 0 && period.daysLeft <= BENEFIT_URGENCY_DAYS;
                        const currentAmount = getCurrentBenefitAmount(benefit, benefit.frequency);
                        return (
                            <div key={`${benefit.cardId}-${benefit.id}`} className="flex items-center gap-4 py-3 px-1 border-t border-rule">
                                <BenefitCircle benefit={benefit} cardId={benefit.cardId} onToggle={onToggle} onUndo={onUndo} urgent={urgent} />
                                <span className="flex-1 min-w-0 text-[15px] font-medium tracking-[-.012em] truncate">{benefit.name}</span>
                                <span className="w-[158px] shrink-0 text-[13.5px] text-ink-4 truncate">{benefit.cardName}</span>
                                <span className="w-[112px] shrink-0 font-mono text-[9.5px] tracking-[.09em] text-ink-muted">{benefitTypeLabels[benefit.type] || String(benefit.type).toUpperCase()}</span>
                                <span className="w-[104px] shrink-0 font-mono text-[9.5px] tracking-[.09em] text-ink-muted">{benefitFrequencyLabels[benefit.frequency] || String(benefit.frequency).toUpperCase()}</span>
                                <span className={`w-[74px] shrink-0 font-mono text-[11px] ${urgent ? 'text-rust' : 'text-ink-muted'}`}>{formatDaysRemaining(period.daysLeft)}</span>
                                <span className="w-[46px] shrink-0 text-right font-mono text-[12px] text-ink-muted">{formatCurrency(currentAmount > 0 ? currentAmount : benefit.value)}</span>
                            </div>
                        );
                    })}
                    {rows.length === 0 && <div className="border-t border-rule py-8 px-1 text-[14px] text-ink-muted">No unused benefits remain.</div>}
                </div>
            </div>

            <div className="mt-10 max-w-[520px]">
                <ContextualFeedbackForm contextType="benefits-summary" title="Spot a benefit issue?" prompt="Report a missing benefit, incorrect amount, or stale detail." compact={true} defaultIssueType="missing_benefit" pageMeta="dashboard-list" quickActions={[{ label: 'Send feedback', issueType: 'incorrect_benefit' }]} />
            </div>
        </div>
    );
}

function formatAddedMonth(dateLike) {
    if (!dateLike) return null;
    const date = new Date(dateLike);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}

function CreditCardSection({ card, onToggle, onRemove, onUndo }) {
    const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
    const cancelRemoveRef = useRef(null);
    const now = new Date();
    const benefits = card.benefits || [];
    const cardImage = window.getCardImage(card);
    const openCount = benefits.filter((benefit) => (
        isActionableBenefit(benefit) && !isBenefitComplete(benefit)
    )).length;
    const addedLabel = formatAddedMonth(card.addedAt);

    const detailGroups = Array.from(benefits.reduce((groups, benefit) => {
        const key = benefit.frequency || BENEFIT_FREQUENCY.ANNUAL;
        if (!groups.has(key)) {
            groups.set(key, {
                frequency: key,
                benefits: [],
                period: getBenefitPeriodMeta(benefit, now)
            });
        }
        groups.get(key).benefits.push(benefit);
        return groups;
    }, new Map()).values()).sort((a, b) => (
        a.period.expirationDate - b.period.expirationDate ||
        (benefitFrequencyLabels[a.frequency] || a.frequency).localeCompare(
            benefitFrequencyLabels[b.frequency] || b.frequency
        )
    ));

    const nextReset = detailGroups[0] || null;
    const nextResetIsUrgent = Boolean(
        nextReset &&
        nextReset.period.daysLeft >= 0 &&
        nextReset.period.daysLeft <= BENEFIT_URGENCY_DAYS
    );

    useEffect(() => {
        if (!showRemoveConfirmation) return undefined;
        cancelRemoveRef.current?.focus();
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setShowRemoveConfirmation(false);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [showRemoveConfirmation]);

    return (
        <div>
            <header className="flex gap-[26px] items-start mb-7">
                {cardImage ? (
                    <img
                        src={cardImage}
                        alt={`${card.name} card`}
                        className="w-[210px] h-[132px] shrink-0 rounded-[14px] object-cover"
                    />
                ) : (
                    <div className={`w-[210px] h-[132px] shrink-0 rounded-[14px] px-5 py-[18px] flex flex-col justify-between ${card.color || 'card-gradient-custom'}`}>
                        <span className="font-mono text-[10px] tracking-[.16em] text-night-body uppercase">
                            {card.issuer}
                        </span>
                        <span className="text-[19px] leading-[1.2] font-semibold tracking-[-.02em] text-night-text">
                            {card.name}
                        </span>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <h2 className="m-0 text-[30px] leading-none font-semibold tracking-[-.03em] text-ink">
                        {card.name}
                    </h2>
                    <div className="flex gap-[38px] mt-5">
                        <div>
                            <div className="font-mono text-[9.5px] tracking-[.11em] text-ink-muted">ANNUAL FEE</div>
                            <div className="mt-1.5 font-mono text-[15px] text-ink">{formatCurrency(card.annualFee)}</div>
                        </div>
                        <div>
                            <div className="font-mono text-[9.5px] tracking-[.11em] text-ink-muted">OPEN NOW</div>
                            <div className="mt-1.5 font-mono text-[15px] text-ink">{openCount} of {benefits.length}</div>
                        </div>
                        {nextReset && (
                            <div>
                                <div className="font-mono text-[9.5px] tracking-[.11em] text-ink-muted">NEXT RESET</div>
                                <div className={`mt-1.5 font-mono text-[15px] ${nextResetIsUrgent ? 'text-rust' : 'text-ink'}`}>
                                    {formatBenefitDate(nextReset.period.expirationDate)}
                                </div>
                            </div>
                        )}
                        {addedLabel && (
                            <div>
                                <div className="font-mono text-[9.5px] tracking-[.11em] text-ink-muted">ADDED</div>
                                <div className="mt-1.5 font-mono text-[15px] text-ink">{addedLabel}</div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowRemoveConfirmation(true)}
                    className="shrink-0 font-mono text-[10.5px] tracking-[.09em] text-ink-muted"
                >
                    REMOVE CARD
                </button>
            </header>

            <div className="grid grid-cols-[minmax(0,1fr)_296px] gap-[34px] items-start">
                <div>
                    {detailGroups.map((group) => {
                        const groupTotal = group.benefits.reduce((sum, benefit) => (
                            sum + (getCurrentBenefitAmount(benefit, benefit.frequency, now) || benefit.value || 0)
                        ), 0);
                        return (
                            <section key={group.frequency}>
                                <div className="flex items-baseline justify-between px-1 pb-[9px]">
                                    <span className="font-mono text-[10px] tracking-[.13em] text-ink-muted">
                                        {benefitFrequencyLabels[group.frequency] || String(group.frequency).toUpperCase()}
                                    </span>
                                    <span className="font-mono text-[10px] tracking-[.09em] text-ink-muted">
                                        {group.benefits.length} {group.benefits.length === 1 ? 'BENEFIT' : 'BENEFITS'} · {formatCurrency(groupTotal)}
                                    </span>
                                </div>
                                {group.benefits.map((benefit) => {
                                    const currentAmount = getCurrentBenefitAmount(benefit, benefit.frequency, now);
                                    const urgent = (
                                        group.period.daysLeft >= 0 &&
                                        group.period.daysLeft <= BENEFIT_URGENCY_DAYS
                                    );
                                    return (
                                        <div key={benefit.id} className="flex items-start gap-4 py-3.5 px-1 border-t border-rule">
                                            <div className="mt-px">
                                                <BenefitCircle
                                                    benefit={benefit}
                                                    cardId={card.id}
                                                    onToggle={onToggle}
                                                    onUndo={onUndo}
                                                    urgent={urgent}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[15px] font-medium tracking-[-.012em] text-ink">
                                                    {benefit.name}
                                                </div>
                                                {benefit.description && (
                                                    <div className="mt-1 text-[13px] leading-[1.5] max-w-[58ch] text-ink-muted">
                                                        {benefit.description}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="shrink-0 font-mono text-[12px] text-ink-muted">
                                                {formatCurrency(currentAmount > 0 ? currentAmount : benefit.value)}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="h-[22px]" />
                            </section>
                        );
                    })}
                </div>

                <aside className="bg-paper-raised border border-line-card rounded-[18px] px-[18px] pt-[18px] pb-2" aria-label="Reset schedule">
                    <h3 className="m-0 pb-1.5 font-mono text-[10px] font-normal tracking-[.13em] text-ink-muted">
                        RESET SCHEDULE
                    </h3>
                    {detailGroups.map((group) => {
                        const urgent = (
                            group.period.daysLeft >= 0 &&
                            group.period.daysLeft <= BENEFIT_URGENCY_DAYS
                        );
                        return (
                            <div key={group.frequency} className="flex items-center justify-between py-3 border-t border-line-soft">
                                <span className="font-mono text-[10px] tracking-[.1em] text-ink-4">
                                    {benefitFrequencyLabels[group.frequency] || String(group.frequency).toUpperCase()}
                                </span>
                                <span className={`font-mono text-[11.5px] ${urgent ? 'text-rust' : 'text-ink-muted'}`}>
                                    {formatBenefitDate(group.period.expirationDate)}
                                </span>
                            </div>
                        );
                    })}
                </aside>
            </div>

            {showRemoveConfirmation && (
                <div className="fixed inset-0 z-[95] flex items-center justify-center p-6">
                    <button
                        type="button"
                        aria-label="Cancel card removal"
                        className="absolute inset-0 w-full h-full cursor-default modal-scrim"
                        onClick={() => setShowRemoveConfirmation(false)}
                    />
                    <div
                        className="relative w-full max-w-[420px] rounded-[18px] border border-line-card bg-paper p-6 modal-shadow"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="remove-card-title"
                        aria-describedby="remove-card-description"
                    >
                        <h3 id="remove-card-title" className="m-0 text-[21px] font-semibold tracking-[-.02em] text-ink">
                            Remove {card.name}?
                        </h3>
                        <p id="remove-card-description" className="mt-2 text-[14px] leading-[1.5] text-ink-muted">
                            This removes the card and its current benefit status from this device.
                        </p>
                        <div className="mt-6 flex justify-end gap-2.5">
                            <button
                                ref={cancelRemoveRef}
                                type="button"
                                onClick={() => setShowRemoveConfirmation(false)}
                                className="rounded-[10px] px-4 py-2.5 text-[14px] font-medium text-ink-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(card.id)}
                                className="rounded-[10px] bg-ink px-4 py-2.5 text-[14px] font-semibold text-night-text"
                            >
                                Remove card
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function getCardImage(card) {
    return card && card.image ? card.image : null;
}

window.getCardImage = getCardImage;

// Add Card Page Component
function AddCardPage({ onAddCard, onAddCustom, onBack, existingCardIds }) {
    const [selectedCards, setSelectedCards] = useState(new Set());
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dialogRef = useRef(null);
    const searchInputRef = useRef(null);
    const availableToAdd = Object.values(availableCards).filter(
        (card) => !existingCardIds.includes(card.id)
    );
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredCards = availableToAdd.filter((card) => (
        !normalizedQuery ||
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.issuer.toLowerCase().includes(normalizedQuery)
    ));
    const groupedCards = filteredCards.reduce((groups, card) => {
        if (!groups[card.issuer]) groups[card.issuer] = [];
        groups[card.issuer].push(card);
        return groups;
    }, {});
    const issuerCount = new Set(availableToAdd.map((card) => card.issuer)).size;

    useEffect(() => {
        if (showCustomModal) {
            document.querySelector('[data-custom-card-dialog] input')?.focus();
        } else {
            searchInputRef.current?.focus();
        }
    }, [showCustomModal]);

    useEffect(() => {
        const handleDialogKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (showCustomModal) {
                    setShowCustomModal(false);
                } else {
                    onBack();
                }
                return;
            }
            if (event.key !== 'Tab') return;

            const scope = showCustomModal
                ? document.querySelector('[data-custom-card-dialog]')
                : dialogRef.current;
            const focusable = Array.from(scope?.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) || []).filter((element) => element.offsetParent !== null);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleDialogKeyDown);
        return () => document.removeEventListener('keydown', handleDialogKeyDown);
    }, [showCustomModal, onBack]);
    
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
        if (selectedCards.size === 0) return;
        selectedCards.forEach(cardId => onAddCard(cardId));
        setSelectedCards(new Set());
        onBack();
    };

    const handleCustomCardCreated = (customCard) => {
        onAddCustom(customCard);
        setShowCustomModal(false);
        onBack();
    };
    
    return (
        <div ref={dialogRef} className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-end justify-between border-b border-rule px-[26px] pt-6 pb-[18px]">
                <div>
                    <h3 id="add-card-title" className="m-0 text-[23px] font-semibold tracking-[-.025em] text-ink">
                        Add a card
                    </h3>
                    <div className="mt-[7px] font-mono text-[10px] tracking-[.11em] text-ink-muted">
                        {availableToAdd.length} {availableToAdd.length === 1 ? 'CARD' : 'CARDS'} · {issuerCount} {issuerCount === 1 ? 'ISSUER' : 'ISSUERS'} · SCROLL FOR MORE
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onBack}
                    className="font-mono text-[11px] tracking-[.09em] text-ink-muted"
                    aria-label="Close add card modal"
                >
                    ESC
                </button>
            </header>

            <div className="px-[26px] pt-4 pb-[14px]">
                <label className="sr-only" htmlFor="add-card-search">Search by card or issuer</label>
                <input
                    ref={searchInputRef}
                    id="add-card-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by card or issuer"
                    className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[14.5px] text-ink placeholder:text-ink-muted outline-none"
                />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-[26px]">
                {Object.keys(groupedCards).length === 0 ? (
                    <div className="border-t border-rule px-1 py-10 text-center text-[14px] text-ink-muted">
                        {availableToAdd.length === 0
                            ? 'All available cards have already been added.'
                            : 'No cards match your search.'}
                    </div>
                ) : (
                    Object.entries(groupedCards).map(([issuer, cards]) => (
                        <section key={issuer}>
                            <div className="flex items-baseline justify-between px-1 pt-4 pb-2">
                                <h4 className="m-0 font-mono text-[10px] font-normal tracking-[.14em] text-ink uppercase">
                                    {issuer}
                                </h4>
                                <span className="font-mono text-[9.5px] tracking-[.1em] text-ink-muted">
                                    {cards.length}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6">
                                {cards.map((card) => {
                                    const selected = selectedCards.has(card.id);
                                    const image = window.getCardImage(card);
                                    return (
                                        <button
                                            key={card.id}
                                            type="button"
                                            onClick={() => handleCardToggle(card.id)}
                                            aria-pressed={selected}
                                            className="flex items-center gap-[13px] border-t border-rule px-0.5 py-2.5 text-left"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] text-[12px] ${
                                                    selected
                                                        ? 'bg-ink text-night-text'
                                                        : 'border-[1.5px] border-circle-open'
                                                }`}
                                            >
                                                {selected ? '✓' : ''}
                                            </span>
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt=""
                                                    className="h-[31px] w-12 shrink-0 rounded-[4px] object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-[31px] w-12 shrink-0 rounded-[4px] ${card.color || 'card-gradient-custom'}`}
                                                />
                                            )}
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-[14.5px] font-medium leading-tight tracking-[-.012em] text-ink">
                                                    {card.name}
                                                </span>
                                                <span className="mt-[3px] block truncate font-mono text-[9px] tracking-[.09em] text-ink-muted">
                                                    {card.benefits.length} {card.benefits.length === 1 ? 'BENEFIT' : 'BENEFITS'}
                                                </span>
                                            </span>
                                            <span className="shrink-0 font-mono text-[11.5px] text-ink-muted">
                                                {formatCurrency(card.annualFee)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    ))
                )}
            </div>

            <footer className="mt-[14px] flex items-center justify-between border-t border-rule px-[26px] pt-[18px] pb-5">
                <button
                    type="button"
                    onClick={() => setShowCustomModal(true)}
                    className="font-mono text-[10.5px] tracking-[.09em] text-ink-muted"
                >
                    OR CREATE A CUSTOM CARD
                </button>
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-3 py-3 text-[14.5px] font-medium text-ink-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAddSelected}
                        disabled={selectedCards.size === 0}
                        className={`rounded-[11px] px-[22px] py-3 text-[14.5px] font-semibold tracking-[-.01em] ${
                            selectedCards.size > 0
                                ? 'bg-ink text-night-text'
                                : 'bg-pill-bg text-ink-faint cursor-not-allowed'
                        }`}
                    >
                        Add {selectedCards.size} {selectedCards.size === 1 ? 'card' : 'cards'}
                    </button>
                </div>
            </footer>

            <CustomCardModal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                onAdd={handleCustomCardCreated}
            />
        </div>
    );
}

function ConfirmationModal({ isOpen, title, description, confirmLabel, onCancel, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
            <button
                type="button"
                className="absolute inset-0 h-full w-full cursor-default modal-scrim"
                onClick={onCancel}
                aria-label="Close confirmation"
            />
            <div
                className="relative w-full max-w-[430px] rounded-[20px] border border-line-card bg-paper-raised p-6 modal-shadow"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
                aria-describedby="confirmation-description"
            >
                <div className="font-mono text-[10px] tracking-[.13em] text-rust">PLEASE CONFIRM</div>
                <h3 id="confirmation-title" className="mt-3 text-[20px] font-semibold tracking-[-.02em] text-ink">
                    {title}
                </h3>
                <p id="confirmation-description" className="mt-2 text-[13.5px] leading-[1.55] text-ink-muted">
                    {description}
                </p>
                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-[11px] border border-line-strong px-4 py-2.5 text-[14px] font-medium text-ink-4"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-[11px] bg-rust px-4 py-2.5 text-[14px] font-semibold text-night-text"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Settings Page Component
function SettingsPage({ onResetAll, onResetBenefitUsage }) {
    const [pendingReset, setPendingReset] = useState(null);

    const resetDetails = {
        usage: {
            title: 'Reset benefit usage?',
            description: 'Every credit and subscription will be marked unused again. Your cards and usage log will stay.',
            confirmLabel: 'Reset usage',
            action: onResetBenefitUsage
        },
        all: {
            title: 'Reset all card data?',
            description: 'Every card and its active usage state will be removed from this browser. Your usage log will stay.',
            confirmLabel: 'Reset all data',
            action: onResetAll
        }
    };
    const currentReset = pendingReset ? resetDetails[pendingReset] : null;

    const confirmReset = () => {
        if (!currentReset) return;
        currentReset.action();
        setPendingReset(null);
    };

    const settingGroups = [
        {
            label: 'DATA',
            rows: [
                {
                    name: 'Storage',
                    description: 'Cards, benefits, and usage state are saved on this device.',
                    value: 'THIS BROWSER'
                },
                {
                    name: 'Usage log',
                    description: 'Benefit actions and resets are recorded newest first.',
                    value: 'ON'
                }
            ]
        },
        {
            label: 'ACCOUNT',
            rows: [
                {
                    name: 'Sign-in',
                    description: 'No account is required to use the tracker.',
                    value: 'NONE'
                },
                {
                    name: 'Sync',
                    description: 'Data does not sync between browsers or devices.',
                    value: 'OFF'
                }
            ]
        }
    ];

    return (
        <>
            <h2 className="mb-6 text-[30px] font-semibold tracking-[-.03em] text-ink">Setup</h2>

            <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[34px] max-lg:grid-cols-1">
                <div>
                    {settingGroups.map((group) => (
                        <section key={group.label}>
                            <div className="px-1 pb-[9px] font-mono text-[10px] tracking-[.13em] text-ink-muted">
                                {group.label}
                            </div>
                            <div className="mb-6 overflow-hidden rounded-[16px] border border-line-card bg-paper-raised">
                                {group.rows.map((row, index) => (
                                    <div
                                        key={row.name}
                                        className={`flex items-center gap-4 p-[16px_18px] ${
                                            index < group.rows.length - 1 ? 'border-b border-line-soft' : ''
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[15px] font-medium tracking-[-.012em] text-ink">
                                                {row.name}
                                            </div>
                                            <div className="mt-1 text-[13px] leading-[1.45] text-ink-muted">
                                                {row.description}
                                            </div>
                                        </div>
                                        <span className="shrink-0 font-mono text-[11px] text-ink-muted">
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="flex flex-col gap-[18px]">
                    <aside className="rounded-[16px] border border-rust-tint-border bg-rust-tint-bg p-[18px]">
                        <div className="pb-3 font-mono text-[10px] tracking-[.13em] text-rust">CAREFUL</div>
                        <button
                            type="button"
                            onClick={() => setPendingReset('usage')}
                            className="block w-full text-left"
                        >
                            <span className="block text-[15px] font-semibold tracking-[-.012em] text-rust">
                                Reset benefit usage
                            </span>
                            <span className="mt-1 block text-[13px] leading-[1.45] text-rust-tint-text">
                                Marks benefits unused again while keeping your cards and log.
                            </span>
                        </button>
                        <div className="my-4 border-t border-rust-tint-border" />
                        <button
                            type="button"
                            onClick={() => setPendingReset('all')}
                            className="block w-full text-left"
                        >
                            <span className="block text-[15px] font-semibold tracking-[-.012em] text-rust">
                                Reset all data
                            </span>
                            <span className="mt-1 block text-[13px] leading-[1.45] text-rust-tint-text">
                                Removes every card and its active usage state. Your log is retained.
                            </span>
                        </button>
                    </aside>

                    <aside className="rounded-[16px] border border-line bg-paper-rail p-[18px]">
                        <div className="pb-3 font-mono text-[10px] tracking-[.13em] text-ink-muted">PRIVACY</div>
                        <p className="text-[13.5px] leading-[1.55] text-ink-3">
                            Your cards and usage history live in this browser. No account or server stores your tracker data.
                        </p>
                    </aside>
                </div>
            </div>

            <ConfirmationModal
                isOpen={Boolean(currentReset)}
                title={currentReset?.title}
                description={currentReset?.description}
                confirmLabel={currentReset?.confirmLabel}
                onCancel={() => setPendingReset(null)}
                onConfirm={confirmReset}
            />
        </>
    );
}

function getHistoryDayKey(timestamp) {
    const date = toDate(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getHistoryDayLabel(timestamp) {
    const eventDate = toDate(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const eventKey = getHistoryDayKey(eventDate);

    if (eventKey === getHistoryDayKey(today)) return 'TODAY';
    if (eventKey === getHistoryDayKey(yesterday)) return 'YESTERDAY';
    return eventDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).toUpperCase();
}

function UsageHistoryPage({ historyEvents, cards }) {
    const [filter, setFilter] = useState('all');
    const resetActions = new Set(['reset_usage', 'reset_all']);
    const benefitActions = new Set(['used', 'undo_used', 'subscribed', 'unsubscribed']);

    const filteredEvents = React.useMemo(() => {
        return historyEvents
            .filter((event) => {
                if (filter === 'used') return benefitActions.has(event.action);
                if (filter === 'resets') return resetActions.has(event.action);
                return true;
            })
            .slice()
            .sort((a, b) => toDate(b.timestamp) - toDate(a.timestamp));
    }, [historyEvents, filter]);

    const eventGroups = React.useMemo(() => {
        return filteredEvents.reduce((groups, event) => {
            const key = getHistoryDayKey(event.timestamp);
            const currentGroup = groups[groups.length - 1];
            if (!currentGroup || currentGroup.key !== key) {
                groups.push({ key, timestamp: event.timestamp, events: [event] });
            } else {
                currentGroup.events.push(event);
            }
            return groups;
        }, []);
    }, [filteredEvents]);

    const actionLabels = {
        used: 'USED',
        undo_used: 'UNDONE',
        subscribed: 'SUB',
        unsubscribed: 'UNSUB',
        reset_usage: 'RESET',
        reset_all: 'RESET'
    };
    const filters = [
        { id: 'all', label: 'ALL' },
        { id: 'used', label: 'USED' },
        { id: 'resets', label: 'RESETS' }
    ];

    return (
        <div>
            <header className="mb-[22px] flex items-end justify-between gap-6">
                <div>
                    <h2 className="text-[30px] font-semibold tracking-[-.03em] text-ink">Log</h2>
                    <div className="mt-[7px] font-mono text-[10.5px] tracking-[.12em] text-ink-muted">
                        EVERYTHING YOU&apos;VE MARKED, NEWEST FIRST
                    </div>
                </div>
                <div className="flex gap-[7px]" aria-label="Filter usage log">
                    {filters.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setFilter(item.id)}
                            aria-pressed={filter === item.id}
                            className={`rounded-full p-[7px_13px] font-mono text-[10.5px] tracking-[.08em] ${
                                filter === item.id
                                    ? 'bg-ink text-night-text'
                                    : 'border border-line-strong text-ink-4'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="max-w-[900px]">
                {eventGroups.length === 0 ? (
                    <div className="border-t border-rule p-[30px_4px] font-mono text-[10.5px] tracking-[.12em] text-ink-muted">
                        {filter === 'all' ? 'NO EVENTS YET' : `NO ${filter.toUpperCase()} EVENTS`}
                    </div>
                ) : (
                    eventGroups.map((group) => (
                        <section key={group.key}>
                            <div className="border-t border-rule p-[14px_4px_9px]">
                                <h3 className="font-mono text-[10px] tracking-[.13em] text-ink-muted">
                                    {getHistoryDayLabel(group.timestamp)}
                                </h3>
                            </div>
                            {group.events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center gap-5 border-t border-rule-soft p-[13px_4px]"
                                >
                                    <time
                                        dateTime={event.timestamp}
                                        className="w-[52px] shrink-0 font-mono text-[11px] text-ink-muted"
                                    >
                                        {toDate(event.timestamp).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </time>
                                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium tracking-[-.012em] text-ink">
                                        {event.benefitName || 'All benefits'}
                                    </span>
                                    <span className="w-[280px] shrink-0 truncate font-mono text-[9.5px] tracking-[.09em] text-ink-muted">
                                        {event.cardName || 'ALL CARDS'}
                                    </span>
                                    <span className="w-[64px] shrink-0 rounded-full bg-pill-bg p-[4px_0] text-center font-mono text-[10px] tracking-[.08em] text-ink-4">
                                        {actionLabels[event.action] || String(event.action || 'EVENT').toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </section>
                    ))
                )}
            </div>
        </div>
    );
}

function FirstRunPage({ onAddCard }) {
    const supportedCards = Object.values(availableCards);
    const previewCard = availableCards['chase-sapphire-reserve'] || supportedCards[0];
    const previewBenefits = (previewCard?.benefits || [])
        .filter((benefit) => (
            benefit.type !== BENEFIT_TYPE.FEATURE &&
            getCurrentBenefitAmount(benefit, benefit.frequency) > 0
        ))
        .map((benefit) => ({
            ...benefit,
            daysLeft: Math.max(0, daysUntilExpiration(getExpirationDate(benefit.frequency)))
        }))
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 4);

    const footerItems = [
        {
            label: 'DEADLINE FIRST',
            copy: 'Monthly, semi-annual, annual and four-year resets, each with the date it actually dies.'
        },
        {
            label: 'ONE LIST',
            copy: 'Credits, subscriptions and always-on perks separated, so the list only holds real tasks.'
        },
        {
            label: 'LOCAL ONLY',
            copy: 'Stored in your browser. No sign-up, no sync, nothing to leak.'
        }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-night-bg px-6 text-night-text lg:px-[74px]">
            <header className="flex items-center justify-between py-[34px]">
                <div className="font-mono text-[10.5px] tracking-[.16em] text-rust-night">
                    BENEFIT TRACKER
                </div>
                <div className="font-mono text-[10.5px] tracking-[.11em] text-night-muted">
                    {supportedCards.length} {supportedCards.length === 1 ? 'CARD' : 'CARDS'} SUPPORTED
                </div>
            </header>

            <main className="flex flex-1 items-center gap-20 max-lg:flex-col max-lg:items-stretch max-lg:justify-center max-lg:gap-12 max-lg:py-12">
                <div className="min-w-0 flex-1">
                    <h2 className="max-w-[15ch] text-[60px] font-semibold leading-[1.04] tracking-[-.04em] text-night-text max-sm:text-[44px]">
                        You paid for these. Use them.
                    </h2>
                    <p className="mt-6 max-w-[46ch] text-[18px] leading-[1.6] text-night-body">
                        Add your cards and we&apos;ll keep one short list of what resets, and when. No account, nothing leaves your browser.
                    </p>
                    <div className="mt-[38px] flex items-center gap-5 max-sm:items-start max-sm:flex-col">
                        <button
                            type="button"
                            onClick={onAddCard}
                            className="rounded-[12px] bg-night-text p-[15px_26px] text-[16px] font-semibold tracking-[-.01em] text-ink"
                        >
                            Add your first card
                        </button>
                        <span className="font-mono text-[10.5px] tracking-[.1em] text-night-muted">
                            TAKES ABOUT A MINUTE
                        </span>
                    </div>
                </div>

                <aside className="w-[420px] shrink-0 rounded-[20px] border border-night-border bg-night-panel p-[24px_24px_10px] max-lg:w-full">
                    <div className="pb-2 font-mono text-[10px] tracking-[.13em] text-night-muted">
                        WHAT IT LOOKS LIKE AFTER SETUP
                    </div>
                    {previewBenefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-center gap-3.5 border-t border-night-rule py-3.5">
                            <span
                                aria-hidden="true"
                                className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-night-border"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[14.5px] font-medium tracking-[-.012em] text-night-text">
                                    {benefit.name}
                                </span>
                                <span className="mt-1 block truncate font-mono text-[9px] tracking-[.1em] text-night-muted">
                                    {previewCard.name.toUpperCase()}
                                </span>
                            </span>
                            <span className="shrink-0 font-mono text-[10px] tracking-[.06em] text-rust-night">
                                {benefit.daysLeft}d
                            </span>
                        </div>
                    ))}
                </aside>
            </main>

            <footer className="flex gap-11 border-t border-night-rule p-[30px_0_34px] max-md:flex-col max-md:gap-7">
                {footerItems.map((item) => (
                    <div key={item.label} className="flex-1">
                        <div className="font-mono text-[10px] tracking-[.12em] text-rust-night">
                            {item.label}
                        </div>
                        <p className="mt-[9px] max-w-[34ch] text-[14.5px] leading-[1.55] text-night-body">
                            {item.copy}
                        </p>
                    </div>
                ))}
            </footer>
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
            <div className="fixed inset-0 modal-scrim flex items-center justify-center z-50">
                <div className="bg-paper-raised border border-line-card rounded-[18px] p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">Add Credit Card</h2>
                    
                    {/* Create Custom Card Option */}
                    <div className="mb-4">
                        <label className="block p-4 border border-line-card bg-paper-rail rounded-[16px] cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-ink">Create Custom Card</h3>
                                    <p className="text-sm text-ink-muted">Design your own card with custom benefits</p>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={handleCreateCustom}
                                        className="px-3 py-1 bg-ink text-night-text rounded-[11px] text-sm"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-4">
                        <div className="flex-1 border-t border-rule"></div>
                        <span className="px-3 font-mono text-[10px] tracking-[.1em] text-ink-muted uppercase">or choose from existing cards</span>
                        <div className="flex-1 border-t border-rule"></div>
                    </div>
                    
                    {availableToAdd.length === 0 ? (
                        <p className="text-ink-muted mb-4">All available predefined cards have been added!</p>
                    ) : (
                        <>
                            <div className="space-y-3 mb-6">
                                {availableToAdd.map(card => (
                                    <label
                                        key={card.id}
                                        className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedCard === card.id
                                                ? 'border-ink bg-paper-rail'
                                                : 'border-line-strong'
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
                                                <p className="text-sm text-ink-muted">{card.issuer}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${card.annualFee}/year</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            
                            <div className="text-xs text-ink-muted mb-4">
                                Note: Some cards may have simplified benefits. You can customize after adding.
                            </div>
                        </>
                    )}
                    
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-ink-4"
                        >
                            Cancel
                        </button>
                        {availableToAdd.length > 0 && (
                            <button
                                onClick={handleAdd}
                                disabled={!selectedCard}
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    selectedCard
                                        ? 'bg-ink text-night-text'
                                        : 'bg-pill-bg text-ink-faint cursor-not-allowed'
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
        <div className="mb-4 rounded-[16px] border border-line bg-paper-rail p-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-mono text-[10.5px] tracking-[.1em] text-ink-4 uppercase">Benefit #{index + 1}</h4>
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
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Benefit Name *
                    </label>
                    <input
                        type="text"
                        value={benefitData.name}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[14px] text-ink outline-none"
                        placeholder="e.g., $10 Dining Credit"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Value ($) *
                    </label>
                    <input
                        type="number"
                        value={benefitData.value}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] font-mono text-[12px] text-ink outline-none"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Category
                    </label>
                    <select
                        value={benefitData.category}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[13px] text-ink outline-none"
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Frequency
                    </label>
                    <select
                        value={benefitData.frequency}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, frequency: e.target.value }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[13px] text-ink outline-none"
                    >
                        {frequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Type
                    </label>
                    <select
                        value={benefitData.type}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[13px] text-ink outline-none"
                    >
                        {typeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                        Description
                    </label>
                    <textarea
                        value={benefitData.description}
                        onChange={(e) => setBenefitData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[14px] text-ink outline-none"
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
        { value: 'card-gradient-custom', label: 'Plum (Default)' },
        { value: 'card-gradient-chase', label: 'Navy' },
        { value: 'card-gradient-united', label: 'Teal' },
        { value: 'card-gradient-amex', label: 'Graphite' }
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

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center modal-scrim"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                data-custom-card-dialog
                className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[20px] border border-line-card bg-paper-raised p-6 modal-shadow"
                role="dialog"
                aria-modal="true"
                aria-labelledby="custom-card-title"
            >
                <h2 id="custom-card-title" className="text-2xl font-bold mb-6">Create Custom Card</h2>
                
                {/* Card Details Section */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                Card Name *
                            </label>
                            <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full rounded-[11px] border bg-paper-raised px-[14px] py-[11px] text-[14px] text-ink outline-none ${
                                    errors.cardName ? 'border-rust' : 'border-line-strong'
                                }`}
                                placeholder="e.g., My Custom Card"
                            />
                            {errors.cardName && <p className="mt-1 text-xs text-rust">{errors.cardName}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                Issuer *
                            </label>
                            <input
                                type="text"
                                value={cardData.issuer}
                                onChange={(e) => setCardData(prev => ({ ...prev, issuer: e.target.value }))}
                                className={`w-full rounded-[11px] border bg-paper-raised px-[14px] py-[11px] text-[14px] text-ink outline-none ${
                                    errors.issuer ? 'border-rust' : 'border-line-strong'
                                }`}
                                placeholder="e.g., Chase, Amex, Custom Bank"
                            />
                            {errors.issuer && <p className="mt-1 text-xs text-rust">{errors.issuer}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                Annual Fee ($)
                            </label>
                            <input
                                type="number"
                                value={cardData.annualFee}
                                onChange={(e) => setCardData(prev => ({ ...prev, annualFee: parseFloat(e.target.value) || 0 }))}
                                className={`w-full rounded-[11px] border bg-paper-raised px-[14px] py-[11px] font-mono text-[12px] text-ink outline-none ${
                                    errors.annualFee ? 'border-rust' : 'border-line-strong'
                                }`}
                                placeholder="0"
                                min="0"
                                step="0.01"
                            />
                            {errors.annualFee && <p className="mt-1 text-xs text-rust">{errors.annualFee}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                Card Color
                            </label>
                            <select
                                value={cardData.color}
                                onChange={(e) => setCardData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full rounded-[11px] border border-line-strong bg-paper-raised px-[14px] py-[11px] text-[13px] text-ink outline-none"
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
                            className="rounded-[11px] border border-line-strong px-[13px] py-[7px] font-mono text-[10.5px] tracking-[.09em] text-ink-4"
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
                        className="px-4 py-2 text-[14px] font-medium text-ink-4"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-[11px] bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-night-text"
                    >
                        Create Custom Card
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
