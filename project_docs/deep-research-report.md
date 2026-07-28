# CardFit earn rates and signup bonus research

## Reward currency additions

I would add these IDs in `js/cardfit-data.js` if they do not already exist. The `cpp` values below are **project defaults for CardFit heuristics**, not issuer-published valuations.

```js
// Suggested additions if missing from REWARD_CURRENCIES
united_miles: { id: 'united_miles', label: 'United MileagePlus miles', cpp: 1.3 },
delta_skymiles: { id: 'delta_skymiles', label: 'Delta SkyMiles', cpp: 1.2 },
ihg: { id: 'ihg', label: 'IHG One Rewards points', cpp: 0.5 },
```

## Flexible-points cards

For flexible-points cards issued by entity["company","Chase","us bank"], entity["company","American Express","financial services"], entity["company","Capital One","us bank"], and entity["company","Citi","us bank"], I mapped portal-only or channel-specific bonus categories to the closest CardFit bucket and noted the qualifier in comments where CardFit cannot yet model portal restrictions or overlapping travel definitions. Amex consumer welcome offers were often surfaced on official pages as “apply and find out your welcome offer” or “as high as,” so I used `points: 0` where a single fixed public bonus number was not reliably exposed in the retrieved official source. citeturn8view3turn7view1turn5search5turn7view6turn20search17turn19search22turn20search6

**`chase-sapphire-reserve`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve
    rewardCurrency: 'chase_ur',
    earnRates: [
        { category: 'flights', multiplier: 4 },
        { category: 'hotels', multiplier: 4 },
        { category: 'dining', multiplier: 3 },
        { category: 'general', multiplier: 1 }
    ], // threshold: 8X on Chase Travel purchases; any spend covered by the $300 annual travel credit or qualifying The Edit credit does not earn points
    signupBonus: { points: 125000, spendRequirement: 6000, months: 3 },
```

Official evidence: the current card page shows 125,000 points after $6,000 in 3 months, with rewards terms showing 8X through Chase Travel, 4X on direct flights and direct hotels, 3X dining, and 1X other purchases. citeturn8view3turn8view1turn9view0turn9view1turn9view2

**`amex-platinum`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/platinum/
    // variable public offer: official page surfaced "as high as 175,000" rather than one fixed public bonus number
    rewardCurrency: 'amex_mr',
    earnRates: [
        { category: 'flights', multiplier: 5 },
        { category: 'hotels', multiplier: 5 },
        { category: 'general', multiplier: 1 }
    ], // cap: flights 5X on first $500K/yr; hotels 5X is only for prepaid hotels booked through AmexTravel.com
    signupBonus: { points: 0, spendRequirement: 12000, months: 6 },
```

Official evidence: the Platinum membership guide shows 5X on flights booked directly with airlines or through Amex Travel on up to $500,000 per calendar year, 5X on prepaid hotels through AmexTravel.com, and 1X otherwise; the public card page snippet surfaced a variable offer shown as “as high as 175,000” after $12,000 in 6 months. citeturn15view0turn20search17turn14search2

