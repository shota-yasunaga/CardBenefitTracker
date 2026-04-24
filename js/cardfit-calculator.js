/**
 * CardFit valuation engine (pure functions).
 * Depends on globals from cardfit-data.js, js/data.js (BENEFIT_*), js/utils.js (formatCurrency optional).
 */

function cardfitPeriodsPerYear(frequency) {
    switch (frequency) {
        case BENEFIT_FREQUENCY.MONTHLY:
            return 12;
        case BENEFIT_FREQUENCY.SEMI_ANNUAL:
            return 2;
        case BENEFIT_FREQUENCY.ANNUAL:
            return 1;
        case BENEFIT_FREQUENCY.FOUR_YEAR:
            return 0.25;
        case BENEFIT_FREQUENCY.ONE_TIME:
            return 1;
        default:
            return 1;
    }
}

function cardfitIsCashbackCurrency(currencyId) {
    const c = REWARD_CURRENCIES.find((x) => x.id === currencyId);
    return !!(c && c.isCashback);
}

function cardfitGetCpp(profile, currencyId) {
    const v = profile.currencyValues && profile.currencyValues[currencyId];
    if (typeof v === 'number' && !Number.isNaN(v)) {
        return v;
    }
    const d = REWARD_CURRENCIES.find((x) => x.id === currencyId);
    return d ? d.defaultCpp : 0.01;
}

function cardfitAnnualSpend(profile) {
    const mode = profile.spendMode === 'monthly' ? 'monthly' : 'annual';
    const mult = mode === 'monthly' ? 12 : 1;
    let total = 0;
    Object.keys(profile.spend || {}).forEach((k) => {
        const n = Number(profile.spend[k]);
        if (!Number.isNaN(n) && n >= 0) {
            total += n * mult;
        }
    });
    return total;
}

function cardfitSpendAnnualForCategory(profile, categoryId) {
    const mode = profile.spendMode === 'monthly' ? 'monthly' : 'annual';
    const mult = mode === 'monthly' ? 12 : 1;
    const n = Number((profile.spend || {})[categoryId]);
    if (Number.isNaN(n) || n < 0) {
        return 0;
    }
    return n * mult;
}

function cardfitGetMultiplierForCategory(card, categoryId) {
    const rates = card.earnRates || [];
    const match = rates.find((r) => r.category === categoryId);
    if (match) {
        return match.multiplier;
    }
    const gen = rates.find((r) => r.category === 'general');
    return gen ? gen.multiplier : 1;
}

function cardfitDefaultUtilizationForBenefit(benefit) {
    if (benefit.type === BENEFIT_TYPE.FEATURE) {
        if (benefit.category === BENEFIT_CATEGORY.LOUNGE) {
            return 0.5;
        }
        if (benefit.frequency === BENEFIT_FREQUENCY.FOUR_YEAR) {
            return 0.5;
        }
        return 0.25;
    }
    return 1.0;
}

/**
 * @returns {number} annual reward value in dollars
 */
function cardfitCalculateRewardsValue(card, profile) {
    // TODO(cardfit-caps): add per-category and annual caps; currently uncapped
    // TODO(cardfit-rotating): model rotating 5% categories
    const rc = card.rewardCurrency || 'chase_ur';
    const cpp = cardfitGetCpp(profile, rc);
    const isCb = cardfitIsCashbackCurrency(rc);
    let sum = 0;
    SPEND_CATEGORIES.forEach((c) => {
        const mult = cardfitGetMultiplierForCategory(card, c.id);
        const spendA = cardfitSpendAnnualForCategory(profile, c.id);
        if (spendA <= 0) {
            return;
        }
        if (isCb) {
            sum += spendA * mult;
        } else {
            sum += spendA * mult * cpp;
        }
    });
    return sum;
}

function cardfitAnnualCreditFace(benefit) {
    if (benefit.type === BENEFIT_TYPE.SUBSCRIPTION) {
        return (Number(benefit.value) || 0) * cardfitPeriodsPerYear(benefit.frequency);
    }
    if (benefit.type === BENEFIT_TYPE.CREDIT || benefit.type === BENEFIT_TYPE.ONE_TIME) {
        if (benefit.frequency === BENEFIT_FREQUENCY.MONTHLY) {
            return (Number(benefit.value) || 0) * 12;
        }
        if (benefit.frequency === BENEFIT_FREQUENCY.SEMI_ANNUAL) {
            return (Number(benefit.value) || 0) * 2;
        }
        return Number(benefit.value) || 0;
    }
    return 0;
}

