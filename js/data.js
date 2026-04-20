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
    ONE_TIME: 'one_time',
    INSURANCE: 'insurance'
};

const BENEFIT_CATEGORY = {
    TRAVEL: 'travel',
    DINING: 'dining',
    ENTERTAINMENT: 'entertainment',
    SHOPPING: 'shopping',
    RIDESHARE: 'rideshare',
    LOUNGE: 'lounge',
    INSURANCE: 'insurance',
    CUSTOM: 'custom'
};

// Helper functions for custom cards
function generateCustomCardId() {
    return `custom-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateCustomBenefitId() {
    return `custom-benefit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createCustomCard(cardData) {
    return {
        id: generateCustomCardId(),
        name: cardData.name || 'Custom Card',
        issuer: cardData.issuer || 'Custom',
        annualFee: cardData.annualFee || 0,
        color: cardData.color || 'card-gradient-custom',
        isCustom: true,
        benefits: cardData.benefits || []
    };
}

function createCustomBenefit(benefitData) {
    return {
        id: generateCustomBenefitId(),
        name: benefitData.name || 'Custom Benefit',
        category: benefitData.category || BENEFIT_CATEGORY.CUSTOM,
        frequency: benefitData.frequency || BENEFIT_FREQUENCY.ANNUAL,
        type: benefitData.type || BENEFIT_TYPE.CREDIT,
        value: benefitData.value || 0,
        description: benefitData.description || '',
        used: false,
        subscribed: false,
        activated: benefitData.type === BENEFIT_TYPE.FEATURE
    };
}

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
                name: '$300 Annual Travel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 in statement credits for travel purchases each account anniversary year (automatic; qualifying purchases do not earn points).',
                used: false
            },
            {
                id: 'csr-edit-credit',
                name: '$500 The Edit Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 500,
                description: 'Calendar-year credit (Jan 1–Dec 31): up to $250 statement credit per prepaid The Edit booking (2-night minimum), up to $500/year.',
                used: false
            },
            {
                id: 'csr-select-hotels-credit',
                name: '$250 Select Chase Travel Hotels',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Up to $250 in statement credits through 12/31/2026 on eligible prepaid Chase Travel hotel bookings (2-night minimum; see issuer list).',
                used: false
            },
            {
                id: 'csr-opentable-janjun',
                name: '$150 Dining Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credits Jan–Jun each year when dining at Sapphire Exclusive Tables restaurants on OpenTable.',
                used: false
            },
            {
                id: 'csr-opentable-juldec',
                name: '$150 Dining Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credits Jul–Dec each year when dining at Sapphire Exclusive Tables restaurants on OpenTable.',
                used: false
            },
            {
                id: 'csr-apple-subs',
                name: 'Apple TV+ & Apple Music',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 288,
                description: 'Complimentary Apple TV+ and Apple Music subscriptions through 6/22/2027 (issuer states $288 annual value).',
                subscribed: false
            },
            {
                id: 'csr-dashpass-12mo',
                name: 'DashPass (12 Months)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 120,
                description: 'Complimentary DashPass for 12 months when activated by 12/31/2027 (issuer states $120 value).',
                subscribed: false
            },
            {
                id: 'csr-stubhub-janjun',
                name: '$150 StubHub / viagogo (Jan–Jun)',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credits Jan–Jun each year for StubHub/viagogo purchases through 12/31/2027 (activation required).',
                used: false
            },
            {
                id: 'csr-stubhub-juldec',
                name: '$150 StubHub / viagogo (Jul–Dec)',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credits Jul–Dec each year for StubHub/viagogo purchases through 12/31/2027 (activation required).',
                used: false
            },
            {
                id: 'csr-lyft-monthly',
                name: '$10 Lyft In-App Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Up to $10 monthly Lyft in-app credits through 9/30/2027.',
                used: false
            },
            {
                id: 'csr-peloton-monthly',
                name: '$10 Peloton Credit',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Up to $10/month in statement credits on eligible Peloton memberships through 12/31/2027 (activation required).',
                used: false
            },
            {
                id: 'csr-global-entry',
                name: '$120 Global Entry / TSA PreCheck / NEXUS',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'One statement credit up to $120 every 4 years for Global Entry, TSA PreCheck, or NEXUS application fee.',
                used: false
            },
            {
                id: 'csr-lounge-network',
                name: 'Sapphire Reserve Lounge Network',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 850,
                description: 'Issuer-valued $850+ annual value: access to Chase Sapphire Lounges by The Club and Priority Pass lounges (with up to two guests).',
                activated: true
            },
            {
                id: 'csr-ihg-platinum-status',
                name: 'IHG Platinum Elite Status',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary IHG One Rewards Platinum Elite Status through 12/31/2027 (per issuer terms).',
                activated: true
            }
        ]
    },

    'amex-platinum': {
        id: 'amex-platinum',
        name: 'Amex Platinum',
        issuer: 'American Express',
        annualFee: 895,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'plat-airline-fee',
                name: '$200 Airline Fee Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Select one qualifying airline; receive up to $200 in statement credits per calendar year for eligible incidental fees.',
                used: false
            },
            {
                id: 'plat-hotel-janjun',
                name: '$300 Hotel Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 semi-annually (Jan–Jun) in statement credits on prepaid Fine Hotels + Resorts / The Hotel Collection bookings through Amex Travel.',
                used: false
            },
            {
                id: 'plat-hotel-juldec',
                name: '$300 Hotel Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 semi-annually (Jul–Dec) in statement credits on prepaid Fine Hotels + Resorts / The Hotel Collection bookings through Amex Travel.',
                used: false
            },
            {
                id: 'plat-resy',
                name: '$400 Resy Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 400,
                description: 'Up to $400/year; issuer describes up to $100 per quarter for eligible purchases at U.S. Resy restaurants and other eligible Resy purchases (enrollment required).',
                used: false
            },
            {
                id: 'plat-digital-entertainment',
                name: '$25 Digital Entertainment Credit',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 25,
                description: 'Up to $25/month (up to $300/year) in statement credits for eligible subscriptions purchased directly from select providers.',
                used: false
            },
            {
                id: 'plat-uber-cash',
                name: '$15 Uber Cash',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 15,
                description: 'Uber Cash: $15/month plus a $20 bonus in December (up to $200/year total), delivered via the Uber app experience when an Amex card is selected.',
                used: false
            },
            {
                id: 'plat-uber-one',
                name: '$120 Uber One Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 in statement credits each calendar year for an Uber One membership (enrollment/terms apply).',
                used: false
            },
            {
                id: 'plat-clear',
                name: '$209 CLEAR+ Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 in statement credits per calendar year for CLEAR+ membership (subject to auto-renewal).',
                used: false
            },
            {
                id: 'plat-walmart-plus',
                name: 'Walmart+ Monthly Membership Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 155,
                description: 'Monthly Walmart+ membership credit: up to $12.95 (+ applicable taxes) each month when paying for Walmart+ monthly membership (subject to auto-renewal).',
                subscribed: false
            },
            {
                id: 'plat-saks-janjun',
                name: '$50 Saks (Jan–Jun)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 statement credit Jan–Jun at Saks Fifth Avenue (enrollment required; terms apply).',
                used: false
            },
            {
                id: 'plat-saks-juldec',
                name: '$50 Saks (Jul–Dec)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 statement credit Jul–Dec at Saks Fifth Avenue (enrollment required; terms apply).',
                used: false
            },
            {
                id: 'plat-lululemon',
                name: '$300 lululemon Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300/year; issuer describes up to $75 per quarter for eligible U.S. lululemon purchases (enrollment required).',
                used: false
            },
            {
                id: 'plat-oura',
                name: '$200 Oura Ring Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 in statement credits each calendar year for eligible Oura Ring purchases at Ouraring.com (enrollment required).',
                used: false
            },
            {
                id: 'plat-equinox',
                name: '$300 Equinox Credit',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 in statement credits each calendar year on eligible Equinox+ subscription or Equinox club membership fees (enrollment required).',
                used: false
            },
            {
                id: 'plat-global-entry',
                name: '$120 Global Entry / TSA PreCheck',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Statement credit for Global Entry ($120) every 4 years or TSA PreCheck (up to $85, every ~4.5 years via official enrollment provider) when application fee is charged to the card.',
                used: false
            },
            {
                id: 'plat-global-lounge-collection',
                name: 'Global Lounge Collection',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 850,
                description: 'Issuer-valued at “over $850” annual value; access includes Centurion Lounges, Priority Pass Select (enrollment required), and other partner lounges (Delta visits subject to limits).',
                activated: true
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
                id: 'gold-dining-credit',
                name: '$10 Dining Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Up to $10/month in statement credits at participating dining partners (enrollment required).',
                used: false
            },
            {
                id: 'gold-uber-cash',
                name: '$10 Uber Cash',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: '$10/month Uber Cash for U.S. rides and Uber Eats when an Amex Card is selected for the transaction.',
                used: false
            },
            {
                id: 'gold-dunkin',
                name: '$7 Dunkin’ Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 7,
                description: 'Up to $7/month in statement credits at U.S. Dunkin’ locations (enrollment required).',
                used: false
            },
            {
                id: 'gold-resy-janjun',
                name: '$50 Resy Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 semi-annually (Jan–Jun) when dining at U.S. Resy restaurants or making other eligible Resy purchases (enrollment required).',
                used: false
            },
            {
                id: 'gold-resy-juldec',
                name: '$50 Resy Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 semi-annually (Jul–Dec) when dining at U.S. Resy restaurants or making other eligible Resy purchases (enrollment required).',
                used: false
            }
        ]
    },

    'capital-one-venture-x': {
        id: 'capital-one-venture-x',
        name: 'Capital One Venture X',
        issuer: 'Capital One',
        annualFee: 395,
        color: 'card-gradient-custom',
        benefits: [
            {
                id: 'vx-travel-credit',
                name: '$300 Capital One Travel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: '$300 annual credit to use through the Capital One Travel portal.',
                used: false
            },
            {
                id: 'vx-anniversary-miles',
                name: '10,000-Mile Anniversary Bonus',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 100,
                description: '10,000 bonus miles each year starting on your first anniversary (value field estimates ~$100 assuming ~1¢/mile floor when redeemed as travel offset; redemption values vary).',
                used: false
            },
            {
                id: 'vx-global-entry',
                name: '$120 Global Entry / TSA PreCheck Reimbursement',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to a $120 statement credit for TSA PreCheck or Global Entry application fee when paid with the card.',
                used: false
            },
            {
                id: 'vx-prior-subscription',
                name: 'PRIOR Subscription',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 149,
                description: 'Complimentary PRIOR subscription (issuer-disclosed $149 value).',
                subscribed: false
            },
            {
                id: 'vx-lounge-access',
                name: 'Capital One Lounges + Priority Pass',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 469,
                description: 'Lounge access includes Capital One Lounges plus Priority Pass lounge access (enrollment required). Value uses Priority Pass Prestige list price as market proxy.',
                activated: true
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
                description: 'Earn up to $50 in statement credits each account anniversary year for hotel stays purchased through Chase Travel.',
                used: false
            },
            {
                id: 'csp-dashpass-12mo',
                name: 'DashPass (At Least 12 Months)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 120,
                description: 'Complimentary DashPass for at least 12 months; issuer describes “up to $120 in DoorDash value” (activation required).',
                subscribed: false
            },
            {
                id: 'csp-doordash-nonrestaurant',
                name: '$10 DoorDash Non-Restaurant Discount',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Up to $10 each calendar month in non-restaurant DoorDash order discounts through 12/31/2027.',
                used: false
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
                id: 'uquest-rhr-credit',
                name: '$150 Renowned Hotels & Resorts Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 back each account anniversary year on hotel accommodations when you prepay through Renowned Hotels and Resorts.',
                used: false
            },
            {
                id: 'uquest-rideshare',
                name: '$8 Rideshare Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 8,
                description: 'Up to $100/year total: up to $8 statement credit each month Jan–Nov; up to $12 in December (enrollment required; calendar-year).',
                used: false
            },
            {
                id: 'uquest-avis-budget',
                name: '$80 United TravelBank (Avis/Budget)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 80,
                description: '$40 United TravelBank cash on your 1st and 2nd Avis/Budget rental booked via cars.united.com and paid with the card (account anniversary year; total $80).',
                used: false
            },
            {
                id: 'uquest-instacart',
                name: '$15 Instacart Credits',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 15,
                description: 'Monthly Instacart credits: $10 + $5 per month (calendar-month use; terms apply).',
                used: false
            },
            {
                id: 'uquest-jsx',
                name: '$150 JSX Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credit each account anniversary year on flights booked directly with JSX.',
                used: false
            },
            {
                id: 'uquest-instacartplus',
                name: 'Instacart+ (3 Months)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 30,
                description: 'Complimentary Instacart+ membership for 3 months, then 50% off membership rate for up to 2 years (approx value assumes ~$9.99/month x 3; actual pricing varies).',
                subscribed: false
            },
            {
                id: 'uquest-global-entry',
                name: '$120 Global Entry / TSA PreCheck',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Receive one statement credit up to $120 every 4 years as reimbursement for Global Entry, TSA PreCheck, or NEXUS application fee.',
                used: false
            }
        ]
    },

    'citi-strata-premier': {
        id: 'citi-strata-premier',
        name: 'Citi Strata Premier',
        issuer: 'Citi',
        annualFee: 95,
        color: 'card-gradient-united',
        benefits: [
            {
                id: 'citi-hotel-benefit',
                name: '$100 Annual Hotel Benefit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Get $100 off a single hotel stay of $500+ (excluding taxes/fees) booked through Citi Travel each year.',
                used: false
            }
        ]
    },

    'amex-green': {
        id: 'amex-green',
        name: 'Amex Green',
        issuer: 'American Express',
        annualFee: 150,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'green-clear',
                name: '$209 CLEAR+ Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 in statement credits per calendar year after paying for CLEAR+ membership with the card (subject to auto-renewal).',
                used: false
            }
        ]
    },

    'amex-business-platinum': {
        id: 'amex-business-platinum',
        name: 'Amex Business Platinum',
        issuer: 'American Express',
        annualFee: 895,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'bplat-airline-fee',
                name: '$200 Airline Fee Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Select one qualifying airline; receive up to $200 in statement credits per calendar year for eligible incidental fees.',
                used: false
            },
            {
                id: 'bplat-hotel-janjun',
                name: '$300 Hotel Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 semi-annually (Jan–Jun), for up to $600/year total, on eligible prepaid Fine Hotels + Resorts / The Hotel Collection stays booked via Amex Travel.',
                used: false
            },
            {
                id: 'bplat-hotel-juldec',
                name: '$300 Hotel Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $300 semi-annually (Jul–Dec), for up to $600/year total, on eligible prepaid Fine Hotels + Resorts / The Hotel Collection stays booked via Amex Travel.',
                used: false
            },
            {
                id: 'bplat-dell',
                name: 'Up to $1,150 Dell Technologies Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 1150,
                description: 'Enroll; get up to $150 in statement credits on U.S. Dell purchases plus an additional $1,000 statement credit after $5,000+ spend on those purchases per calendar year.',
                used: false
            },
            {
                id: 'bplat-adobe',
                name: '$250 Adobe Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Get a $250 statement credit after $600+ spend on U.S. purchases directly with Adobe per calendar year (enrollment required).',
                used: false
            },
            {
                id: 'bplat-indeed',
                name: '$360 Indeed Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 360,
                description: 'Enroll; up to $90 in statement credits per quarter for purchases with Indeed (up to $360 per calendar year).',
                used: false
            },
            {
                id: 'bplat-wireless',
                name: '$10 Wireless Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Enroll; up to $10 back per month for eligible wireless telephone service purchases (up to $120/year).',
                used: false
            },
            {
                id: 'bplat-hilton',
                name: '$200 Hilton Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Enroll; up to $200 in statement credits per calendar year (up to $50 per quarter) on eligible purchases made directly with a property in the Hilton portfolio; Hilton for Business membership required.',
                used: false
            },
            {
                id: 'bplat-clear',
                name: '$209 CLEAR+ Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 in statement credits per calendar year for CLEAR+ membership (subject to auto-renewal; terms apply).',
                used: false
            }
        ]
    },

    'hilton-aspire': {
        id: 'hilton-aspire',
        name: 'Hilton Aspire',
        issuer: 'American Express',
        annualFee: 550,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'aspire-resort-janjun',
                name: '$200 Hilton Resort Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 statement credits Jan–Jun for eligible purchases made directly with participating Hilton Resorts (semi-annual; terms apply).',
                used: false
            },
            {
                id: 'aspire-resort-juldec',
                name: '$200 Hilton Resort Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 statement credits Jul–Dec for eligible purchases made directly with participating Hilton Resorts (semi-annual; terms apply).',
                used: false
            },
            {
                id: 'aspire-flight',
                name: '$200 Flight Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200/year in statement credits on eligible flight purchases; issuer describes $50 per quarter (terms apply).',
                used: false
            },
            {
                id: 'aspire-clear',
                name: '$209 CLEAR+ Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 in statement credits per calendar year for CLEAR+ membership (terms apply).',
                used: false
            },
            {
                id: 'aspire-free-night',
                name: 'Hilton Free Night Reward',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 350,
                description: 'Annual Free Night Reward (value is an estimate; redemption value depends on property/season and award availability).',
                used: false
            }
        ]
    },

    'marriott-brilliant': {
        id: 'marriott-brilliant',
        name: 'Marriott Bonvoy Brilliant',
        issuer: 'American Express',
        annualFee: 650,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'brilliant-dining',
                name: '$25 Dining Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 25,
                description: 'Up to $25/month in dining statement credits (up to $300 per calendar year) for eligible restaurant purchases worldwide.',
                used: false
            },
            {
                id: 'brilliant-property-credit',
                name: '$100 Ritz-Carlton / St. Regis Property Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.FEATURE,
                value: 100,
                description: 'Up to $100 property credit for qualifying charges at The Ritz-Carlton or St. Regis when booking a special rate for a 2-night minimum stay (terms apply).',
                activated: true
            },
            {
                id: 'brilliant-free-night',
                name: 'Free Night Award (Up to 85K Points)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 450,
                description: '1 Free Night Award each year after renewal month (redemption level at or under 85,000 points). Value is an estimate; redemption varies.',
                used: false
            },
            {
                id: 'brilliant-priority-pass',
                name: 'Priority Pass Select',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 469,
                description: 'Enroll in Priority Pass Select (value uses Priority Pass Prestige list price as market proxy).',
                activated: true
            },
            {
                id: 'brilliant-global-entry',
                name: '$120 Global Entry / TSA PreCheck',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Statement credit every 4 years for Global Entry application fee (or eligible TSA PreCheck fee) when charged to the card (terms apply).',
                used: false
            }
        ]
    },

    'world-of-hyatt': {
        id: 'world-of-hyatt',
        name: 'World of Hyatt',
        issuer: 'Chase',
        annualFee: 95,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'hyatt-free-night',
                name: 'Free Night (Category 1–4)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 200,
                description: '1 free night each year after cardmember anniversary at a Category 1–4 Hyatt hotel/resort. Value is an estimate; redemption varies.',
                used: false
            },
            {
                id: 'hyatt-free-night-spend',
                name: 'Extra Free Night (Category 1–4, $15K Spend)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 200,
                description: 'Earn an additional Category 1–4 free night after $15,000 spend in a calendar year (value is an estimate; redemption varies).',
                used: false
            }
        ]
    },

    'ihg-premier': {
        id: 'ihg-premier',
        name: 'IHG One Rewards Premier',
        issuer: 'Chase',
        annualFee: 99,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'ihg-free-night',
                name: 'Anniversary Free Night (Up to 40K Points)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 200,
                description: 'Anniversary Free Night each account anniversary year with a 40,000-point redemption cap (top-off with points allowed). Value is an estimate; redemption varies.',
                used: false
            },
            {
                id: 'ihg-global-entry',
                name: '$120 Global Entry / TSA PreCheck / NEXUS',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'One statement credit every 4 years (up to $120) for Global Entry, TSA PreCheck, or NEXUS application fee when charged to the card.',
                used: false
            },
            {
                id: 'ihg-united-travelbank',
                name: '$50 United TravelBank Cash',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Earn up to $50 in United TravelBank Cash each calendar year after registering the card with your MileagePlus account.',
                used: false
            },
            {
                id: 'ihg-100-credit-20kspend',
                name: '$100 Statement Credit (After $20K Spend)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: '$100 statement credit after spending $20,000 in a calendar year (also includes 10,000 bonus points per issuer terms).',
                used: false
            }
        ]
    },

    'amex-delta-reserve': {
        id: 'amex-delta-reserve',
        name: 'Delta Reserve',
        issuer: 'American Express',
        annualFee: 650,
        color: 'card-gradient-amex',
        benefits: [
            {
                id: 'delta-reserve-rideshare',
                name: '$10 Rideshare Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Enroll; earn up to $10/month in statement credits on U.S. rideshare purchases with select providers (up to $120/year).',
                used: false
            },
            {
                id: 'delta-reserve-delta-stays',
                name: '$200 Delta Stays Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Annual statement credit up to $200 after booking prepaid hotels or vacation rentals through Delta Stays on delta.com.',
                used: false
            },
            {
                id: 'delta-reserve-resy',
                name: '$20 Resy Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 20,
                description: 'Up to $20/month in statement credits for eligible purchases at U.S. Resy restaurants or other eligible Resy purchases (enrollment required).',
                used: false
            },
            {
                id: 'delta-reserve-lounge',
                name: 'Delta Sky Club Visits',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 750,
                description: '15 Delta Sky Club “Visits” per Medallion Year (Feb 1–Jan 31). Value estimate uses $50/visit as a conservative proxy; unlimited visits unlockable after $75,000 spend.',
                activated: true
            },
            {
                id: 'delta-reserve-global-entry',
                name: '$120 Global Entry / TSA PreCheck',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Statement credit every 4 years for Global Entry ($120) or every ~4.5 years for TSA PreCheck (up to $85 via official enrollment provider) when application fee is charged to the card.',
                used: false
            }
        ]
    },

    'united-club-infinite': {
        id: 'united-club-infinite',
        name: 'United Club Infinite',
        issuer: 'Chase',
        annualFee: 695,
        color: 'card-gradient-united',
        benefits: [
            {
                id: 'uclub-membership',
                name: 'United Club Membership',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 750,
                description: 'United Club membership included; issuer states primary cardmembers receive a value of at least $750 (with guest privileges).',
                activated: true
            },
            {
                id: 'uclub-rhr-credit',
                name: '$200 Renowned Hotels & Resorts Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 back in statement credits each account anniversary year on hotel accommodations when you prepay through Renowned Hotels and Resorts.',
                used: false
            },
            {
                id: 'uclub-rideshare',
                name: '$12 Rideshare Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 12,
                description: 'Up to $150/year total: up to $12/month statement credit Jan–Nov and up to $18 in December (yearly opt-in required).',
                used: false
            },
            {
                id: 'uclub-avis-budget',
                name: '$100 United TravelBank (Avis/Budget)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: '$50 United TravelBank cash on your 1st and 2nd eligible Avis/Budget rental booked via cars.united.com and paid with the card (account anniversary year).',
                used: false
            },
            {
                id: 'uclub-instacart',
                name: '$20 Instacart Credits',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 20,
                description: 'Two $10 Instacart credits monthly (up to $240/year total; credits expire each calendar month; benefits end 12/31/2027).',
                used: false
            },
            {
                id: 'uclub-instacartplus',
                name: 'Complimentary Instacart+ Membership',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 99,
                description: 'Complimentary Instacart+ membership through 12/31/2027 or minimum one-year term, whichever is longer (activation required; auto-renewal applies unless canceled).',
                subscribed: false
            },
            {
                id: 'uclub-jsx',
                name: '$200 JSX Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 statement credit each account anniversary year on flights booked directly with JSX.',
                used: false
            },
            {
                id: 'uclub-global-entry',
                name: '$120 Global Entry / TSA PreCheck / NEXUS',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Receive a statement credit of up to $120 every 4 years for Global Entry, TSA PreCheck, or NEXUS application fee when charged to your card.',
                used: false
            }
        ]
    },
    'world-of-hyatt-credit-card': {
        id: 'world-of-hyatt-credit-card',
        name: 'World of Hyatt Credit Card',
        issuer: 'Chase',
        annualFee: 95,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'hyatt-free-night-cat1-4',
                name: 'Free Night Award (Category 1–4)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Receive 1 free night at any Category 1–4 Hyatt hotel every card anniversary year (certificate must be used by a deadline):contentReference[oaicite:0]{index=0}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hyatt-addl-free-night-15k',
                name: 'Free Night Award after $15K spend',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Earn an additional Category 1–4 free night each calendar year after spending $15,000 on the card:contentReference[oaicite:1]{index=1}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hyatt-discoverist-status',
                name: 'Complimentary Discoverist Status',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Automatic World of Hyatt Discoverist elite status for as long as the card is open:contentReference[oaicite:2]{index=2}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'hyatt-elite-nights-5',
                name: 'Elite Night Credits (5 per year)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 5,
                description: 'Receive 5 elite night credits each calendar year toward Hyatt status:contentReference[oaicite:3]{index=3}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hyatt-elite-nights-spend',
                name: 'Elite Night Credits (2 per $5K spent)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 2,
                description: 'Earn 2 additional elite night credits for each $5,000 spent on the card each year:contentReference[oaicite:4]{index=4}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hyatt-visa-concierge',
                name: 'Visa Signature Concierge Service',
                category: BENEFIT_CATEGORY.CUSTOM,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary 24/7 Visa Signature Concierge for travel and entertainment assistance:contentReference[oaicite:5]{index=5}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'hyatt-dashpass-12mo',
                name: '1-Year DashPass Membership ($99 value)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 99,
                description: 'Complimentary 12-month DoorDash DashPass membership (offers $0 delivery fees on eligible orders; up to $10 off quarterly):contentReference[oaicite:6]{index=6}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hyatt-no-foreign-fee',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. with this card:contentReference[oaicite:7]{index=7}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'ihg-one-rewards-premier-credit-card': {
        id: 'ihg-one-rewards-premier-credit-card',
        name: 'IHG One Rewards Premier Credit Card',
        issuer: 'Chase',
        annualFee: 99,
        color: 'card-gradient-chase',
        benefits: [
            {
                id: 'ihg-anniversary-free-night',
                name: 'Anniversary Free Night Award',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Receive 1 free night award each year after your account anniversary (up to 40,000 IHG points value):contentReference[oaicite:8]{index=8}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'ihg-fourth-night-free',
                name: '4th Night Free on Reward Stay',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'When redeeming points for a stay of 4 or more nights, the 4th night is free (effectively a 25% points discount):contentReference[oaicite:9]{index=9}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'ihg-global-entry-credit',
                name: 'Global Entry/TSA Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 statement credit every 4 years for Global Entry or TSA PreCheck application fee:contentReference[oaicite:10]{index=10}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'ihg-united-50',
                name: 'United TravelBank Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 in United Airlines TravelBank cash per year after enrollment:contentReference[oaicite:11]{index=11}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'ihg-100-credit-20k',
                name: '$100 Spend Credit & 10K Points',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Receive $100 statement credit and 10,000 bonus points each calendar year after spending $20,000 on the card:contentReference[oaicite:12]{index=12}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'ihg-diamond-status',
                name: 'Diamond Elite Status (IHG)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Achieve IHG Diamond elite status (top tier) after spending $40,000 in a calendar year:contentReference[oaicite:13]{index=13}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'ihg-points-discount',
                name: '20% Points Purchase Discount',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Enjoy at least a 20% discount when purchasing IHG points using your card:contentReference[oaicite:14]{index=14}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'ihg-no-foreign-fee',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees for purchases made outside the U.S.:contentReference[oaicite:15]{index=15}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'american-express-green-card': {
        id: 'american-express-green-card',
        name: 'American Express Green Card',
        issuer: 'American Express',
        annualFee: 150,
        color: 'card-gradient-americanexpress',
        benefits: [
            {
                id: 'amex-green-clear-credit',
                name: '$209 CLEAR Plus Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 statement credit per year for CLEAR Plus membership (airport security service):contentReference[oaicite:16]{index=16}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'amex-green-no-foreign',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. using this card:contentReference[oaicite:17]{index=17}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'amex-green-shoprunner',
                name: 'ShopRunner Membership (free)',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.SUBSCRIPTION,
                value: 0,
                description: 'Complimentary ShopRunner membership for free 2-day shipping at eligible retailers.',
                used: false,
                subscribed: false,
                activated: false
            }
        ]
    },
    'american-express-business-platinum-card': {
        id: 'american-express-business-platinum-card',
        name: 'American Express Business Platinum Card',
        issuer: 'American Express',
        annualFee: 895,
        color: 'card-gradient-americanexpress',
        benefits: [
            {
                id: 'bizplat-airline-credit',
                name: '$200 Airline Fee Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 in statement credits per year for airline incidental fees (bags, seats, etc.):contentReference[oaicite:19]{index=19}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-global-entry',
                name: 'Global Entry/TSA PreCheck Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 statement credit every 4 years for Global Entry or TSA PreCheck application fee:contentReference[oaicite:20]{index=20}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-dell-150',
                name: '$150 Dell Statement Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 150,
                description: 'Up to $150 statement credit annually for Dell Technologies purchases on Dell.com:contentReference[oaicite:21]{index=21}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-dell-1000',
                name: '$1,000 Dell Bonus Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 1000,
                description: 'Spend $5,000+ on the card in a year to get a $1,000 statement credit on Dell purchases:contentReference[oaicite:22]{index=22}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-adobe',
                name: '$250 Adobe Credit',
                category: BENEFIT_CATEGORY.SHOPPING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 250,
                description: 'Up to $250 statement credit each year for Adobe Creative Cloud purchases（after $600 spend）:contentReference[oaicite:23]{index=23}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-wireless',
                name: '$10 Monthly Wireless Credit',
                category: BENEFIT_CATEGORY.CUSTOM,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: '$10 credit per month (up to $120/yr) toward wireless phone services on U.S. carriers:contentReference[oaicite:24]{index=24}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-hilton',
                name: '$200 Hilton Statement Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 in statement credits per year on eligible Hilton purchases:contentReference[oaicite:25]{index=25}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-indeed',
                name: '$360 Indeed Credit ($90/quarter)',
                category: BENEFIT_CATEGORY.CUSTOM,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 360,
                description: '$90 credit each quarter (up to $360/yr) for Indeed job site services:contentReference[oaicite:26]{index=26}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-fhr-credit',
                name: '$600 Fine Hotels & Resorts Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 600,
                description: 'Up to $600 in annual statement credits for bookings through Amex Fine Hotels & Resorts or The Hotel Collection:contentReference[oaicite:27]{index=27}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-clear',
                name: '$209 CLEAR Plus Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 statement credit per year for CLEAR Plus membership:contentReference[oaicite:28]{index=28}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'bizplat-priority-pass',
                name: 'Priority Pass Select Membership ($429)',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 429,
                description: 'Complimentary Priority Pass™ Select membership for airport lounge access (includes guests, ~$429 value).',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'marriott-bonvoy-brilliant-american-express-card': {
        id: 'marriott-bonvoy-brilliant-american-express-card',
        name: 'Marriott Bonvoy Brilliant American Express Card',
        issuer: 'American Express',
        annualFee: 650,
        color: 'card-gradient-americanexpress',
        benefits: [
            {
                id: 'mb-brilliant-dining-credit',
                name: '$300 Dining Credits ($25/mo)',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 300,
                description: 'Up to $25 statement credit per month (up to $300/yr) at restaurants worldwide:contentReference[oaicite:29]{index=29}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'mb-brilliant-property-credit',
                name: '$100 Ritz/Regis Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 resort credit on qualifying charges at Ritz-Carlton or St. Regis hotels on 2-night stays booked via special rate:contentReference[oaicite:30]{index=30}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'mb-brilliant-free-night',
                name: 'Annual Free Night Award (up to 85k pts)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Receive 1 free night certificate each year (up to 85,000 point category) after renewal:contentReference[oaicite:31]{index=31}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'mb-brilliant-elite-credits',
                name: '25 Elite Night Credits',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 25,
                description: 'Get 25 elite night credits each calendar year toward Marriott Platinum status:contentReference[oaicite:32]{index=32}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'mb-brilliant-priority-pass',
                name: 'Priority Pass Select Membership ($429)',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 429,
                description: 'Priority Pass™ Select membership for unlimited access to 1,200+ airport lounges worldwide:contentReference[oaicite:33]{index=33}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'mb-brilliant-platinum-status',
                name: 'Marriott Platinum Elite Status',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary Marriott Bonvoy Platinum Elite status as long as card is open:contentReference[oaicite:34]{index=34}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'hilton-honors-aspire-card': {
        id: 'hilton-honors-aspire-card',
        name: 'Hilton Honors American Express Aspire Card',
        issuer: 'American Express',
        annualFee: 550,
        color: 'card-gradient-americanexpress',
        benefits: [
            {
                id: 'hilton-aspire-diamond-status',
                name: 'Hilton Diamond Status',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary Hilton Honors Diamond elite status (top tier):contentReference[oaicite:35]{index=35}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'hilton-aspire-free-night',
                name: 'Annual Free Night Reward',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Receive 1 free night reward each year (no point limit specified):contentReference[oaicite:36]{index=36}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-extra-night-30k',
                name: 'Free Night after $30K Spend',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Earn an additional free night reward when you spend $30,000 in a calendar year:contentReference[oaicite:37]{index=37}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-extra-night-60k',
                name: 'Free Night after $60K Spend',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.ONE_TIME,
                value: 0,
                description: 'Earn another free night reward when you spend $60,000 in a calendar year:contentReference[oaicite:38]{index=38}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-resort-credit-1',
                name: '$200 Hilton Resort Credit (Jan–Jun)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: '$200 statement credit for eligible Hilton resort purchases each January–June (up to $400/yr):contentReference[oaicite:39]{index=39}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-resort-credit-2',
                name: '$200 Hilton Resort Credit (Jul–Dec)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.SEMI_ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: '$200 statement credit for eligible Hilton resort purchases each July–December (up to $400/yr):contentReference[oaicite:40]{index=40}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-airline-credit',
                name: '$200 Airline Fee Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 per year in statement credits ($50/quarter) for airline purchases or travel booked with airline:contentReference[oaicite:41]{index=41}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-clear',
                name: '$209 CLEAR Plus Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 209,
                description: 'Up to $209 per year statement credit for CLEAR Plus airport security service (enrollment required):contentReference[oaicite:42]{index=42}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'hilton-aspire-car-rental-status',
                name: 'National Emerald Club Executive Status',
                category: BENEFIT_CATEGORY.CUSTOM,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary National Car Rental Emerald Club Executive status (enroll via Amex online):contentReference[oaicite:43]{index=43}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'hilton-aspire-resort-credit-waldorf',
                name: '$100 Waldorf/Conrad Resort Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 resort credit for qualifying stays at Waldorf Astoria or Conrad hotels (book 2-night min at special rate):contentReference[oaicite:44]{index=44}.',
                used: false,
                subscribed: false,
                activated: false
            }
        ]
    },
    'delta-reserve-american-express-card': {
        id: 'delta-reserve-american-express-card',
        name: 'Delta SkyMiles Reserve American Express Card',
        issuer: 'American Express',
        annualFee: 650,
        color: 'card-gradient-americanexpress',
        benefits: [
            {
                id: 'delta-15-skyclub-visits',
                name: 'Delta Sky Club Visits (15 per year)',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: '15 Delta Sky Club lounge visits each Medallion year when flying Delta (unlimited after $75K spend):contentReference[oaicite:45]{index=45}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'delta-centurion-access',
                name: 'Centurion & Escape Lounge Access',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary access to Amex Centurion and Escape Lounges when flying Delta with this card:contentReference[oaicite:46]{index=46}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'delta-companion-certificate',
                name: 'Annual Companion Certificate',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 0,
                description: 'One round-trip companion ticket (up to $600-$700 value) each year on a main cabin Delta flight after renewal:contentReference[oaicite:47]{index=47}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'delta-rideshare-credit',
                name: '$10 Monthly Lyft Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Up to $10 statement credit per month (up to $120/yr) on eligible US rideshare purchases (Lyft):contentReference[oaicite:48]{index=48}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'delta-deltastays-credit',
                name: '$200 Delta Stays Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 200,
                description: 'Up to $200 back per year for prepaid hotels or vacation rentals booked via Delta Stays:contentReference[oaicite:49]{index=49}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'delta-resy-credit',
                name: '$20 Monthly Resy Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 20,
                description: 'Up to $20 statement credit per month (up to $240/yr) on eligible Resy restaurant reservations:contentReference[oaicite:50]{index=50}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'delta-uber-one-credit',
                name: '$9.99 Monthly Uber One Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 9.99,
                description: 'Up to $9.99 credit per month for 12 months for Uber One membership (max ~$120):contentReference[oaicite:51]{index=51}.',
                used: false,
                subscribed: false,
                activated: false
            }
        ]
    },
    'capital-one-venture-rewards-credit-card': {
        id: 'capital-one-venture-rewards-credit-card',
        name: 'Capital One Venture Rewards Credit Card',
        issuer: 'Capital One',
        annualFee: 95,
        color: 'card-gradient-capitalone',
        benefits: [
            {
                id: 'venture-global-entry',
                name: 'Global Entry/TSA PreCheck Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 statement credit for Global Entry or TSA PreCheck every 4 years:contentReference[oaicite:52]{index=52}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'venture-hertz-status',
                name: 'Complimentary Hertz Five Star Status',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Automatic Hertz Five Star rental status (skip counter, car upgrades):contentReference[oaicite:53]{index=53}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'venture-lifestyle-credit',
                name: '$50 Lifestyle Collection Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Receive $50 experience credit on every Capital One Lifestyle Collection hotel or vacation rental booking:contentReference[oaicite:54]{index=54}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'venture-no-foreign-fee',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. with this card:contentReference[oaicite:55]{index=55}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'capital-one-savor-cash-rewards-credit-card': {
        id: 'capital-one-savor-cash-rewards-credit-card',
        name: 'Capital One Savor Cash Rewards Credit Card',
        issuer: 'Capital One',
        annualFee: 0,
        color: 'card-gradient-capitalone',
        benefits: [
            {
                id: 'savor-cash-3pct-dining',
                name: '3% Cash Back on Dining & Groceries',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.CREDIT,
                value: 3,
                description: 'Earn unlimited 3% cash back at restaurants and grocery stores (Visa signature basis):contentReference[oaicite:56]{index=56}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'savor-cash-3pct-entertainment',
                name: '3% Cash Back on Entertainment & Streaming',
                category: BENEFIT_CATEGORY.ENTERTAINMENT,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.CREDIT,
                value: 3,
                description: 'Earn unlimited 3% cash back on entertainment and popular streaming services:contentReference[oaicite:57]{index=57}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'savor-cash-no-foreign',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. with this card:contentReference[oaicite:58]{index=58}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'citi-premier-card': {
        id: 'citi-premier-card',
        name: 'Citi Premier® Card',
        issuer: 'Citi',
        annualFee: 95,
        color: 'card-gradient-citi',
        benefits: [
            {
                id: 'citi-premier-hotel-credit',
                name: '$100 Annual Hotel Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 statement credit once per year on a single hotel stay of $500+ when booked through Citi Travel:contentReference[oaicite:59]{index=59}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'citi-premier-resort-credit',
                name: '$100 Resort Credit (Luxury Collection)',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 resort credit per year at select Luxury Collection hotels booked via Citi Travel:contentReference[oaicite:60]{index=60}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'citi-premier-no-foreign',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees for purchases made outside the U.S. with this card:contentReference[oaicite:61]{index=61}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'citi-aadvantage-executive-world-elite-mastercard': {
        id: 'citi-aadvantage-executive-world-elite-mastercard',
        name: 'Citi AAdvantage® Executive World Elite Mastercard®',
        issuer: 'Citi',
        annualFee: 550,
        color: 'card-gradient-citi',
        benefits: [
            {
                id: 'aa-exec-admirals-club',
                name: 'Complimentary Admirals Club® Access',
                category: BENEFIT_CATEGORY.LOUNGE,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 850,
                description: 'Free Admirals Club membership (up to $850 value) for cardholder with up to 2 guests:contentReference[oaicite:62]{index=62}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'aa-exec-10k-lyft',
                name: '$10 Monthly Lyft Credit',
                category: BENEFIT_CATEGORY.RIDESHARE,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Earn up to $10 statement credit each month (up to $120/yr) on rides with Lyft:contentReference[oaicite:63]{index=63}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'aa-exec-10k-grubhub',
                name: '$10 Monthly Grubhub Credit',
                category: BENEFIT_CATEGORY.DINING,
                frequency: BENEFIT_FREQUENCY.MONTHLY,
                type: BENEFIT_TYPE.CREDIT,
                value: 10,
                description: 'Earn up to $10 statement credit each month (up to $120/yr) on eligible Grubhub purchases:contentReference[oaicite:64]{index=64}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'aa-exec-avis-budget-credit',
                name: '$120 Car Rental Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 statement credit per year on prepaid Avis and Budget car rentals booked directly:contentReference[oaicite:65]{index=65}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'aa-exec-global-entry',
                name: 'Global Entry/TSA Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 120,
                description: 'Up to $120 statement credit every 4 years for Global Entry or TSA PreCheck application fee:contentReference[oaicite:66]{index=66}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'aa-exec-first-bag',
                name: 'First Checked Bag Free',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'First checked bag free on domestic AA flights for you and up to 8 companions:contentReference[oaicite:67]{index=67}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'aa-exec-priority-boarding',
                name: 'Priority Boarding & Check-in',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'Complimentary priority check-in, security, and boarding for you and 8 companions:contentReference[oaicite:68]{index=68}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    },
    'wells-fargo-autograph-journey-card': {
        id: 'wells-fargo-autograph-journey-card',
        name: 'Wells Fargo Autograph Journey Card',
        issuer: 'Wells Fargo',
        annualFee: 95,
        color: 'card-gradient-wellsfargo',
        benefits: [
            {
                id: 'autograph-airline-credit',
                name: '$50 Airline Statement Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 50,
                description: 'Up to $50 annual statement credit (minimum $50 airline purchase) toward airline ticket fees:contentReference[oaicite:69]{index=69}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'autograph-no-foreign',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. with this card:contentReference[oaicite:70]{index=70}.',
                used: false,
                subscribed: false,
                activated: true
            },
            {
                id: 'autograph-cellphone-protection',
                name: '$1,000 Cell Phone Protection',
                category: BENEFIT_CATEGORY.INSURANCE,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.INSURANCE,
                value: 1000,
                description: 'Up to $1,000 per claim for cell phone damage, theft, or loss (subject to $25 deductible):contentReference[oaicite:71]{index=71}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'autograph-baggage-insurance',
                name: '$3,000 Lost Baggage Reimbursement',
                category: BENEFIT_CATEGORY.INSURANCE,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.INSURANCE,
                value: 3000,
                description: 'Up to $3,000 per trip for lost/stolen luggage when traveling on a common carrier:contentReference[oaicite:72]{index=72}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'autograph-trip-cancel',
                name: '$15,000 Trip Cancellation Insurance',
                category: BENEFIT_CATEGORY.INSURANCE,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.INSURANCE,
                value: 15000,
                description: 'Trip cancellation/interruption insurance reimbursing up to $15,000 per covered trip:contentReference[oaicite:73]{index=73}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'autograph-travel-accident',
                name: '$1,000,000 Travel Accident Insurance',
                category: BENEFIT_CATEGORY.INSURANCE,
                frequency: BENEFIT_FREQUENCY.ONE_TIME,
                type: BENEFIT_TYPE.INSURANCE,
                value: 1000000,
                description: 'Automatic common carrier travel accident insurance up to $1,000,000 when ticket purchased on card:contentReference[oaicite:74]{index=74}.',
                used: false,
                subscribed: false,
                activated: false
            }
        ]
    },
    'bank-of-america-premium-rewards-credit-card': {
        id: 'bank-of-america-premium-rewards-credit-card',
        name: 'Bank of America Premium Rewards Credit Card',
        issuer: 'Bank of America',
        annualFee: 95,
        color: 'card-gradient-bankofamerica',
        benefits: [
            {
                id: 'boa-airline-credit',
                name: '$100 Airline Incidentals Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.ANNUAL,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 statement credit per year for airline incidental fees (baggage, seats, lounges, etc.):contentReference[oaicite:75]{index=75}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'boa-global-entry',
                name: '$100 Global Entry/TSA Credit',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FOUR_YEAR,
                type: BENEFIT_TYPE.CREDIT,
                value: 100,
                description: 'Up to $100 credit every 4 years for Global Entry or TSA PreCheck application fees:contentReference[oaicite:76]{index=76}.',
                used: false,
                subscribed: false,
                activated: false
            },
            {
                id: 'boa-no-foreign',
                name: 'No Foreign Transaction Fees',
                category: BENEFIT_CATEGORY.TRAVEL,
                frequency: BENEFIT_FREQUENCY.FEATURE,
                type: BENEFIT_TYPE.FEATURE,
                value: 0,
                description: 'No fees on purchases made outside the U.S. with this card:contentReference[oaicite:77]{index=77}.',
                used: false,
                subscribed: false,
                activated: true
            }
        ]
    }
};