**`amex-gold`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/gold-card/
    // variable public offer: official page / Resy channel surfaced "apply and find out your welcome offer" / "as high as" language
    rewardCurrency: 'amex_mr',
    earnRates: [
        { category: 'dining', multiplier: 4 },
        { category: 'groceries', multiplier: 4 },
        { category: 'flights', multiplier: 3 },
        { category: 'hotels', multiplier: 2 },
        { category: 'travel', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // cap: dining 4X on first $50K/yr; groceries 4X on first $25K/yr; hotels/travel 2X only on prepaid hotels and other eligible travel booked through AmexTravel.com
    signupBonus: { points: 0, spendRequirement: 6000, months: 6 },
```

Official evidence: Amex’s rewards materials show 4X at restaurants worldwide on up to $50,000 per year, 4X at U.S. supermarkets on up to $25,000 per year, 3X on flights booked directly with airlines or through Amex Travel, 2X on prepaid hotels and other eligible travel booked through Amex Travel, and 1X on other eligible purchases; the official Amex/Resy offer pages surfaced a variable welcome offer rather than one fixed public point total. citeturn19search4turn19search6turn19search15turn19search22turn14search12

**`capital-one-venture-x`**

```js
    // cardfit: last verified 2026-04-24 from https://www.capitalone.com/credit-cards/venture-x/
    rewardCurrency: 'capital_one_miles',
    earnRates: [
        { category: 'hotels', multiplier: 10 },
        { category: 'flights', multiplier: 5 },
        { category: 'travel', multiplier: 5 },
        { category: 'general', multiplier: 2 }
    ], // threshold: portal-only — 10X on hotels and rental cars, 5X on flights, vacation rentals, and activities via Capital One Travel
    signupBonus: { points: 75000, spendRequirement: 4000, months: 3 },
```

Official evidence: Capital One’s official pages currently show 75,000 bonus miles after $4,000 in 3 months, plus 10X on hotels and rental cars and 5X on flights, vacation rentals, and activities through Capital One Travel, with 2X on all other purchases. citeturn5search5turn5search6turn5search8

**`chase-sapphire-preferred`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred
    rewardCurrency: 'chase_ur',
    earnRates: [
        { category: 'dining', multiplier: 3 },
        { category: 'groceries', multiplier: 3 },
        { category: 'streaming', multiplier: 3 },
        { category: 'travel', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // threshold: Chase Travel purchases earn 5X; groceries here maps issuer "online grocery" only
    signupBonus: { points: 75000, spendRequirement: 5000, months: 3 },
```

Official evidence: the current Sapphire Preferred page shows 75,000 bonus points after $5,000 in 3 months and lists 5X on Chase Travel, 2X on other travel, 3X dining, 3X online grocery, 3X select streaming, and 1X other purchases. citeturn7view1turn9view4

**`citi-strata-premier`**

```js
    // cardfit: last verified 2026-04-24 from https://www.citi.com/credit-cards/citi-strata-premier-credit-card
    // fixed public bonus amount did not surface in the retrieved official page view
    rewardCurrency: 'citi_typ',
    earnRates: [
        { category: 'flights', multiplier: 3 },
        { category: 'hotels', multiplier: 3 },
        { category: 'travel', multiplier: 3 },
        { category: 'dining', multiplier: 3 },
        { category: 'groceries', multiplier: 3 },
        { category: 'gas', multiplier: 3 },
        { category: 'general', multiplier: 1 }
    ], // threshold: 10X on hotels, car rentals, and attractions booked through CitiTravel; other air travel and hotel purchases earn 3X
    signupBonus: { points: 0, spendRequirement: 0, months: 0 },
```

Official evidence: Citi’s official card page shows 10X on hotels, car rentals, and attractions booked through Citi Travel; 3X on air travel and other hotel purchases, restaurants, supermarkets, and gas/EV charging; and 1X on other purchases. In the retrieved official view, a readable fixed public signup-bonus number did not surface. citeturn7view6turn3search14

**`amex-green`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/green/
    // variable public offer: official sources surfaced "as high as" / no single fixed public point amount in the retrieved view
    rewardCurrency: 'amex_mr',
    earnRates: [
        { category: 'dining', multiplier: 3 },
        { category: 'travel', multiplier: 3 },
        { category: 'transit', multiplier: 3 },
        { category: 'general', multiplier: 1 }
    ],
    signupBonus: { points: 0, spendRequirement: 6000, months: 6 },
```

Official evidence: Amex’s official Green materials show 3X on restaurants worldwide, 3X on travel, 3X on transit, and 1X on other eligible purchases; official page snippets surfaced a variable “as high as” offer and a 6-month spend window rather than one fixed public point amount. citeturn20search2turn20search4turn20search10turn20search15turn20search6turn20search8

**`amex-business-platinum`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/
    rewardCurrency: 'amex_mr',
    earnRates: [
        { category: 'flights', multiplier: 5 },
        { category: 'hotels', multiplier: 5 },
        { category: 'general', multiplier: 1 }
    ], // cap: 2X on eligible Amex-defined key business categories or on single purchases of $5K+ only, up to $2M/yr; not represented in canonical buckets
    signupBonus: { points: 300000, spendRequirement: 20000, months: 3 },
```

Official evidence: Amex’s Business Platinum pages show 300,000 Membership Rewards points after $20,000 in 3 months on the official compare/apply page, and the card page shows 5X on flights and prepaid hotels booked through Amex Travel, 2X on key business categories or single purchases of $5K+, capped at $2 million per year, and 1X otherwise. citeturn4search8turn0search5turn7view14

## Airline co-brand cards

For airline cards tied to entity["company","United Airlines","airline"] and entity["company","Delta Air Lines","airline"], I used the **card-earned** component where official marketing pages showed “up to X total miles,” because those pages explicitly break totals into card earnings plus separate program-member earnings or non-card benefits. citeturn10view0turn10view5turn16search0turn16search3

**`united-quest`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/travel-credit-cards/united/united-quest
    rewardCurrency: 'united_miles',
    earnRates: [
        { category: 'flights', multiplier: 4 },
        { category: 'hotels', multiplier: 5 },
        { category: 'travel', multiplier: 2 },
        { category: 'transit', multiplier: 2 },
        { category: 'dining', multiplier: 2 },
        { category: 'streaming', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // threshold: flights = direct United airfare; 4X on other eligible United purchases is not modeled separately; 5X hotels is only prepaid Renowned Hotels and Resorts for United Cardmembers
    signupBonus: { points: 90000, spendRequirement: 4000, months: 3 }, // threshold: +10,000 miles for adding an authorized user in first 3 months; +3,000 PQP not modeled
```

Official evidence: the current United Quest page shows 90,000 miles after $4,000 in 3 months plus 10,000 miles for adding an authorized user, and the earn structure shows 4X on eligible United purchases, 5X on prepaid Renowned Hotels and Resorts stays, 2X on other travel, 2X dining, 2X select streaming, and 1X other purchases. citeturn7view2turn10view0turn10view2turn10view3

**`amex-delta-reserve`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve-american-express-card/
    // variable public offer: official page surfaced "as high as 100,000 Bonus Miles" rather than one fixed public bonus number
    rewardCurrency: 'delta_skymiles',
    earnRates: [
        { category: 'flights', multiplier: 3 },
        { category: 'general', multiplier: 1 }
    ], // threshold: flights = Delta purchases made directly with Delta; no bonus on non-Delta airfare
    signupBonus: { points: 0, spendRequirement: 5000, months: 6 },
```

Official evidence: Amex’s official Delta Reserve materials show 3X miles on Delta purchases made directly with Delta and 1X on all other eligible purchases; the public card page surfaced a variable offer shown as “as high as 100,000 Bonus Miles” after $5,000 in 6 months. citeturn16search0turn16search3turn20search19turn14search3

**`united-club-infinite`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/travel-credit-cards/united/club-infinite
    rewardCurrency: 'united_miles',
    earnRates: [
        { category: 'flights', multiplier: 5 },
        { category: 'hotels', multiplier: 5 },
        { category: 'travel', multiplier: 2 },
        { category: 'dining', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // threshold: flights = direct United airfare; 5X on other eligible United purchases is not modeled separately; 5X hotels is only prepaid Renowned Hotels and Resorts for United Cardmembers
    signupBonus: { points: 100000, spendRequirement: 5000, months: 3 }, // threshold: +10,000 miles for adding an authorized user in first 3 months; +3,000 PQP not modeled
```

Official evidence: the current United Club page shows 100,000 miles after $5,000 in 3 months plus 10,000 miles for adding an authorized user, and the earn structure shows 5X on eligible United purchases, 5X on prepaid Renowned Hotels and Resorts stays, 2X on other travel, 2X dining, and 1X other purchases. citeturn7view3turn10view5turn10view6

## Hotel co-brand cards

For hotel cards linked to entity["company","Hilton","hotel company"], entity["company","Marriott","hotel company"], entity["company","Hyatt","hotel company"], and entity["company","IHG Hotels & Resorts","hotel company"], I used the **card-issued** point multiplier rather than the larger “up to X total” marketing number whenever the official source explicitly separated card earnings from hotel-program base points or elite-status bonuses. citeturn18search12turn12search14turn10view7turn11view0

**`hilton-aspire`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire/
    rewardCurrency: 'hilton',
    earnRates: [
        { category: 'hotels', multiplier: 14 },
        { category: 'flights', multiplier: 7 },
        { category: 'dining', multiplier: 7 },
        { category: 'travel', multiplier: 7 },
        { category: 'general', multiplier: 3 }
    ], // threshold: hotels = direct Hilton portfolio spend; travel = select car rentals booked direct with participating rental companies
    signupBonus: { points: 150000, spendRequirement: 6000, months: 6 },
```

Official evidence: Hilton Aspire’s current official pages show 150,000 Hilton Honors Bonus Points after $6,000 in 6 months, and official terms show 14X at Hilton portfolio properties, 7X on flights booked directly with airlines or through AmexTravel.com, 7X on select car rentals, 7X at U.S. restaurants, and 3X on other eligible purchases. citeturn3search6turn3search10turn18search12turn18search4turn18search2

**`marriott-brilliant`**

```js
    // cardfit: last verified 2026-04-24 from https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/
    // fixed public bonus amount did not surface in the retrieved official page view
    rewardCurrency: 'marriott',
    earnRates: [
        { category: 'hotels', multiplier: 6 },
        { category: 'flights', multiplier: 3 },
        { category: 'dining', multiplier: 3 },
        { category: 'general', multiplier: 2 }
    ], // threshold: hotels = direct Marriott Bonvoy participating properties and Marriott-branded stores only
    signupBonus: { points: 0, spendRequirement: 6000, months: 6 },
```

Official evidence: Marriott Bonvoy Brilliant’s official rewards terms show 6X at participating Marriott Bonvoy properties, Marriott-branded retail establishments, and Marriott-branded online stores, 3X on airfare purchased directly from airlines, 3X at restaurants worldwide, and 2X otherwise. In the retrieved official Amex offer views, a fixed public point amount did not surface, but the category page did surface a 6-month, $6,000 spend window. citeturn12search14turn12search0turn12search9turn12search1

**`world-of-hyatt`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/travel-credit-cards/world-of-hyatt-credit-card
    rewardCurrency: 'hyatt',
    earnRates: [
        { category: 'hotels', multiplier: 4 },
        { category: 'dining', multiplier: 2 },
        { category: 'flights', multiplier: 2 },
        { category: 'transit', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // threshold: hotels = direct Hyatt spend only; issuer marketing also shows up to 5 base Hyatt points/$ from World of Hyatt membership, which are not card-generated
    signupBonus: { points: 30000, spendRequirement: 3000, months: 3 }, // threshold: +up to 30,000 more points via first-6-month accelerator on up to $15,000 of purchases that normally earn 1 point
```

Official evidence: the current World of Hyatt page shows 30,000 points after $3,000 in 3 months plus up to 30,000 more via a first-6-month accelerator, and the earn structure shows 4 bonus points at Hyatt hotels, 2 bonus points at restaurants, airline tickets purchased directly from airlines, local transit and commuting, and 1 point on other purchases. citeturn7view4turn10view7turn10view8

**`ihg-premier`**

```js
    // cardfit: last verified 2026-04-24 from https://creditcards.chase.com/travel-credit-cards/ihg-rewards-club/premier?iCELL=61FY
    rewardCurrency: 'ihg',
    earnRates: [
        { category: 'hotels', multiplier: 10 },
        { category: 'travel', multiplier: 5 },
        { category: 'dining', multiplier: 5 },
        { category: 'gas', multiplier: 5 },
        { category: 'general', multiplier: 3 }
    ], // threshold: hotels = direct IHG spend only; annual $100 statement credit + 10,000 points after $20K spend is not modeled
    signupBonus: { points: 140000, spendRequirement: 3000, months: 3 },
```

Official evidence: the current IHG One Rewards Premier page shows 140,000 points after $3,000 in 3 months, 10X at IHG Hotels and Resorts, 5X on travel, dining, and gas stations, and 3X on all other purchases; the same page also shows the separate annual $100 statement credit plus 10,000 points after $20,000 in calendar-year spend. citeturn11view0

## Open questions and limitations

- **Amex consumer-card signup bonuses are unusually dynamic right now.** For the Platinum, Gold, Green, Marriott Brilliant, and Delta Reserve, the official public sources I retrieved surfaced either “apply and find out your welcome offer,” “as high as,” or an incomplete/variable offer presentation rather than one stable public point amount, so I used `points: 0` where a fixed number was not reliable. citeturn20search17turn19search22turn20search6turn12search1turn20search19
- **Portal-only travel rates cannot be modeled cleanly in the current CardFit schema.** I preserved the closest bucket and left comment notes for Chase Travel, Capital One Travel, CitiTravel, and Amex Travel nuances. citeturn9view0turn9view1turn9view4turn5search6turn7view6turn15view0
- **Hotel and airline co-brand marketing pages often advertise “up to X total” earnings that include non-card points.** I normalized those to the card’s own earning rate where the official source separated card earnings from loyalty-program base or elite bonuses. citeturn10view0turn10view5turn10view7turn11view0turn18search12turn12search14
- **Marriott Brilliant and Citi Strata Premier deserve a quick manual spot-check in-browser if you want a non-zero SUB field.** In both cases, the retrieved official views were enough for earn rates but did not cleanly expose one fixed public bonus amount. citeturn12search1turn3search14