function cardfitCalculateCreditsValue(card, profile) {
    let total = 0;
    (card.benefits || []).forEach((b) => {
        if (b.type !== BENEFIT_TYPE.CREDIT && b.type !== BENEFIT_TYPE.ONE_TIME && b.type !== BENEFIT_TYPE.SUBSCRIPTION) {
            return;
        }
        const face = cardfitAnnualCreditFace(b);
        const cfg = (profile.benefitValues && profile.benefitValues[b.id]) || {};
        const defU = cardfitDefaultUtilizationForBenefit(b);
        const u = typeof cfg.utilization === 'number' ? cfg.utilization : defU;
        if (typeof cfg.overrideValue === 'number' && !Number.isNaN(cfg.overrideValue)) {
            total += cfg.overrideValue;
        } else {
            total += face * u;
        }
    });
    return total;
}

function cardfitCalculateSoftBenefitsValue(card, profile) {
    let total = 0;
    (card.benefits || []).forEach((b) => {
        if (b.type !== BENEFIT_TYPE.FEATURE) {
            return;
        }
        const cfg = (profile.benefitValues && profile.benefitValues[b.id]) || {};
        const defU = cardfitDefaultUtilizationForBenefit(b);
        const u = typeof cfg.utilization === 'number' ? cfg.utilization : defU;
        if (typeof cfg.overrideValue === 'number' && !Number.isNaN(cfg.overrideValue)) {
            total += cfg.overrideValue;
        } else {
            const base = b.defaultValue != null ? Number(b.defaultValue) : Number(b.value) || 0;
            total += base * u;
        }
    });
    return total;
}

function cardfitCalculateSignupBonusPointsValue(card, profile) {
    const sb = card.signupBonus;
    if (!sb || !sb.points) {
        return 0;
    }
    const p = profile.signupBonusProbability;
    const prob = typeof p === 'number' ? p : 1;
    const rc = card.rewardCurrency || 'chase_ur';
    const cpp = cardfitGetCpp(profile, rc);
    if (cardfitIsCashbackCurrency(rc)) {
        return (Number(sb.points) || 0) * prob;
    }
    return (Number(sb.points) || 0) * cpp * prob;
}

function cardfitCalculateOngoingValueRaw(card, profile) {
    const rewards = cardfitCalculateRewardsValue(card, profile);
    const credits = cardfitCalculateCreditsValue(card, profile);
    const soft = cardfitCalculateSoftBenefitsValue(card, profile);
    const fee = Number(card.annualFee) || 0;
    return rewards + credits + soft - fee;
}

function cardfitCalculateBaselineValue(profile, catalog) {
    const b = profile.baseline || { type: 'flat_rate', flatRate: 0.02 };
    if (b.type === 'flat_rate') {
        const r = typeof b.flatRate === 'number' ? b.flatRate : 0.02;
        return cardfitAnnualSpend(profile) * r;
    }
    if (b.type === 'per_category' && b.rates) {
        let s = 0;
        SPEND_CATEGORIES.forEach((c) => {
            const sp = cardfitSpendAnnualForCategory(profile, c.id);
            const rate = Number(b.rates[c.id]);
            if (!Number.isNaN(rate) && sp > 0) {
                s += sp * rate;
            }
        });
        return s;
    }
    if (b.type === 'card' && b.cardId) {
        const base = catalog && catalog[b.cardId];
        if (!base) {
            console.warn('CardFit: baseline card not in catalog, using 2% flat', b.cardId);
            return cardfitAnnualSpend(profile) * 0.02;
        }
        return cardfitCalculateOngoingValueRaw(base, profile);
    }
    return cardfitAnnualSpend(profile) * 0.02;
}

function cardfitCalculateCardNetValue(card, profile, catalog) {
    const rewards = cardfitCalculateRewardsValue(card, profile);
    const credits = cardfitCalculateCreditsValue(card, profile);
    const soft = cardfitCalculateSoftBenefitsValue(card, profile);
    const fee = Number(card.annualFee) || 0;
    const ongoingRaw = rewards + credits + soft;
    const ongoingNet = ongoingRaw - fee;
    const sb = cardfitCalculateSignupBonusPointsValue(card, profile);
    const baselineValue = cardfitCalculateBaselineValue(profile, catalog);
    const b = profile.baseline || {};
    const selfBase = b.type === 'card' && b.cardId === card.id;
    const incrementalOngoing = selfBase ? 0 : ongoingNet - baselineValue;
    const incrementalFirstYear = selfBase ? 0 : ongoingNet + sb - baselineValue;
    return {
        cardId: card.id,
        rewards,
        credits,
        softBenefits: soft,
        annualFee: fee,
        ongoingNet,
        firstYearBonus: sb,
        firstYearNet: ongoingNet + sb,
        baselineValue,
        incrementalOngoing,
        incrementalFirstYear
    };
}

function cardfitRankResults(rows, sortKey) {
    const k = sortKey || 'incrementalOngoing';
    return rows.slice().sort((a, b) => (b[k] || 0) - (a[k] || 0));
}

function cardfitCatalogCardsArray() {
    return Object.values(availableCards || {});
}

// Test / integration hooks (global script scope)
window.calculateCardNetValue = cardfitCalculateCardNetValue;
