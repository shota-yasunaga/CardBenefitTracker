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