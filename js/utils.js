const HISTORY_STORAGE_KEY = 'benefitUsageHistory';
const HISTORY_MAX_ENTRIES = 3000;

const toDate = (dateLike = new Date()) => {
    const parsed = dateLike instanceof Date ? new Date(dateLike) : new Date(dateLike);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getSemiAnnualHalfFromBenefit = (benefit = {}) => {
    const normalized = String(benefit.name || '').replace(/–/g, '-').toLowerCase();
    if (normalized.includes('jan-jun') || normalized.includes('(h1)')) {
        return 'H1';
    }
    if (normalized.includes('jul-dec') || normalized.includes('(h2)')) {
        return 'H2';
    }
    return null;
};

const getPeriodKey = (frequency, referenceDate = new Date(), benefit = {}) => {
    const date = toDate(referenceDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = String(month).padStart(2, '0');

    switch (frequency) {
        case BENEFIT_FREQUENCY.MONTHLY:
            return `${year}-${monthKey}`;
        case BENEFIT_FREQUENCY.SEMI_ANNUAL: {
            const forcedHalf = getSemiAnnualHalfFromBenefit(benefit);
            const derivedHalf = month <= 6 ? 'H1' : 'H2';
            return `${year}-${forcedHalf || derivedHalf}`;
        }
        case BENEFIT_FREQUENCY.ANNUAL:
        case BENEFIT_FREQUENCY.ONE_TIME:
            return `${year}`;
        case BENEFIT_FREQUENCY.FOUR_YEAR: {
            const periodStart = year - (year % 4);
            return `${periodStart}-${periodStart + 3}`;
        }
        default:
            return `${year}`;
    }
};

const formatPeriodLabel = (periodKey, frequency) => {
    if (!periodKey) return 'Unknown period';
    if (frequency === BENEFIT_FREQUENCY.SEMI_ANNUAL) {
        return periodKey.replace('-', ' ');
    }
    return periodKey;
};

// Helper function to get current benefit amount based on date
const getCurrentBenefitAmount = (benefit, frequency, referenceDate = new Date()) => {
    const date = toDate(referenceDate);
    const currentMonth = date.getMonth();
    
    switch (frequency) {
        case BENEFIT_FREQUENCY.SEMI_ANNUAL: {
            const benefitHalf = getSemiAnnualHalfFromBenefit(benefit);
            const currentHalf = currentMonth < 6 ? 'H1' : 'H2';
            if (benefitHalf && benefitHalf !== currentHalf) {
                return 0;
            }
            return benefit.value;
        }
        default:
            return benefit.value;
    }
};

// Helper functions
const getExpirationDate = (frequency, referenceDate = new Date()) => {
    const date = toDate(referenceDate);
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    
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
        case BENEFIT_FREQUENCY.ONE_TIME:
            return new Date(currentYear, 11, 31);
        case BENEFIT_FREQUENCY.FOUR_YEAR: {
            const periodKey = getPeriodKey(BENEFIT_FREQUENCY.FOUR_YEAR, date);
            const endYear = Number(periodKey.split('-')[1]);
            return new Date(endYear, 11, 31);
        }
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