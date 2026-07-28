/** CardFit static config + default profile. Loaded before cardfit-calculator.js */

const CARDFIT_PROFILE_KEY = 'cardfit_profile';
const CARDFIT_SCHEMA_VERSION = 2;

/**
 * CardFit UI flow (stored on profile, persisted in localStorage)
 * - quick_start: modal steps (spend → point value → benefits), all skippable; then results
 * - results: ranked comparison, CTA to advanced tuning
 * - advanced_tuning: full spend / cpp / benefits / baseline editors
 */
const CARDFIT_UI_FLOW = {
    QUICK_START: 'quick_start',
    RESULTS: 'results',
    ADVANCED: 'advanced_tuning'
};

const CARDFIT_VALID_UI_FLOWS = ['quick_start', 'results', 'advanced_tuning'];

function cardfitNormalizeUiFlow(v) {
    if (v && CARDFIT_VALID_UI_FLOWS.indexOf(v) >= 0) {
        return v;
    }
    return CARDFIT_UI_FLOW.RESULTS;
}

const SPEND_CATEGORIES = [
    { id: 'dining', label: 'Dining' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'gas', label: 'Gas' },
    { id: 'flights', label: 'Flights' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'travel', label: 'General travel' },
    { id: 'transit', label: 'Transit' },
    { id: 'online_shopping', label: 'Online shopping' },
    { id: 'drugstores', label: 'Drugstores' },
    { id: 'streaming', label: 'Streaming' },
    { id: 'mobile_phone', label: 'Mobile phone' },
    { id: 'rent', label: 'Rent' },
    { id: 'general', label: 'Everything else' }
];

const REWARD_CURRENCIES = [
    { id: 'cashback', label: 'Cashback (USD)', defaultCpp: 1.0, isCashback: true },
    { id: 'chase_ur', label: 'Chase Ultimate Rewards', defaultCpp: 0.017, isCashback: false },
    { id: 'amex_mr', label: 'Amex Membership Rewards', defaultCpp: 0.018, isCashback: false },
    { id: 'citi_typ', label: 'Citi ThankYou Points', defaultCpp: 0.016, isCashback: false },
    { id: 'capital_one_miles', label: 'Capital One Miles', defaultCpp: 0.01, isCashback: false },
    { id: 'hilton', label: 'Hilton Honors', defaultCpp: 0.005, isCashback: false },
    { id: 'marriott', label: 'Marriott Bonvoy', defaultCpp: 0.008, isCashback: false },
    { id: 'hyatt', label: 'World of Hyatt', defaultCpp: 0.017, isCashback: false },
    { id: 'ihg', label: 'IHG One Rewards', defaultCpp: 0.005, isCashback: false },
    { id: 'delta', label: 'Delta SkyMiles', defaultCpp: 0.012, isCashback: false },
    { id: 'united_miles', label: 'United MileagePlus', defaultCpp: 0.013, isCashback: false }
];

const SPEND_PRESETS = {
    low: {
        dining: 1200,
        groceries: 2400,
        gas: 600,
        flights: 0,
        hotels: 0,
        travel: 500,
        transit: 300,
        online_shopping: 800,
        drugstores: 200,
        streaming: 200,
        mobile_phone: 100,
        rent: 0,
        general: 3000
    },
    medium: {
        dining: 3600,
        groceries: 6000,
        gas: 1800,
        flights: 2000,
        hotels: 1500,
        travel: 2000,
        transit: 800,
        online_shopping: 2400,
        drugstores: 600,
        streaming: 300,
        mobile_phone: 1200,
        rent: 0,
        general: 8000
    },
    high: {
        dining: 8000,
        groceries: 10000,
        gas: 3000,
        flights: 8000,
        hotels: 5000,
        travel: 6000,
        transit: 2000,
        online_shopping: 6000,
        drugstores: 1200,
        streaming: 500,
        mobile_phone: 1200,
        rent: 24000,
        general: 20000
    }
};

/** Preset maps are annual dollars; profile.spend uses the same units as spendMode (annual or monthly). */

function cardfitRoundSpendAmount(n) {
    return Math.round(Number(n) * 100) / 100;
}

/** Apply Low/Medium/High: annual → copy totals; monthly → annual ÷ 12 per category. */
function cardfitPresetSpendForMode(presetKey, spendMode) {
    const src = SPEND_PRESETS[presetKey];
    if (!src) {
        return {};
    }
    const monthly = spendMode === 'monthly';
    const out = {};
    SPEND_CATEGORIES.forEach(({ id }) => {
        const v = Number(src[id]) || 0;
        out[id] = monthly ? cardfitRoundSpendAmount(v / 12) : v;
    });
    return out;
}

/** When user switches Annual ↔ Monthly, convert every category so totals stay equivalent. */
function cardfitConvertSpendForModeChange(spend, fromMode, toMode) {
    if (fromMode === toMode) {
        return spend ? { ...spend } : {};
    }
    if (!spend) {
        return {};
    }
    const mult =
        fromMode === 'monthly' && toMode === 'annual'
            ? 12
            : fromMode === 'annual' && toMode === 'monthly'
              ? 1 / 12
              : 1;
    const out = {};
    SPEND_CATEGORIES.forEach(({ id }) => {
        const n = Number(spend[id]) || 0;
        out[id] = cardfitRoundSpendAmount(n * mult);
    });
    return out;
}

function buildDefaultCurrencyValues() {
    const o = {};
    REWARD_CURRENCIES.forEach((c) => {
        o[c.id] = c.defaultCpp;
    });
    return o;
}

const DEFAULT_CARDFIT_PROFILE = {
    schemaVersion: CARDFIT_SCHEMA_VERSION,
    uiFlow: CARDFIT_UI_FLOW.QUICK_START,
    spend: {},
    spendMode: 'annual',
    spendPreset: 'custom',
    currencyValues: buildDefaultCurrencyValues(),
    benefitValues: {},
    baseline: { type: 'flat_rate', flatRate: 0.02, cardId: null, rates: {} },
    selectedCards: [],
    onlyOwned: false,
    signupBonusProbability: 1
};

/** Sensible spend + preset so calculations always have data without user input. */
function cardfitDefaultSensibleSpend() {
    return { spend: { ...SPEND_PRESETS.medium }, spendPreset: 'medium', spendMode: 'annual' };
}

function buildFreshCardfitProfile() {
    return {
        ...DEFAULT_CARDFIT_PROFILE,
        ...cardfitDefaultSensibleSpend()
    };
}

function normalizeCardfitProfile(raw) {
    if (!raw || typeof raw !== 'object') {
        return buildFreshCardfitProfile();
    }
    if (raw.schemaVersion === 1) {
        return normalizeCardfitProfile({
            ...raw,
            schemaVersion: CARDFIT_SCHEMA_VERSION,
            uiFlow: CARDFIT_UI_FLOW.RESULTS
        });
    }
    if (raw.schemaVersion !== CARDFIT_SCHEMA_VERSION) {
        return buildFreshCardfitProfile();
    }
    const spend = { ...DEFAULT_CARDFIT_PROFILE.spend, ...(raw.spend || {}) };
    return {
        ...DEFAULT_CARDFIT_PROFILE,
        ...raw,
        spend,
        uiFlow: cardfitNormalizeUiFlow(raw.uiFlow),
        currencyValues: { ...buildDefaultCurrencyValues(), ...(raw.currencyValues || {}) },
        benefitValues: { ...(raw.benefitValues || {}) },
        baseline: {
            ...DEFAULT_CARDFIT_PROFILE.baseline,
            ...(raw.baseline || {})
        }
    };
}
