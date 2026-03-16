# Credit Card Benefits Research Prompt

## Task
Research and compile the most current benefits data for premium credit cards. The output should be ready to paste directly into the app's data file.

## Output Format
Generate JavaScript code in the exact format below. Each card should follow this structure:

```javascript
'card-id': {
    id: 'card-id',
    name: 'Card Display Name',
    issuer: 'Issuer Name',
    annualFee: 000,
    color: 'card-gradient-[issuer]',
    benefits: [
        {
            id: 'unique-benefit-id',
            name: 'Benefit Display Name',
            category: BENEFIT_CATEGORY.CATEGORY_NAME,
            frequency: BENEFIT_FREQUENCY.FREQUENCY_TYPE,
            type: BENEFIT_TYPE.TYPE_NAME,
            value: 000,
            description: 'Brief description of the benefit',
            used: false  // or subscribed: false, or activated: true
        }
    ]
}
```

## Available Constants

### BENEFIT_FREQUENCY
- `MONTHLY` - Resets every month
- `SEMI_ANNUAL` - Resets twice per year (Jan-Jun, Jul-Dec)
- `ANNUAL` - Resets every card anniversary year
- `FOUR_YEAR` - Every 4 years (e.g., TSA PreCheck/Global Entry)
- `ONE_TIME` - One-time benefit

### BENEFIT_TYPE
- `credit` - Statement credits (use `used: false`)
- `subscription` - Complimentary memberships (use `subscribed: false`)
- `feature` - Ongoing features like lounge access (use `activated: true`)
- `one_time` - One-time benefits (use `used: false`)

### BENEFIT_CATEGORY
- `travel` - Flights, hotels, car rentals, travel credits
- `dining` - Restaurant credits, food delivery
- `entertainment` - Streaming, tickets, events
- `shopping` - Retail credits (Saks, Walmart+, etc.)
- `rideshare` - Uber, Lyft credits
- `lounge` - Airport lounge access
- `insurance` - Travel insurance, purchase protection

## Color Classes
Use these existing color classes:
- `card-gradient-chase` - Chase cards
- `card-gradient-amex` - American Express cards
- `card-gradient-united` - United/Citi cards
- `card-gradient-custom` - Other issuers

## Cards to Research

### Priority Cards (Update these first - most popular)
1. **Chase Sapphire Reserve** - id: `chase-sapphire-reserve`
2. **Amex Platinum** - id: `amex-platinum`
3. **Amex Gold** - id: `amex-gold`
4. **Capital One Venture X** - id: `capital-one-venture-x`

### Secondary Cards (Add if not present)
5. **Chase Sapphire Preferred** - id: `chase-sapphire-preferred`
6. **United Quest** - id: `united-quest`
7. **Citi Strata Premier** - id: `citi-strata-premier`
8. **Amex Green** - id: `amex-green`
9. **Amex Business Platinum** - id: `amex-business-platinum`
10. **Hilton Aspire** - id: `hilton-aspire`
11. **Marriott Bonvoy Brilliant** - id: `marriott-brilliant`
12. **World of Hyatt** - id: `world-of-hyatt`
13. **IHG One Rewards Premier** - id: `ihg-premier`
14. **Delta Reserve** - id: `amex-delta-reserve`
15. **United Club Infinite** - id: `united-club-infinite`

## Research Guidelines

1. **Use official sources**: Card issuer websites, terms & conditions
2. **Verify current values**: Benefits change frequently - confirm 2025/2026 values
3. **Note monthly vs annual**: Some credits are monthly (e.g., $15/month Uber = $180/year)
4. **Include ALL statement credits**: Even small monthly credits add up
5. **Separate semi-annual credits**: Create separate benefit entries for Jan-Jun and Jul-Dec
6. **Estimate feature values**: For lounge access, use market rate of comparable memberships

## Example Output

```javascript
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
}
```

## Deliverable

Return the complete JavaScript object containing all researched cards, formatted exactly as shown above. The code should be copy-paste ready to replace the `availableCards` object in `js/data.js`.
