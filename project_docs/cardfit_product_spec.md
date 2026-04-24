# Product Spec Sheet

## Product Name
**CardFit**  
Personalized credit card value calculator and comparison tool

## One-line summary
A static web app that tells a user whether a credit card is **actually net positive for them**, based on their own spending, point valuations, credits, and baseline alternatives.

## Problem
Most credit card comparison sites rank cards using generic assumptions. That breaks down because:
- users value points differently
- users do not fully use every credit
- category spend varies wildly
- a flashy 5x card may still lose to a simple 2% card
- annual fee cards are often not worth it for a specific user

Users need a tool that answers:

**“Given how I spend and what I personally value, is this card actually worth getting or keeping?”**

## Goal
Help users compare cards using their own numbers and show:
- annual reward value
- annual fee drag
- benefit utilization value
- net value
- net gain over a baseline card

---

## 1. Scope

### MVP
A fully static website where a user can:
- enter annual spend by category
- set point values for reward programs
- set utilization/value for credits and perks
- choose a baseline card or flat cashback baseline
- compare cards side by side
- see net annual value and incremental gain
- save/load profiles locally

### Later
- CSV transaction import
- auto-categorization from uploaded exports
- merchant-aware valuation
- linked accounts via Plaid or similar
- card recommendation engine
- wallet optimization across multiple cards

---

## 2. Target User

### Primary user
A rewards-aware consumer who:
- has 1–10 credit cards or is considering new ones
- knows roughly how much they spend in categories
- wants rational math, not affiliate hype

### Secondary user
A points/miles enthusiast who:
- assigns custom cents-per-point values
- wants to model credits honestly
- wants to compare multi-card setups

---

## 3. Core Product Principles

1. **User-defined value wins over marketing value**  
   A $300 travel credit is not worth $300 unless the user can use it.

2. **Baseline matters**  
   A 5% category rate is only meaningful relative to what the user could get otherwise.

3. **Transparency over black box**  
   Every result should show the math breakdown.

4. **Static-first simplicity**  
   No backend for MVP. No auth. No sensitive financial data storage.

5. **Portable user data**  
   Users should be able to export/import their profile as JSON.

---

## 4. Functional Requirements

### 4.1 Spend Input
The app shall allow users to enter annual spending for categories such as:
- dining
- groceries
- gas
- flights
- hotels
- general travel
- transit
- online shopping
- drugstores
- streaming
- mobile phone
- rent
- everything else

The app should also support:
- custom categories
- monthly or annual input mode
- quick presets such as low / medium / high spender

### 4.2 Reward Valuation
The app shall allow users to define:
- cents per point for each reward currency
- cashback value as fixed 1.0 cpp equivalent
- transfer-partner-weighted custom values if desired

Examples:
- Chase UR = 1.7 cpp
- Amex MR = 1.8 cpp
- Hilton = 0.5 cpp
- cashback = 1.0 cpp

### 4.3 Benefit Valuation
The app shall let users assign a usable value to benefits:
- lounge access
- Global Entry / TSA PreCheck
- hotel credits
- rideshare credits
- dining credits
- merchant credits like Lululemon
- free checked bag
- companion pass
- hotel elite status
- travel protections

Each benefit should support:
- face value
- user utilization %
- effective annual value

Formula:

`effective_benefit_value = face_value × utilization_rate × user_adjustment`

### 4.4 Baseline Comparison
The app shall allow the user to define a baseline:
- flat 2% cashback card
- selected existing card
- custom baseline rate by category

The result should show:
- raw value from candidate card
- raw value from baseline
- incremental gain/loss

Example:
- dining card earns 5%
- baseline is 2%
- incremental gain is 3% on dining spend

### 4.5 Card Comparison
The app shall allow users to:
- compare multiple cards side by side
- filter cards by issuer, annual fee, rewards type
- sort by net annual value
- inspect detailed breakdown by category and benefit

### 4.6 Net Value Calculation
For each card:

`net_value = rewards_value + signup_bonus_annualized + benefits_value - annual_fee - opportunity_cost`

For comparison against baseline:

`incremental_net_value = net_value(card) - net_value(baseline)`

### 4.7 Saved Profiles
The app shall allow users to:
- save profile in browser storage
- export profile as JSON
- import profile from JSON

No account required.

---

## 5. Non-Functional Requirements

### Performance
- first load under 2 seconds on broadband for MVP-sized dataset
- recalculation under 100 ms for normal comparison set

### Reliability
- calculations must be deterministic and reproducible
- schema versioning required for JSON data files

### Privacy
- no user data leaves device in MVP
- no analytics required initially, or use privacy-light anonymous analytics only

### Accessibility
- keyboard navigable
- readable tables
- mobile responsive
- color should not be sole signal for “better/worse”

---

## 6. User Stories

