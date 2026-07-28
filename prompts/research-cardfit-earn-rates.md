# CardFit earn rates & signup bonus research

## Task

For each **catalog card** in `js/data.js` (`availableCards` keys), research current issuer terms and output **ready-to-paste** JavaScript fields for CardFit:

- `rewardCurrency` — one of the IDs in `REWARD_CURRENCIES` inside `js/cardfit-data.js` (e.g. `chase_ur`, `amex_mr`, `citi_typ`, `capital_one_miles`, `hilton`, `marriott`, `hyatt`, `cashback`).
- `earnRates` — array of `{ category, multiplier }` using **only** these canonical `category` values:  
  `dining`, `groceries`, `gas`, `flights`, `hotels`, `travel`, `transit`, `online_shopping`, `drugstores`, `streaming`, `mobile_phone`, `rent`, `general`.  
  Real issuer categories must be **mapped** to the closest bucket (e.g. “U.S. supermarkets” → `groceries`). Always include a `general` (or 1x) line as catch-all.
- `signupBonus` — `{ points, spendRequirement, months }` in issuer units (points or miles; if cash SUB, use `points: dollarAmount` and document). Use `0` for placeholders you cannot verify.

## Output format (per card)

Paste **inside** the matching card object in `js/data.js`, after `color:` and before `benefits:`:

```js
    // cardfit: last verified YYYY-MM-DD from [issuer page URL]
    rewardCurrency: 'chase_ur',
    earnRates: [
        { category: 'dining', multiplier: 3 },
        { category: 'travel', multiplier: 2 },
        { category: 'general', multiplier: 1 }
    ], // cap: (if any) e.g. groceries 6% on first $6k/yr — TODO(cardfit-caps) when app supports caps
    signupBonus: { points: 60000, spendRequirement: 4000, months: 3 },
```

Use **end-of-line comments** to flag:

- `// cap: ...` — category spend caps, bonus caps  
- `// rot: ...` — rotating 5% categories, quarterly activation  
- `// threshold: ...` — high-spend bonus tiers  

So future work on `TODO(cardfit-caps)` / `TODO(cardfit-rotating)` can use your notes.

## Card IDs to cover (all keys in `availableCards`)

1. `chase-sapphire-reserve`
2. `amex-platinum`
3. `amex-gold`
4. `capital-one-venture-x`
5. `chase-sapphire-preferred`
6. `united-quest`
7. `citi-strata-premier`
8. `amex-green`
9. `amex-business-platinum`
10. `hilton-aspire`
11. `marriott-brilliant`
12. `world-of-hyatt`
13. `ihg-premier`
14. `amex-delta-reserve`
15. `united-club-infinite`

## Research rules

1. Prefer **issuer** pages and official benefit guides; avoid affiliate blogs as primary.
2. Note the **as-of** date; benefits change—state uncertainty briefly per card in a one-line `//` comment if needed.
3. For **miles** cards, `rewardCurrency` should match a defined ID (add a new `REWARD_CURRENCIES` entry in `js/cardfit-data.js` if you introduce e.g. `united_miles` with a default cpp, and document the default you chose).
4. Distinguish **points** (multiplier × spend × cpp) from **true cashback** (use `cashback` currency and `multiplier` as decimal percent, e.g. `0.02` = 2%).

## Deliverable

A single markdown or text response with one block per `id`, plus a short bullet list of **open questions** (e.g. SUB not public, N/A outside US).
