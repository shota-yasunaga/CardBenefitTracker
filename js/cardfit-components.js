const { useState, useEffect, useMemo } = React;

function CardFitQuickStartStep({ profile, userCards, onChangeProfile, onShowRecommendations }) {
    const preset = ['low', 'medium', 'high'].includes(profile.spendPreset) ? profile.spendPreset : 'medium';
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 shadow-lg p-8 space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Find cards that fit you</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Nothing is required. We start with a typical <strong>medium</strong> spend profile; you can fine-tune
                        every category, point value, and benefit on the next screens.
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">Typical spending level</label>
                    <p className="text-xs text-slate-500">Uses annual category totals; switch to detailed monthly/annual in Refine.</p>
                    <select
                        value={preset}
                        onChange={(e) => {
                            const p = e.target.value;
                            if (p !== 'custom' && SPEND_PRESETS[p]) {
                                const spend = cardfitPresetSpendForMode(p, profile.spendMode || 'annual');
                                onChangeProfile({ ...profile, spend, spendPreset: p });
                            }
                        }}
                        className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-slate-900"
                    >
                        <option value="low">Low (lighter spend overall)</option>
                        <option value="medium">Medium (typical — default)</option>
                        <option value="high">High (heavier travel &amp; general spend)</option>
                    </select>
                </div>
                {(userCards && userCards.length > 0 && (
                    <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                        <input
                            type="checkbox"
                            checked={!!profile.onlyOwned}
                            onChange={(e) => onChangeProfile({ ...profile, onlyOwned: e.target.checked })}
                        />
                        Only include cards I already track
                    </label>
                )) || null}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onShowRecommendations}
                        className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm"
                    >
                        Show recommendations
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
    selected,
    rows,
    sortKey,
    setSortKey,
    expanded,
    setExpanded,
    filterIssuer,
    setFilterIssuer
}) {
    return (
        <div>
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Compare</h2>
            <div className="mb-2 flex flex-wrap gap-2 items-center">
                <label className="text-sm">
                    <input
                        type="checkbox"
                        checked={!!profile.onlyOwned}
                        onChange={(e) => setProfile({ ...profile, onlyOwned: e.target.checked })}
                    />{' '}
                    Only cards I track
                </label>
            </div>
            <div className="mb-2">
                <span className="text-sm mr-2">Issuer</span>
                <select
                    className="border rounded px-2 py-1 text-sm dark:bg-slate-900"
                    value={filterIssuer}
                    onChange={(e) => setFilterIssuer(e.target.value)}
                >
                    <option value="">All</option>
                    {issuers.map((i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-2 max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded p-2 text-sm">
                {catalogList.map((c) => {
                    const own = !profile.onlyOwned || (userCards || []).some((u) => u.id === c.id);
                    if (profile.onlyOwned && !own) {
                        return null;
                    }
                    if (c.isCustom) {
                        return null;
                    }
                    const allMode = !profile.selectedCards || profile.selectedCards.length === 0;
                    const checked = allMode || profile.selectedCards.includes(c.id);
                    return (
                        <label key={c.id} className="flex items-center gap-2 py-1">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                    const all = catalogIds;
                                    if (allMode) {
                                        if (!e.target.checked) {
                                            setProfile({ ...profile, selectedCards: all.filter((x) => x !== c.id) });
                                        }
                                        return;
                                    }
                                    let cur = [...profile.selectedCards];
                                    if (e.target.checked) {
                                        if (!cur.includes(c.id)) {
                                            cur.push(c.id);
                                        }
                                    } else {
                                        cur = cur.filter((x) => x !== c.id);
                                    }
                                    setProfile({ ...profile, selectedCards: cur });
                                }}
                            />
                            {c.name} · {formatCurrency(c.annualFee)}
                        </label>
                    );
                })}
            </div>
            <p className="text-xs text-slate-500 mb-2">Tip: check boxes to select cards; if none checked, all catalog cards are compared.</p>
            <CardFitComparisonTable
                rows={rows}
                sortKey={sortKey}
                onSort={setSortKey}
                expandedId={expanded}
                onToggleRow={(id) => setExpanded((x) => (x === id ? null : id))}
            />
        </div>
    );
}

function CardFitSection({ title, open, onToggle, children }) {
    return (
        <div className="mb-4 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white/80 dark:bg-slate-800/80">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-slate-900 dark:text-white"
            >
                <span>{title}</span>
                <span className="text-slate-500">{open ? '−' : '+'}</span>
            </button>
            {open && <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-600 pt-3">{children}</div>}
        </div>
    );
}

function CardFitSpendEditor({ profile, onChange }) {
    const [localPreset, setLocalPreset] = useState(profile.spendPreset || 'custom');
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Input mode</span>
                <select
                    value={profile.spendMode}
                    onChange={(e) => {
                        const next = e.target.value;
                        const prev = profile.spendMode || 'annual';
                        const newSpend = cardfitConvertSpendForModeChange(profile.spend, prev, next);
                        onChange({ ...profile, spendMode: next, spend: newSpend });
                    }}
                    className="border rounded px-2 py-1 text-sm dark:bg-slate-900"
                >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div>
                <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">Presets</span>
                <select
                    value={localPreset}
                    onChange={(e) => {
                        const p = e.target.value;
                        setLocalPreset(p);
                        if (p !== 'custom' && SPEND_PRESETS[p]) {
                            const spend = cardfitPresetSpendForMode(p, profile.spendMode || 'annual');
                            onChange({ ...profile, spend, spendPreset: p });
                        } else {
                            onChange({ ...profile, spendPreset: 'custom' });
                        }
                    }}
                    className="border rounded px-2 py-1 text-sm dark:bg-slate-900"
                >
                    <option value="custom">Custom</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                    Low/Medium/High are defined as annual spend; in Monthly mode each field is the per-month amount (annual ÷ 12).
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                {SPEND_CATEGORIES.map((c) => (
                    <label key={c.id} className="flex flex-col text-xs">
                        <span className="text-slate-600 dark:text-slate-300">{c.label}</span>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={profile.spend[c.id] ?? 0}
                            onChange={(e) => {
                                const n = Math.max(0, parseFloat(e.target.value) || 0);
                                onChange({
                                    ...profile,
                                    spend: { ...profile.spend, [c.id]: n },
                                    spendPreset: 'custom'
                                });
                                setLocalPreset('custom');
                            }}
                            className="border rounded px-2 py-1 dark:bg-slate-900"
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}

function CardFitRewardEditor({ profile, neededCurrencyIds, onChange }) {
    return (
        <div className="space-y-2">
            <p className="text-xs text-slate-500">Values in dollars per point (e.g. 0.017 = 1.7¢).</p>
            {neededCurrencyIds.map((id) => {
                const meta = REWARD_CURRENCIES.find((c) => c.id === id);
                const label = meta ? meta.label : id;
                return (
                    <label key={id} className="flex justify-between items-center gap-2 text-sm">
                        <span className="text-slate-700 dark:text-slate-200">{label}</span>
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={profile.currencyValues[id] ?? 0.01}
                            onChange={(e) => {
                                const v = Math.max(0, parseFloat(e.target.value) || 0);
                                onChange({
                                    ...profile,
                                    currencyValues: { ...profile.currencyValues, [id]: v }
                                });
                            }}
                            className="w-28 border rounded px-2 py-1 dark:bg-slate-900"
                        />
                    </label>
                );
            })}
        </div>
    );
}

function CardFitBenefitEditor({ card, profile, onChange }) {
    if (!card || !card.benefits) {
        return null;
    }
    return (
        <div className="mb-4">
            <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-2">{card.name}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {card.benefits.map((b) => {
                    const cfg = profile.benefitValues[b.id] || {};
                    const u = typeof cfg.utilization === 'number' ? cfg.utilization : cardfitDefaultUtilizationForBenefit(b);
                    const isCredit = b.type === BENEFIT_TYPE.CREDIT || b.type === BENEFIT_TYPE.ONE_TIME || b.type === BENEFIT_TYPE.SUBSCRIPTION;
                    if (!isCredit && b.type !== BENEFIT_TYPE.FEATURE) {
                        return null;
                    }
                    return (
                        <div key={b.id} className="text-xs border border-slate-200 dark:border-slate-600 rounded p-2">
                            <div className="font-medium text-slate-800 dark:text-slate-100">{b.name}</div>
                            <div className="flex flex-wrap gap-2 mt-1 items-center">
                                <label className="flex items-center gap-1">
                                    Util
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={Math.round(u * 100)}
                                        onChange={(e) => {
                                            const nu = (parseInt(e.target.value, 10) || 0) / 100;
                                            onChange({
                                                ...profile,
                                                benefitValues: {
                                                    ...profile.benefitValues,
                                                    [b.id]: { ...cfg, utilization: nu, overrideValue: cfg.overrideValue }
                                                }
                                            });
                                        }}
                                    />
                                    <span>{Math.round(u * 100)}%</span>
                                </label>
                                <label>
                                    Override $
                                    <input
                                        type="number"
                                        className="w-20 border rounded ml-1 dark:bg-slate-900"
                                        placeholder="auto"
                                        value={cfg.overrideValue != null ? cfg.overrideValue : ''}
                                        onChange={(e) => {
                                            const t = e.target.value;
                                            const ov = t === '' ? null : Math.max(0, parseFloat(t) || 0);
                                            onChange({
                                                ...profile,
                                                benefitValues: {
                                                    ...profile.benefitValues,
                                                    [b.id]: { ...cfg, utilization: u, overrideValue: ov }
                                                }
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CardFitBaselineEditor({ profile, catalogIds, onChange }) {
    const b = profile.baseline || { type: 'flat_rate', flatRate: 0.02 };
    return (
        <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    checked={b.type === 'flat_rate'}
                    onChange={() => onChange({ ...profile, baseline: { type: 'flat_rate', flatRate: b.flatRate || 0.02, cardId: null, rates: {} } })}
                />
                Flat % on all spend
            </label>
            {b.type === 'flat_rate' && (
                <input
                    type="number"
                    step="0.001"
                    className="border rounded px-2 py-1 w-32 dark:bg-slate-900"
                    value={b.flatRate}
                    onChange={(e) =>
                        onChange({
                            ...profile,
                            baseline: { ...b, flatRate: Math.max(0, parseFloat(e.target.value) || 0) }
                        })
                    }
                />
            )}
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    checked={b.type === 'per_category'}
                    onChange={() =>
                        onChange({ ...profile, baseline: { type: 'per_category', flatRate: null, cardId: null, rates: b.rates || {} } })
                    }
                />
                Per-category rate (same keys as spend)
            </label>
            {b.type === 'per_category' && (
                <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                    {SPEND_CATEGORIES.map((c) => (
                        <label key={c.id} className="flex justify-between text-xs">
                            {c.label}
                            <input
                                type="number"
                                step="0.001"
                                className="w-20 border rounded dark:bg-slate-900"
                                value={b.rates && b.rates[c.id] != null ? b.rates[c.id] : 0}
                                onChange={(e) => {
                                    const r = { ...(b.rates || {}), [c.id]: Math.max(0, parseFloat(e.target.value) || 0) };
                                    onChange({ ...profile, baseline: { ...b, rates: r } });
                                }}
                            />
                        </label>
                    ))}
                </div>
            )}
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    checked={b.type === 'card'}
                    onChange={() => onChange({ ...profile, baseline: { type: 'card', cardId: b.cardId || catalogIds[0], flatRate: null, rates: {} } })}
                />
                Another card (ongoing value only, no double baseline)
            </label>
            {b.type === 'card' && (
                <select
                    className="border rounded px-2 py-1 w-full dark:bg-slate-900"
                    value={b.cardId || ''}
                    onChange={(e) => onChange({ ...profile, baseline: { ...b, cardId: e.target.value } })}
                >
                    {catalogIds.map((id) => (
                        <option key={id} value={id}>
                            {(availableCards[id] && availableCards[id].name) || id}
                        </option>
                    ))}
                </select>
            )}
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
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-600">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                        {headers.map((h) => (
                            <th key={h.k} className="p-2 text-left">
                                <button type="button" className="font-semibold" onClick={() => onSort(h.k)}>
                                    {h.label}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const { card, res } = row;
                        const inc = res.incrementalOngoing;
                        const pos = inc >= 0;
                        return (
                            <React.Fragment key={card.id}>
                                <tr
                                    className="border-t border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => onToggleRow(card.id)}
                                >
                                    <td className="p-2 font-medium text-slate-900 dark:text-white">
                                        {pos ? '▲ ' : '▼ '}
                                        {card.name}
                                    </td>
                                    <td className="p-2">{formatCurrency(res.annualFee)}</td>
                                    <td className="p-2">{formatCurrency(res.rewards)}</td>
                                    <td className="p-2">{formatCurrency(res.credits)}</td>
                                    <td className="p-2">{formatCurrency(res.softBenefits)}</td>
                                    <td className="p-2">{formatCurrency(res.ongoingNet)}</td>
                                    <td className="p-2">{formatCurrency(res.incrementalFirstYear)}</td>
                                    <td className="p-2">
                                        {formatCurrency(inc)} {pos ? '(gain)' : '(loss)'}
                                    </td>
                                </tr>
                                {expandedId === card.id && (
                                    <tr>
                                        <td colSpan="8" className="p-3 bg-slate-50 dark:bg-slate-900/50 text-xs">
                                            <div className="space-y-1">
                                                <div>Baseline: {formatCurrency(res.baselineValue)}</div>
                                                <div>First-year bonus value: {formatCurrency(res.firstYearBonus)}</div>
                                                <div className="text-slate-500">
                                                    Assumes uncapped category earn until TODO(cardfit-caps) / rotating categories
                                                    TODO(cardfit-rotating).
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
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
            if (raw) {
                return normalizeCardfitProfile(JSON.parse(raw));
            }
        } catch (e) {
            console.warn('CardFit: bad profile, using defaults', e);
        }
        return buildFreshCardfitProfile();
    });
    const [sOpen, setSOpen] = useState({ spend: true, reward: false, benefits: false, base: false });
    const [sortKey, setSortKey] = useState('inc');
    const [expanded, setExpanded] = useState(null);
    const [filterIssuer, setFilterIssuer] = useState('');

    const uiFlow = profile.uiFlow || CARDFIT_UI_FLOW.RESULTS;

    useEffect(() => {
        try {
            localStorage.setItem(CARDFIT_PROFILE_KEY, JSON.stringify(profile));
        } catch (e) {
            console.warn('CardFit: could not save', e);
        }
    }, [profile]);

    const catalogIds = useMemo(() => Object.keys(catalog), [catalog]);
    const catalogList = useMemo(
        () => Object.values(catalog).filter((c) => (filterIssuer ? c.issuer === filterIssuer : true)),
        [catalog, filterIssuer]
    );
    const issuers = useMemo(() => [...new Set(Object.values(catalog).map((c) => c.issuer))], [catalog]);

    const baseSelected = useMemo(() => {
        if (profile.selectedCards && profile.selectedCards.length) {
            return profile.selectedCards;
        }
        return catalogIds;
    }, [profile.selectedCards, catalogIds]);

    const selected = useMemo(() => {
        let s = baseSelected;
        if (profile.onlyOwned) {
            const owned = new Set((userCards || []).map((c) => c.id));
            s = s.filter((id) => owned.has(id));
        }
        return s;
    }, [baseSelected, profile.onlyOwned, userCards]);

    const neededCurrencies = useMemo(() => {
        const s = new Set();
        selected.forEach((id) => {
            const c = catalog[id];
            if (c && c.rewardCurrency) {
                s.add(c.rewardCurrency);
            }
        });
        return Array.from(s);
    }, [selected, catalog]);

    const rows = useMemo(() => {
        const r = selected
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
            return r.sort((a, b) => a.card.name.localeCompare(b.card.name));
        }
        const kk = keyMap[sortKey] || 'incrementalOngoing';
        return r.sort((a, b) => (b.res[kk] || 0) - (a.res[kk] || 0));
    }, [selected, profile, catalog, sortKey]);

    const comparePanelProps = {
        profile,
        setProfile,
        userCards,
        catalogIds,
        catalogList,
        issuers,
        selected,
        rows,
        sortKey,
        setSortKey,
        expanded,
        setExpanded,
        filterIssuer,
        setFilterIssuer
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <header className="bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CardFit</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Net value from your numbers</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {uiFlow === CARDFIT_UI_FLOW.ADVANCED && (
                            <button
                                type="button"
                                onClick={() => setProfile((p) => ({ ...p, uiFlow: CARDFIT_UI_FLOW.RESULTS }))}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-500 rounded-md text-sm"
                            >
                                Back to results
                            </button>
                        )}
                        {typeof onBackToTracker === 'function' && (
                            <button
                                type="button"
                                onClick={onBackToTracker}
                                className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md text-sm"
                            >
                                Back to tracker
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {uiFlow === CARDFIT_UI_FLOW.QUICK_START && (
                <CardFitQuickStartStep
                    profile={profile}
                    userCards={userCards}
                    onChangeProfile={setProfile}
                    onShowRecommendations={() => setProfile((p) => ({ ...p, uiFlow: CARDFIT_UI_FLOW.RESULTS }))}
                />
            )}

            {uiFlow === CARDFIT_UI_FLOW.RESULTS && (
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your comparison</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                                Ranked by incremental value vs. your baseline. Open a row for a short breakdown. Change spend,
                                point values, or benefits any time in Refine.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setProfile((p) => ({ ...p, uiFlow: CARDFIT_UI_FLOW.QUICK_START }))}
                                className="px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:underline"
                            >
                                Quick setup
                            </button>
                            <button
                                type="button"
                                onClick={() => setProfile((p) => ({ ...p, uiFlow: CARDFIT_UI_FLOW.ADVANCED }))}
                                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
                            >
                                Refine assumptions
                            </button>
                        </div>
                    </div>
                    <CardFitComparePanel {...comparePanelProps} />
                </div>
            )}

            {uiFlow === CARDFIT_UI_FLOW.ADVANCED && (
                <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Adjust as much or as little as you like. Results update in the comparison on the right.
                        </p>
                        <CardFitSection
                            title="Spending (by category)"
                            open={sOpen.spend}
                            onToggle={() => setSOpen((o) => ({ ...o, spend: !o.spend }))}
                        >
                            <CardFitSpendEditor profile={profile} onChange={setProfile} />
                        </CardFitSection>
                        <CardFitSection
                            title="Point values ($/point, e.g. 0.017 = 1.7¢)"
                            open={sOpen.reward}
                            onToggle={() => setSOpen((o) => ({ ...o, reward: !o.reward }))}
                        >
                            <CardFitRewardEditor profile={profile} neededCurrencyIds={neededCurrencies} onChange={setProfile} />
                        </CardFitSection>
                        <CardFitSection
                            title="Benefits &amp; credits (per card)"
                            open={sOpen.benefits}
                            onToggle={() => setSOpen((o) => ({ ...o, benefits: !o.benefits }))}
                        >
                            {selected.map((id) => (
                                <CardFitBenefitEditor key={id} card={catalog[id]} profile={profile} onChange={setProfile} />
                            ))}
                        </CardFitSection>
                        <CardFitSection
                            title="Baseline (what you compare against)"
                            open={sOpen.base}
                            onToggle={() => setSOpen((o) => ({ ...o, base: !o.base }))}
                        >
                            <CardFitBaselineEditor profile={profile} catalogIds={catalogIds} onChange={setProfile} />
                        </CardFitSection>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Live comparison</h2>
                        <p className="text-xs text-slate-500 mb-3">Same ranking as the results step; edits apply immediately.</p>
                        <CardFitComparePanel {...comparePanelProps} />
                    </div>
                </div>
            )}
        </div>
    );
}
