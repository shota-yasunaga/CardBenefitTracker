# Agent Guide: CardBenefitTracker

## Project Overview

- Purpose: browser-only app to track credit-card benefits/credits/subscriptions/features.
- Data model: cards contain `benefits[]` with usage flags (`used`, `subscribed`, `activated`).
- Storage: local-only via `localStorage` key `creditCardBenefits`.
- Stack: static HTML + React 18 UMD + Babel standalone + Tailwind CDN.
- No Node build system, package manager, or backend.

## Tech + Runtime Facts

- Main page shell: `index.html`
- Primary JS files loaded by `index.html`:
  - `js/data.js`
  - `js/utils.js`
  - `js/components.js`
  - `js/app.js`
- Styles: `css/styles.css`
- Optional local server: `serve.py` (Python, serves on port 8000 and opens browser)

## Run / Verify

- Quick server:
  - `python3 -m http.server 8000`
  - Open `http://localhost:8000`
- Alternative:
  - `python3 serve.py`
- Test artifacts:
  - `test-suite.html` (automated + manual checks)
  - `test.html` (manual testing notes)

## Architecture Notes

- Global-script architecture (no ES modules/imports). Script load order in `index.html` matters.
- `js/data.js` defines core enums and card catalog:
  - `BENEFIT_FREQUENCY`
  - `BENEFIT_TYPE`
  - `BENEFIT_CATEGORY`
  - `availableCards`
- `js/utils.js` provides date/value helpers (`getCurrentBenefitAmount`, expiration helpers, currency formatting).
- `js/components.js` contains UI components (`BenefitCard`, `CreditCardSection`, modals, settings).
- `js/app.js` owns top-level React state and mounts app with `ReactDOM.createRoot(...).render(<App />)`.

## Source Of Truth Rules

- Treat `js/data.js` as the canonical card/benefit catalog.
- Keep benefit objects consistent:
  - `id`, `name`, `category`, `frequency`, `type`, `value`, `description`
  - usage state fields by type:
    - credit/one-time: `used`
    - subscription: `subscribed`
    - feature: `activated`
- Preserve existing frequency/category/type enum values to avoid UI/filter breakage.

## Known Gotchas (Important)

- `index.html` currently contains a very large inline `<script type="text/babel">` that duplicates app/data logic already present in `js/*`.
- `js/main.js` is another legacy duplicate of app/data logic and is not loaded by `index.html`.
- `README.md` references `js/main.js` as an entry point, but runtime loading is through `index.html` + `js/data.js`/`js/utils.js`/`js/components.js`/`js/app.js`.
- `test-suite.html` duplicates constants instead of importing from app files; keep parity in mind when changing enums.
- `js/utils.js` includes benefit-name-specific logic (example: StubHub credit handling), so benefit renames can affect computed behavior.

## Editing Guidelines For Agents

- Make targeted edits; avoid broad rewrites unless explicitly requested.
- Do not introduce Node-specific tooling unless asked (no existing npm workflow).
- When adding/updating cards:
  - edit `js/data.js`
  - ensure IDs are unique and descriptive
  - verify behavior in `Unused Only`, `Card View`, and `List View`
- When changing display or action logic:
  - update `js/components.js` and/or `js/app.js`
  - confirm localStorage persistence still works
- If touching duplicated areas (inline script / `js/main.js`), call out risk of divergence clearly in your change notes.

## Asset + Research Notes

- Card artwork assets live under `assets/cards/` (SVG and image helper scripts/URLs).
- Card research prompt template lives at `prompts/research-card-benefits.md`.

## Practical Workflow

1. Start server (`python3 -m http.server 8000`).
2. Make minimal change in canonical files (`js/data.js`, `js/utils.js`, `js/components.js`, `js/app.js`).
3. Reload app and validate:
   - add/remove card
   - toggle credit/subscription
   - view-mode switching
   - settings reset actions
4. Run through relevant parts of `test-suite.html`.
5. Document any required sync with duplicate/legacy code paths.
