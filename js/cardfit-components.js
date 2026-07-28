const { useState, useEffect, useMemo } = React;

const CARDFIT_WIZARD_STEP_LABELS = ['Start', 'Spending', 'Point values', 'Benefits'];
const CARDFIT_INPUT_CLASS = 'border border-line-strong bg-paper-raised rounded-[11px] px-[14px] py-[11px] text-[13px] text-ink outline-none';
const CARDFIT_META_CLASS = 'font-mono text-[10.5px] tracking-[.1em] text-ink-muted uppercase';
const CARDFIT_PILL_CLASS = 'rounded-full px-[13px] py-[7px] font-mono text-[10.5px] tracking-[.09em]';

/**
 * Optional multi-step setup: spend → point values → credit and benefit values.
 * Everything is skippable; "Skip to recommendations" exits with the current profile.
 */
function CardFitSetupWizard({ profile, userCards, catalog, onChangeProfile, onComplete }) {
    const [step, setStep] = useState(0);
    const maxStep = 3;

    const allCurrencyIds = useMemo(() => REWARD_CURRENCIES.map((currency) => currency.id), []);

    const benefitFocusCards = useMemo(() => {
        const nonCustom = Object.values(catalog).filter((card) => card && !card.isCustom);
        if (userCards && userCards.length) {
            return userCards.map((userCard) => catalog[userCard.id]).filter(Boolean);
        }
        return nonCustom
            .filter(
                (card) =>
                    card.benefits &&
                    card.benefits.some(
                        (benefit) =>
                            benefit.type === BENEFIT_TYPE.CREDIT ||
                            benefit.type === BENEFIT_TYPE.ONE_TIME ||
                            benefit.type === BENEFIT_TYPE.SUBSCRIPTION ||
                            benefit.type === BENEFIT_TYPE.FEATURE
                    )
            )
            .sort((a, b) => (b.annualFee || 0) - (a.annualFee || 0))
            .slice(0, 8);
    }, [catalog, userCards]);

    const goResults = () => onComplete();
    const next = () => setStep((current) => Math.min(current + 1, maxStep));
    const prev = () => setStep((current) => Math.max(current - 1, 0));

    return (
        <div
            className="fixed top-0 right-0 bottom-0 left-[250px] z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
            aria-hidden="false"
        >
            <div className="absolute inset-0 modal-scrim" aria-hidden="true" />
            <div
                className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-[18px] border border-line-card bg-paper-raised modal-shadow sm:max-h-[min(90vh,760px)] sm:max-w-[680px] sm:rounded-[18px]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cardfit-wizard-title"
            >
                <div className="shrink-0 border-b border-rule px-5 pt-5 pb-4 sm:px-6">
                    <div className="mb-3 flex gap-1.5" aria-label="Progress">
                        {[0, 1, 2, 3].map((index) => (
                            <span
                                key={index}
                                className={`h-[3px] flex-1 rounded-full ${index <= step ? 'bg-ink' : 'bg-rule'}`}
                            />
                        ))}
                    </div>
                    <p className="font-mono text-[10px] tracking-[.12em] text-ink-muted uppercase">
                        Step {step + 1} of {maxStep + 1} · {CARDFIT_WIZARD_STEP_LABELS[step]}
                    </p>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    {step === 0 && (
                        <div>
                            <h2
                                id="cardfit-wizard-title"
                                className="pr-8 text-[23px] font-semibold tracking-[-.025em] text-ink"
                            >
                                Set up your comparison
                            </h2>
                            <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.55] text-ink-3">
                                Walk through spending, point values, and the statement credits or perks you actually use.
                                Every field is optional, and sensible defaults are already in place.
                            </p>
                            {userCards && userCards.length > 0 && (
                                <label className="mt-6 flex items-center gap-3 border-t border-rule pt-4">
                                    <input
                                        type="checkbox"
                                        checked={!!profile.onlyOwned}
                                        onChange={(event) =>
                                            onChangeProfile({ ...profile, onlyOwned: event.target.checked })
                                        }
                                        className="h-4 w-4 accent-ink"
                                    />
                                    <span className={CARDFIT_META_CLASS}>Only compare cards I already track</span>
                                </label>
                            )}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h2
                                id="cardfit-wizard-title"
                                className="text-[23px] font-semibold tracking-[-.025em] text-ink"
                            >
                                Your spending
                            </h2>
                            <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.55] text-ink-3">
                                Category rewards are calculated from these amounts. Start with a preset, switch between
                                annual and monthly values, or edit any category.
                            </p>
                            <div className="mt-5 border-t border-rule pt-5">
                                <CardFitSpendEditor key="wizard-spend" profile={profile} onChange={onChangeProfile} />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2
                                id="cardfit-wizard-title"
                                className="text-[23px] font-semibold tracking-[-.025em] text-ink"
                            >
                                How you value points
                            </h2>
                            <div className="mt-4 rounded-[16px] border border-line bg-paper-rail p-4">
                                <p className="text-[13.5px] leading-[1.55] text-ink-3">
                                    Enter the dollar value of one point when you redeem. For example,{' '}
                                    <code className="font-mono text-[11.5px] text-ink">0.017</code> means{' '}
                                    <code className="font-mono text-[11.5px] text-ink">1.7¢</code> per point.
                                </p>
                                <p className="mt-2 font-mono text-[10px] leading-[1.5] tracking-[.08em] text-ink-muted uppercase">
                                    Cashback stays at 1.0 · $0.01 per 1% cash back
                                </p>
                            </div>
                            <div className="mt-5">
                                <CardFitRewardEditor
                                    profile={profile}
                                    neededCurrencyIds={allCurrencyIds}
                                    onChange={onChangeProfile}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2
                                id="cardfit-wizard-title"
                                className="text-[23px] font-semibold tracking-[-.025em] text-ink"
                            >
                                Credits, coupons &amp; perks
                            </h2>
                            <div className="mt-4 rounded-[16px] border border-line bg-paper-rail p-4">
                                <p className="text-[13.5px] leading-[1.55] text-ink-3">
                                    Utilization is the share of each annual benefit you expect to use. Set an override when
                                    the listed value does not match what the benefit is worth to you.
                                </p>
                                <p className="mt-2 font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                    100% = full listed value
                                </p>
                            </div>
                            {benefitFocusCards.length === 0 ? (
                                <p className="mt-5 font-mono text-[10.5px] tracking-[.1em] text-ink-muted uppercase">
                                    No per-card benefits to show · Typical usage will be used
                                </p>
                            ) : (
                                <div className="mt-5 max-h-[360px] overflow-y-auto pr-1">
                                    {benefitFocusCards.map((card) => (
                                        <CardFitBenefitEditor
                                            key={card.id}
                                            card={card}
                                            profile={profile}
                                            onChange={onChangeProfile}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="shrink-0 border-t border-rule bg-paper-rail px-5 py-4 sm:px-6">
                    <div className="flex gap-2.5">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={prev}
                                className="rounded-[11px] border border-line-strong px-[18px] py-3 text-[14.5px] font-semibold text-ink-4"
                            >
                                Back
                            </button>
                        )}
                        {step < maxStep && (
                            <button
                                type="button"
                                onClick={next}
                                className="flex-1 rounded-[11px] bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-night-text"
                            >
                                {step === 0 ? 'Continue' : 'Next'}
                            </button>
                        )}
                        {step === maxStep && (
                            <button
                                type="button"
                                onClick={goResults}
                                className="flex-1 rounded-[11px] bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-night-text"
                            >
                                Show recommendations
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={goResults}
                        className="mt-3 w-full py-1 text-[14px] font-medium text-ink-4"
                    >
                        Skip to recommendations
                    </button>
                </div>
            </div>
        </div>
    );
}

function CardFitComparePanel({
    profile,
    setProfile,
    userCards,
    catalogIds,
    catalogList,
    issuers,
    rows,
    sortKey,
    setSortKey,
    expanded,
    setExpanded,
    filterIssuer,
    setFilterIssuer
}) {
    return (
        <section className="rounded-[18px] border border-line-card bg-paper-raised p-[20px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-[19px] font-semibold tracking-[-.02em] text-ink">Compare</h2>
                    <p className="mt-1.5 font-mono text-[10px] tracking-[.1em] text-ink-muted uppercase">
                        {rows.length} {rows.length === 1 ? 'card' : 'cards'} ranked by value
                    </p>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                    <label className="flex items-center gap-2.5 pb-[11px]">
                        <input
                            type="checkbox"
                            checked={!!profile.onlyOwned}
                            onChange={(event) => setProfile({ ...profile, onlyOwned: event.target.checked })}
                            className="h-4 w-4 accent-ink"
                        />
                        <span className={CARDFIT_META_CLASS}>Only cards I track</span>
                    </label>
                    <label>
                        <span className={`mb-1.5 block ${CARDFIT_META_CLASS}`}>Issuer</span>
                        <select
                            className={`${CARDFIT_INPUT_CLASS} min-w-[170px] py-[10px] font-mono text-[11px] tracking-[.06em]`}
                            value={filterIssuer}
                            onChange={(event) => setFilterIssuer(event.target.value)}
                        >
                            <option value="">All issuers</option>
                            {issuers.map((issuer) => (
                                <option key={issuer} value={issuer}>
                                    {issuer}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className="mt-5 rounded-[16px] border border-line bg-paper-rail px-4">
                <div className="flex items-center justify-between py-3">
                    <span className={CARDFIT_META_CLASS}>Cards in comparison</span>
                    <span className="font-mono text-[9.5px] tracking-[.08em] text-ink-muted uppercase">
                        None checked = all
                    </span>
                </div>
                <div className="max-h-[190px] overflow-y-auto border-t border-rule">
                    {catalogList.map((card) => {
                        const owned = !profile.onlyOwned || (userCards || []).some((userCard) => userCard.id === card.id);
                        if (profile.onlyOwned && !owned) return null;
                        if (card.isCustom) return null;

                        const allMode = !profile.selectedCards || profile.selectedCards.length === 0;
                        const checked = allMode || profile.selectedCards.includes(card.id);
                        return (
                            <label
                                key={card.id}
                                className="flex items-center gap-3 border-t border-rule-soft py-2.5 first:border-t-0"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                        const all = catalogIds;
                                        if (allMode) {
                                            if (!event.target.checked) {
                                                setProfile({
                                                    ...profile,
                                                    selectedCards: all.filter((id) => id !== card.id)
                                                });
                                            }
                                            return;
                                        }
                                        let current = [...profile.selectedCards];
                                        if (event.target.checked) {
                                            if (!current.includes(card.id)) current.push(card.id);
                                        } else {
                                            current = current.filter((id) => id !== card.id);
                                        }
                                        setProfile({ ...profile, selectedCards: current });
                                    }}
                                    className="h-4 w-4 shrink-0 accent-ink"
                                />
                                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
                                    {card.name}
                                </span>
                                <span className="shrink-0 font-mono text-[10.5px] tracking-[.06em] text-ink-muted">
                                    {formatCurrency(card.annualFee)}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="mt-5">
                <CardFitComparisonTable
                    rows={rows}
                    sortKey={sortKey}
                    onSort={setSortKey}
                    expandedId={expanded}
                    onToggleRow={(id) => setExpanded((current) => (current === id ? null : id))}
                />
            </div>
        </section>
    );
}

function CardFitSection({ title, open, onToggle, children }) {
    return (
        <section className="overflow-hidden rounded-[16px] border border-line-card bg-paper-raised">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-[18px] py-[15px] text-left"
            >
                <span className="font-mono text-[10.5px] tracking-[.1em] text-ink-4 uppercase">{title}</span>
                <span className="font-mono text-[14px] text-ink-muted" aria-hidden="true">
                    {open ? '−' : '+'}
                </span>
            </button>
            {open && <div className="border-t border-rule px-[18px] py-[18px]">{children}</div>}
        </section>
    );
}

function CardFitSpendEditor({ profile, onChange }) {
    const [localPreset, setLocalPreset] = useState(profile.spendPreset || 'custom');
    const spendMode = profile.spendMode || 'annual';
    const presets = ['custom', 'low', 'medium', 'high'];

    const setMode = (nextMode) => {
        if (nextMode === spendMode) return;
        const spend = cardfitConvertSpendForModeChange(profile.spend, spendMode, nextMode);
        onChange({ ...profile, spendMode: nextMode, spend });
    };

    const setPreset = (preset) => {
        setLocalPreset(preset);
        if (preset !== 'custom' && SPEND_PRESETS[preset]) {
            const spend = cardfitPresetSpendForMode(preset, spendMode);
            onChange({ ...profile, spend, spendPreset: preset });
        } else {
            onChange({ ...profile, spendPreset: 'custom' });
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                <div>
                    <span className={`mb-2 block ${CARDFIT_META_CLASS}`}>Input mode</span>
                    <div className="flex gap-2" aria-label="Spending input mode">
                        {['annual', 'monthly'].map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setMode(mode)}
                                aria-pressed={spendMode === mode}
                                className={`${CARDFIT_PILL_CLASS} ${
                                    spendMode === mode
                                        ? 'bg-ink text-night-text'
                                        : 'border border-line-strong text-ink-4'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <span className={`mb-2 block ${CARDFIT_META_CLASS}`}>Preset</span>
                    <div className="flex flex-wrap gap-2" aria-label="Spending preset">
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setPreset(preset)}
                                aria-pressed={localPreset === preset}
                                className={`${CARDFIT_PILL_CLASS} ${
                                    localPreset === preset
                                        ? 'bg-ink text-night-text'
                                        : 'border border-line-strong text-ink-4'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <p className="mt-4 font-mono text-[9.5px] leading-[1.55] tracking-[.08em] text-ink-muted uppercase">
                Presets begin as annual spend · Monthly mode shows annual ÷ 12
            </p>

            <div className="mt-4 grid max-h-[360px] grid-cols-1 gap-x-5 overflow-y-auto border-t border-rule pr-1 sm:grid-cols-2">
                {SPEND_CATEGORIES.map((category) => (
                    <label
                        key={category.id}
                        className="flex items-center gap-3 border-t border-rule-soft py-2.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                    >
                        <span className="min-w-0 flex-1 font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                            {category.label}
                        </span>
                        <input
                            data-testid="cardfit-spend-input"
                            type="number"
                            min="0"
                            step="1"
                            value={profile.spend[category.id] ?? 0}
                            onChange={(event) => {
                                const amount = Math.max(0, parseFloat(event.target.value) || 0);
                                onChange({
                                    ...profile,
                                    spend: { ...profile.spend, [category.id]: amount },
                                    spendPreset: 'custom'
                                });
                                setLocalPreset('custom');
                            }}
                            className={`${CARDFIT_INPUT_CLASS} w-[126px] py-[9px] text-right font-mono text-[12px]`}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

function CardFitRewardEditor({ profile, neededCurrencyIds, onChange }) {
    return (
        <div>
            <p className="mb-3 font-mono text-[9.5px] leading-[1.55] tracking-[.08em] text-ink-muted uppercase">
                Dollar value per point · Cashback remains 1.0
            </p>
            <div className="border-t border-rule">
                {neededCurrencyIds.map((id) => {
                    const meta = REWARD_CURRENCIES.find((currency) => currency.id === id);
                    const label = meta ? meta.label : id;
                    return (
                        <label
                            key={id}
                            className="flex items-center justify-between gap-4 border-t border-rule-soft py-2.5 first:border-t-0"
                        >
                            <span className="font-mono text-[10px] tracking-[.09em] text-ink-muted uppercase">
                                {label}
                            </span>
                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                value={profile.currencyValues[id] ?? 0.01}
                                onChange={(event) => {
                                    const value = Math.max(0, parseFloat(event.target.value) || 0);
                                    onChange({
                                        ...profile,
                                        currencyValues: { ...profile.currencyValues, [id]: value }
                                    });
                                }}
                                className={`${CARDFIT_INPUT_CLASS} w-[126px] py-[9px] text-right font-mono text-[12px]`}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

function CardFitBenefitEditor({ card, profile, onChange }) {
    if (!card || !card.benefits) return null;

    return (
        <section className="mb-5 last:mb-0">
            <h4 className="mb-2 text-[15px] font-semibold tracking-[-.012em] text-ink">{card.name}</h4>
            <div className="border-t border-rule">
                {card.benefits.map((benefit) => {
                    const config = profile.benefitValues[benefit.id] || {};
                    const utilization =
                        typeof config.utilization === 'number'
                            ? config.utilization
                            : cardfitDefaultUtilizationForBenefit(benefit);
                    const isCredit =
                        benefit.type === BENEFIT_TYPE.CREDIT ||
                        benefit.type === BENEFIT_TYPE.ONE_TIME ||
                        benefit.type === BENEFIT_TYPE.SUBSCRIPTION;
                    if (!isCredit && benefit.type !== BENEFIT_TYPE.FEATURE) return null;

                    return (
                        <div key={benefit.id} className="border-t border-rule-soft py-3 first:border-t-0">
                            <div className="text-[13.5px] font-medium leading-[1.4] text-ink">{benefit.name}</div>
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-3">
                                <label className="flex min-w-[240px] flex-1 items-center gap-3">
                                    <span className={CARDFIT_META_CLASS}>Util</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={Math.round(utilization * 100)}
                                        onChange={(event) => {
                                            const nextUtilization = (parseInt(event.target.value, 10) || 0) / 100;
                                            onChange({
                                                ...profile,
                                                benefitValues: {
                                                    ...profile.benefitValues,
                                                    [benefit.id]: {
                                                        ...config,
                                                        utilization: nextUtilization,
                                                        overrideValue: config.overrideValue
                                                    }
                                                }
                                            });
                                        }}
                                        className="min-w-0 flex-1 accent-ink"
                                    />
                                    <span className="w-10 text-right font-mono text-[10.5px] text-ink-muted">
                                        {Math.round(utilization * 100)}%
                                    </span>
                                </label>
                                <label className="flex items-center gap-2.5">
                                    <span className={CARDFIT_META_CLASS}>Override $</span>
                                    <input
                                        type="number"
                                        placeholder="Auto"
                                        value={config.overrideValue != null ? config.overrideValue : ''}
                                        onChange={(event) => {
                                            const text = event.target.value;
                                            const overrideValue =
                                                text === '' ? null : Math.max(0, parseFloat(text) || 0);
                                            onChange({
                                                ...profile,
                                                benefitValues: {
                                                    ...profile.benefitValues,
                                                    [benefit.id]: {
                                                        ...config,
                                                        utilization,
                                                        overrideValue
                                                    }
                                                }
                                            });
                                        }}
                                        className={`${CARDFIT_INPUT_CLASS} w-[110px] py-[9px] text-right font-mono text-[12px] placeholder:text-ink-faint`}
                                    />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function CardFitBaselineEditor({ profile, catalogIds, onChange }) {
    const baseline = profile.baseline || { type: 'flat_rate', flatRate: 0.02 };
    const radioClass = 'h-4 w-4 shrink-0 accent-ink';
    const choiceClass = 'flex items-center gap-3 font-mono text-[10.5px] tracking-[.09em] text-ink-4 uppercase';

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className={choiceClass}>
                        <input
                            type="radio"
                            checked={baseline.type === 'flat_rate'}
                            onChange={() =>
                                onChange({
                                    ...profile,
                                    baseline: {
                                        type: 'flat_rate',
                                        flatRate: baseline.flatRate || 0.02,
                                        cardId: null,
                                        rates: {}
                                    }
                                })
                            }
                            className={radioClass}
                        />
                        Flat % on all spend
                    </label>
                    {baseline.type === 'flat_rate' && (
                        <input
                            type="number"
                            step="0.001"
                            value={baseline.flatRate}
                            onChange={(event) =>
                                onChange({
                                    ...profile,
                                    baseline: {
                                        ...baseline,
                                        flatRate: Math.max(0, parseFloat(event.target.value) || 0)
                                    }
                                })
                            }
                            className={`${CARDFIT_INPUT_CLASS} mt-3 w-[126px] py-[9px] text-right font-mono text-[12px]`}
                        />
                    )}
                </div>

                <div className="border-t border-rule pt-4">
                    <label className={choiceClass}>
                        <input
                            type="radio"
                            checked={baseline.type === 'per_category'}
                            onChange={() =>
                                onChange({
                                    ...profile,
                                    baseline: {
                                        type: 'per_category',
                                        flatRate: null,
                                        cardId: null,
                                        rates: baseline.rates || {}
                                    }
                                })
                            }
                            className={radioClass}
                        />
                        Per-category rate
                    </label>
                    {baseline.type === 'per_category' && (
                        <div className="mt-3 grid max-h-[260px] grid-cols-1 gap-x-5 overflow-y-auto border-t border-rule sm:grid-cols-2">
                            {SPEND_CATEGORIES.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center justify-between gap-3 border-t border-rule-soft py-2.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                                >
                                    <span className="font-mono text-[9.5px] tracking-[.08em] text-ink-muted uppercase">
                                        {category.label}
                                    </span>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={
                                            baseline.rates && baseline.rates[category.id] != null
                                                ? baseline.rates[category.id]
                                                : 0
                                        }
                                        onChange={(event) => {
                                            const rates = {
                                                ...(baseline.rates || {}),
                                                [category.id]: Math.max(0, parseFloat(event.target.value) || 0)
                                            };
                                            onChange({ ...profile, baseline: { ...baseline, rates } });
                                        }}
                                        className={`${CARDFIT_INPUT_CLASS} w-[100px] py-[8px] text-right font-mono text-[11.5px]`}
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-rule pt-4">
                    <label className={choiceClass}>
                        <input
                            type="radio"
                            checked={baseline.type === 'card'}
                            onChange={() =>
                                onChange({
                                    ...profile,
                                    baseline: {
                                        type: 'card',
                                        cardId: baseline.cardId || catalogIds[0],
                                        flatRate: null,
                                        rates: {}
                                    }
                                })
                            }
                            className={radioClass}
                        />
                        Another card · Ongoing value only
                    </label>
                    {baseline.type === 'card' && (
                        <select
                            className={`${CARDFIT_INPUT_CLASS} mt-3 w-full font-mono text-[11px] tracking-[.05em]`}
                            value={baseline.cardId || ''}
                            onChange={(event) =>
                                onChange({
                                    ...profile,
                                    baseline: { ...baseline, cardId: event.target.value }
                                })
                            }
                        >
                            {catalogIds.map((id) => (
                                <option key={id} value={id}>
                                    {(availableCards[id] && availableCards[id].name) || id}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
}

function CardFitComparisonTable({ rows, sortKey, onSort, expandedId, onToggleRow }) {
    const headers = [
        { k: 'name', label: 'Card' },
        { k: 'annualFee', label: 'Fee' },
        { k: 'rewards', label: 'Rewards' },
        { k: 'credits', label: 'Credits' },
        { k: 'soft', label: 'Soft' },
        { k: 'ongoingNet', label: 'Ongoing' },
        { k: 'firstYear', label: '1st yr' },
        { k: 'inc', label: 'vs base' }
    ];
    const valueCellClass = 'whitespace-nowrap px-3 py-3 font-mono text-[11px] text-ink-muted';

    return (
        <div className="overflow-x-auto rounded-[16px] border border-line-card">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr>
                        {headers.map((header) => (
                            <th key={header.k} className="px-3 py-3 text-left">
                                <button
                                    type="button"
                                    onClick={() => onSort(header.k)}
                                    className={`font-mono text-[9.5px] tracking-[.11em] uppercase ${
                                        sortKey === header.k ? 'font-medium text-ink' : 'text-ink-muted'
                                    }`}
                                >
                                    {header.label}
                                    {sortKey === header.k ? ' ↓' : ''}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const { card, res } = row;
                        const incremental = res.incrementalOngoing;
                        const positive = incremental >= 0;
                        const isTopRanked = index === 0 && sortKey !== 'name';
                        return (
                            <React.Fragment key={card.id}>
                                <tr
                                    className="cursor-pointer border-t border-rule"
                                    onClick={() => onToggleRow(card.id)}
                                >
                                    <td className="min-w-[200px] px-3 py-3">
                                        <div
                                            className={`text-[13.5px] tracking-[-.01em] text-ink ${
                                                isTopRanked ? 'font-semibold' : 'font-medium'
                                            }`}
                                        >
                                            {card.name}
                                        </div>
                                        <div className="mt-1 font-mono text-[9px] tracking-[.09em] text-ink-muted uppercase">
                                            {isTopRanked ? 'Top ranked · ' : ''}
                                            {expandedId === card.id ? 'Close detail' : 'Open detail'}
                                        </div>
                                    </td>
                                    <td className={valueCellClass}>{formatCurrency(res.annualFee)}</td>
                                    <td className={valueCellClass}>{formatCurrency(res.rewards)}</td>
                                    <td className={valueCellClass}>{formatCurrency(res.credits)}</td>
                                    <td className={valueCellClass}>{formatCurrency(res.softBenefits)}</td>
                                    <td className={valueCellClass}>{formatCurrency(res.ongoingNet)}</td>
                                    <td className={valueCellClass}>{formatCurrency(res.incrementalFirstYear)}</td>
                                    <td className={`${valueCellClass} font-medium text-ink`}>
                                        {positive ? '+' : ''}
                                        {formatCurrency(incremental)} · {positive ? 'GAIN' : 'LOSS'}
                                    </td>
                                </tr>
                                {expandedId === card.id && (
                                    <tr className="border-t border-rule">
                                        <td colSpan="8" className="px-3 py-4">
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
                                                <div className="font-mono text-[10px] tracking-[.07em] text-ink-muted uppercase">
                                                    Baseline · {formatCurrency(res.baselineValue)}
                                                </div>
                                                <div className="font-mono text-[10px] tracking-[.07em] text-ink-muted uppercase">
                                                    First-year bonus · {formatCurrency(res.firstYearBonus)}
                                                </div>
                                                <div className="font-mono text-[9px] leading-[1.5] tracking-[.06em] text-ink-muted uppercase sm:col-span-1">
                                                    Assumes uncapped category earn until TODO(cardfit-caps) and
                                                    TODO(cardfit-rotating)
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {rows.length === 0 && (
                        <tr className="border-t border-rule">
                            <td
                                colSpan="8"
                                className="px-3 py-8 text-center font-mono text-[10px] tracking-[.11em] text-ink-muted uppercase"
                            >
                                No cards match these comparison settings
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function CardFitPage({ userCards, onBackToTracker }) {
    const catalog = availableCards;
    const [profile, setProfile] = useState(() => {
        try {
            const raw = localStorage.getItem(CARDFIT_PROFILE_KEY);
            if (raw) return normalizeCardfitProfile(JSON.parse(raw));
        } catch (error) {
            console.warn('CardFit: bad profile, using defaults', error);
        }
        return buildFreshCardfitProfile();
    });
    const [sectionOpen, setSectionOpen] = useState({
        spend: true,
        reward: false,
        benefits: false,
        base: false
    });
    const [sortKey, setSortKey] = useState('inc');
    const [expanded, setExpanded] = useState(null);
    const [filterIssuer, setFilterIssuer] = useState('');

    const uiFlow = profile.uiFlow || CARDFIT_UI_FLOW.RESULTS;

    useEffect(() => {
        try {
            localStorage.setItem(CARDFIT_PROFILE_KEY, JSON.stringify(profile));
        } catch (error) {
            console.warn('CardFit: could not save', error);
        }
    }, [profile]);

    const catalogIds = useMemo(() => Object.keys(catalog), [catalog]);
    const catalogList = useMemo(
        () => Object.values(catalog).filter((card) => (filterIssuer ? card.issuer === filterIssuer : true)),
        [catalog, filterIssuer]
    );
    const issuers = useMemo(
        () => [...new Set(Object.values(catalog).map((card) => card.issuer))],
        [catalog]
    );

    const baseSelected = useMemo(() => {
        if (profile.selectedCards && profile.selectedCards.length) return profile.selectedCards;
        return catalogIds;
    }, [profile.selectedCards, catalogIds]);

    const selected = useMemo(() => {
        let selectedIds = baseSelected;
        if (profile.onlyOwned) {
            const owned = new Set((userCards || []).map((card) => card.id));
            selectedIds = selectedIds.filter((id) => owned.has(id));
        }
        return selectedIds;
    }, [baseSelected, profile.onlyOwned, userCards]);

    const neededCurrencies = useMemo(() => {
        const currencies = new Set();
        selected.forEach((id) => {
            const card = catalog[id];
            if (card && card.rewardCurrency) currencies.add(card.rewardCurrency);
        });
        return Array.from(currencies);
    }, [selected, catalog]);

    const rows = useMemo(() => {
        const results = selected
            .map((id) => catalog[id])
            .filter(Boolean)
            .map((card) => ({
                card,
                res: cardfitCalculateCardNetValue(card, profile, catalog)
            }));
        const keyMap = {
            inc: 'incrementalOngoing',
            ongoingNet: 'ongoingNet',
            rewards: 'rewards',
            annualFee: 'annualFee',
            firstYear: 'incrementalFirstYear',
            credits: 'credits',
            soft: 'softBenefits',
            name: 'name'
        };
        if (sortKey === 'name') {
            return results.sort((a, b) => a.card.name.localeCompare(b.card.name));
        }
        const resultKey = keyMap[sortKey] || 'incrementalOngoing';
        return results.sort((a, b) => (b.res[resultKey] || 0) - (a.res[resultKey] || 0));
    }, [selected, profile, catalog, sortKey]);

    const comparePanelProps = {
        profile,
        setProfile,
        userCards,
        catalogIds,
        catalogList,
        issuers,
        rows,
        sortKey,
        setSortKey,
        expanded,
        setExpanded,
        filterIssuer,
        setFilterIssuer
    };

    return (
        <div className="w-full bg-paper">
            <header className="mb-[22px] flex flex-wrap items-end justify-between gap-5">
                <div>
                    <h2 className="m-0 text-[30px] leading-none font-semibold tracking-[-.03em] text-ink">
                        CardFit
                    </h2>
                    <div className="mt-[7px] font-mono text-[10.5px] tracking-[.12em] text-ink-muted uppercase">
                        Net value from your numbers
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {uiFlow === CARDFIT_UI_FLOW.ADVANCED && (
                        <button
                            type="button"
                            onClick={() =>
                                setProfile((current) => ({
                                    ...current,
                                    uiFlow: CARDFIT_UI_FLOW.RESULTS
                                }))
                            }
                            className="text-[14px] font-medium text-ink-4"
                        >
                            Back to results
                        </button>
                    )}
                    {typeof onBackToTracker === 'function' && (
                        <button
                            type="button"
                            onClick={onBackToTracker}
                            className="text-[14px] font-medium text-ink-4"
                        >
                            Back to tracker
                        </button>
                    )}
                </div>
            </header>

            {uiFlow === CARDFIT_UI_FLOW.QUICK_START && (
                <CardFitSetupWizard
                    profile={profile}
                    userCards={userCards}
                    catalog={catalog}
                    onChangeProfile={setProfile}
                    onComplete={() =>
                        setProfile((current) => ({
                            ...current,
                            uiFlow: CARDFIT_UI_FLOW.RESULTS
                        }))
                    }
                />
            )}

            {uiFlow === CARDFIT_UI_FLOW.RESULTS && (
                <div>
                    <section className="mb-[18px] flex flex-wrap items-start justify-between gap-5 border-t border-rule px-1 pt-[18px]">
                        <div>
                            <h2 className="text-[20px] font-semibold tracking-[-.02em] text-ink">
                                Your comparison
                            </h2>
                            <p className="mt-1.5 max-w-[68ch] text-[13.5px] leading-[1.5] text-ink-muted">
                                Ranked by incremental value against your baseline. Open a row for the breakdown or refine
                                the assumptions behind the ranking.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setProfile((current) => ({
                                        ...current,
                                        uiFlow: CARDFIT_UI_FLOW.QUICK_START
                                    }))
                                }
                                className="text-[14px] font-medium text-ink-4"
                            >
                                Quick setup
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setProfile((current) => ({
                                        ...current,
                                        uiFlow: CARDFIT_UI_FLOW.ADVANCED
                                    }))
                                }
                                className="rounded-[11px] bg-ink px-[22px] py-3 text-[14.5px] font-semibold text-night-text"
                            >
                                Refine assumptions
                            </button>
                        </div>
                    </section>
                    <CardFitComparePanel {...comparePanelProps} />
                </div>
            )}

            {uiFlow === CARDFIT_UI_FLOW.ADVANCED && (
                <div>
                    <div className="mb-[18px] border-t border-rule px-1 pt-[18px]">
                        <h2 className="text-[20px] font-semibold tracking-[-.02em] text-ink">Refine assumptions</h2>
                        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-ink-muted">
                            Adjust any input. The full-width comparison below updates immediately.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <CardFitSection
                            title="Spending by category"
                            open={sectionOpen.spend}
                            onToggle={() =>
                                setSectionOpen((current) => ({ ...current, spend: !current.spend }))
                            }
                        >
                            <CardFitSpendEditor profile={profile} onChange={setProfile} />
                        </CardFitSection>
                        <CardFitSection
                            title="Point values · $ per point"
                            open={sectionOpen.reward}
                            onToggle={() =>
                                setSectionOpen((current) => ({ ...current, reward: !current.reward }))
                            }
                        >
                            <CardFitRewardEditor
                                profile={profile}
                                neededCurrencyIds={neededCurrencies}
                                onChange={setProfile}
                            />
                        </CardFitSection>
                        <CardFitSection
                            title="Benefits and credits · Per card"
                            open={sectionOpen.benefits}
                            onToggle={() =>
                                setSectionOpen((current) => ({ ...current, benefits: !current.benefits }))
                            }
                        >
                            {selected.map((id) => (
                                <CardFitBenefitEditor
                                    key={id}
                                    card={catalog[id]}
                                    profile={profile}
                                    onChange={setProfile}
                                />
                            ))}
                        </CardFitSection>
                        <CardFitSection
                            title="Baseline · What you compare against"
                            open={sectionOpen.base}
                            onToggle={() =>
                                setSectionOpen((current) => ({ ...current, base: !current.base }))
                            }
                        >
                            <CardFitBaselineEditor
                                profile={profile}
                                catalogIds={catalogIds}
                                onChange={setProfile}
                            />
                        </CardFitSection>
                    </div>

                    <div className="mt-[18px]">
                        <CardFitComparePanel {...comparePanelProps} />
                    </div>
                </div>
            )}
        </div>
    );
}
