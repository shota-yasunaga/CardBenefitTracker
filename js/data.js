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