### Core
- As a user, I want to enter my annual dining, grocery, and travel spend so I can compare cards accurately.
- As a user, I want to set my own value for Chase points so the results reflect my travel habits.
- As a user, I want to reduce a $300 credit to $120 if I know I won’t fully use it.
- As a user, I want to compare a premium annual-fee card against my 2% cashback baseline.
- As a user, I want to see whether a card is net positive after the annual fee.

### Power-user
- As a user, I want to compare card combos, not just single cards.
- As a user, I want to export my profile and share or back it up.
- As a user, I want detailed per-category contribution math.

---

## 7. Information Architecture

### Main pages
1. **Home**
   - value proposition
   - start comparison button

2. **Compare Cards**
   - card selector
   - filters
   - comparison table

3. **My Profile**
   - annual spend
   - point values
   - benefit valuations
   - baseline settings

4. **Card Detail**
   - earning rates
   - benefits
   - assumptions
   - net value for current profile

5. **Import / Export**
   - download profile JSON
   - upload profile JSON

---

## 8. UX Modules

### Module A: Spend Editor
Fields for annual or monthly spend by category.

### Module B: Reward Value Editor
Inputs for valuation by currency.

### Module C: Benefit Honesty Editor
For each perk:
- face value
- likely usage
- final assigned value

### Module D: Comparison Results
For each card:
- annual fee
- rewards earned
- credits used
- total gross value
- net value
- gain vs baseline

### Module E: Breakdown Drawer
Expandable detail:
- category earnings by spend bucket
- credit contributions
- assumptions used

---

## 9. Static Front-End Architecture

This is the part that matters most for your implementation.

### Recommended stack
- plain HTML/CSS/JS, or React + Vite build output hosted statically
- data files as JSON in `/data`
- state in browser memory + `localStorage`
- optional profile import/export as JSON files

### Suggested folder structure
```txt
/
  index.html
  /assets
  /src
    app.js
    calculator.js
    storage.js
    schema.js
    filters.js
    formatters.js
  /data
    cards.json
    categories.json
    currencies.json
    benefit_definitions.json
    schema_version.json
```

### Client-side data flow
1. app loads static JSON files
2. user profile loads from localStorage or defaults
3. calculator merges:
   - card data
   - user spend
   - user valuations
   - baseline rules
4. app renders ranked results
5. changes trigger instant recalculation

---

## 10. Data Model

### 10.1 `cards.json`
```json
[
  {
    "id": "chase-sapphire-preferred",
    "name": "Chase Sapphire Preferred",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "rewardCurrency": "chase_ur",
    "earnRates": [
      { "category": "dining", "multiplier": 3 },
      { "category": "travel", "multiplier": 2 },
      { "category": "general", "multiplier": 1 }
    ],
    "credits": [
      {
        "id": "hotel_credit",
        "label": "$50 hotel credit",
        "faceValue": 50,
        "type": "fixed_credit"
      }
    ],
    "benefits": [
      {
        "id": "primary_rental_insurance",
        "label": "Primary rental insurance",
        "defaultValue": 0,
        "type": "soft_benefit"
      }
    ],
    "signupBonus": {
      "points": 60000,
      "spendRequirement": 4000,
      "months": 3
    },
    "tags": ["travel", "transfer-points"]
  }
]
```

### 10.2 `user_profile.json`
```json
{
  "schemaVersion": 2,
  "uiFlow": "results",
  "spend": {
    "dining": 6000,
    "groceries": 7200,
    "travel": 4000,
    "gas": 1800,
    "general": 12000
  },
  "currencyValues": {
    "cashback": 0.01,
    "chase_ur": 0.017,
    "amex_mr": 0.018,
    "hilton": 0.005
  },
  "benefitValues": {
    "hotel_credit": {
      "utilization": 0.8,
      "overrideValue": null
    },
    "primary_rental_insurance": {
      "utilization": 0.2,
      "overrideValue": 25
    }
  },
  "baseline": {
    "type": "flat_rate",
    "flatRate": 0.02
  },
  "selectedCards": [
    "chase-sapphire-preferred"
  ]
}
```

### 10.3 `categories.json`
```json
[
  { "id": "dining", "label": "Dining" },
  { "id": "groceries", "label": "Groceries" },
  { "id": "gas", "label": "Gas" },
  { "id": "travel", "label": "Travel" },
  { "id": "general", "label": "Everything Else" }
]
```

---

## 11. Calculation Spec

### Rewards from spend
For each category:

```txt
category_reward_value =
  spend_in_category
  × earning_rate
  × point_value
```

For cashback cards:

```txt
category_reward_value =
  spend_in_category × cashback_rate
```

### Credits
```txt
effective_credit_value =
  face_value × utilization
```

### Benefits
Use either:
- override value if user specifies it
- or default value × utilization

### Annualized signup bonus
Optional first-year mode:

```txt
annualized_signup_bonus_value =
  signup_bonus_points × point_value × probability_of_hitting_bonus
```

You may also want two views:
- **ongoing yearly value**
- **first-year value**

That split is important.

### Final outputs
For each card:
- ongoing rewards value
- ongoing benefits value
- annual fee
- ongoing net value
- first-year bonus value
- first-year net value
- baseline value
- incremental value vs baseline

---

## 12. Important MVP Product Decisions

### Decision 1: separate first-year and ongoing value
Do not mash signup bonus into normal annual value by default.

Show:
- **First Year Net**
- **Ongoing Year Net**

That avoids misleading users.

### Decision 2: benefits must be user-adjustable
Never assume face value for credits.

### Decision 3: use explicit assumptions
Show all assumed point values and utilization rates in one place.

### Decision 4: no transaction sync in MVP
For static-only, avoid fake sophistication. Manual input is enough.

### Decision 5: local-first data
Use `localStorage` for convenience, plus JSON export/import so users do not lose work.

---

## 13. Limitations of Static Hosting

This matters a lot.

### What static hosting is good at
- fast and cheap deployment
- easy hosting on GitHub Pages / Netlify / Vercel static
- zero backend maintenance
- private local-first user data
- great for calculator-style product

### What static hosting cannot do well
- secure account linking to Plaid by itself
- secret API keys
- multi-user cloud profiles
- server-side card data updates from sources
- personalized server storage
- usage analytics tied to identity
- robust anti-abuse controls

### Critical constraint
If you ever want users to connect bank/credit accounts, you will almost certainly need a backend or serverless functions because:
- API secrets cannot live in front-end code
- token exchange flows usually require server-side handling
- transaction data handling becomes more sensitive

So the clean plan is:

**MVP = pure static**

**v2 = static front end + minimal backend/services**

---

## 14. Risks

### Product risks
- users may overtrust calculated results despite incomplete card data
- card benefits are complex and change often
- merchant/category mapping can be ambiguous
- premium card perks are subjective

### Technical risks
- JSON card catalog can drift out of date
- category models can get messy fast
- too many special-case rules will bloat front-end logic

### UX risks
- too many inputs can overwhelm normal users
- power users want detail, casual users want simplicity

### Mitigation
- offer “simple mode” and “advanced mode”
- keep card schema versioned
- show effective assumptions clearly
- add “confidence / assumptions” notes where needed

---

## 15. MVP Roadmap

### Phase 1: Static Calculator Core
Build:
- card JSON schema
- spend editor
- point valuation editor
- benefits valuation editor
- baseline logic
- comparison table
- local save/load

This is the right first release.

### Phase 2: Better Modeling
Add:
- first-year vs ongoing toggle
- card combo comparison
- caps and spend thresholds
- rotating categories
- export/import profile JSON
- sharable read-only URL with encoded config

### Phase 3: Semi-Automation Without Backend
Add:
- CSV upload
- statement parser adapters
- merchant-to-category heuristics in browser
- “suggested values” from imported history

Still static, still safe.

### Phase 4: Backend-Connected Version
Add:
- Plaid or equivalent
- secure token exchange
- encrypted profile sync
- recurring transaction analysis
- merchant-specific benefit detection
- recommended new-card opportunities

---

## 16. Recommendation on Build Strategy

I would build this in this exact order:

1. **single-card comparison with manual spend**
2. **multi-card comparison**
3. **benefit valuation and baseline math**
4. **first-year vs ongoing**
5. **profile export/import**
6. **CSV import**
7. **backend sync later**

That keeps the product honest and actually shippable.

---

## 17. What I would cut from MVP
Do **not** include these at first:
- live bank linking
- automatic transaction categorization from all issuers
- referral links and monetization logic
- complex wallet optimization solver
- account system
- real-time merchant recommendation

Those are tempting and will slow you down badly.

---

## 18. Success Metrics

For MVP:
- user can complete setup in under 5 minutes
- user can compare at least 3 cards in one session
- result page makes it obvious which card is net positive
- at least 80% of test users understand why a result won

For later:
- percentage of users who save/export profile
- repeat usage rate
- CSV import completion rate
- recommendation clickthrough

---

## 19. Crisp PRD Summary

**Build a static, local-first credit card comparison calculator that lets users define their own spend, point values, and perk utilization, then calculates ongoing and first-year net value versus a baseline. Store card metadata in JSON, store user state in localStorage, and postpone backend/account-linking until after the core calculator is solid.**

---

## 20. Strong opinion

Your static-site idea is the right move.

A lot of people sabotage products like this by starting with account sync, auth, and financial integrations. That is backwards. The valuable core is the **valuation engine** and **clear UX for honest assumptions**. Nail that first.
