# Agent Guide: CardBenefitTracker

## Project Overview

- Purpose: browser-only app to track credit-card benefits/credits/subscriptions/features.
- Data model: cards contain `benefits[]` with usage flags (`used`, `subscribed`, `activated`).
- Storage: local-only via `localStorage` key `creditCardBenefits`.
- Stack: static HTML + React 18 UMD + Babel standalone + Tailwind CDN.
- No runtime build step or backend. Node is used only for dev-time testing/CI tooling (Playwright + http-server + Husky); the app itself still runs as static files.

## Tech + Runtime Facts

- Main page shell: `index.html`
- Primary JS files loaded by `index.html`:
  - `js/data.js`
  - `js/utils.js`
  - `js/components.js`
  - `js/app.js`
- Styles: `css/styles.css`
- Optional local server: `serve.py` (Python, serves on port 8000 and opens browser)
- Dev tooling: `package.json`, `playwright.config.js`, `tests/test-suite.spec.js`, `.husky/pre-push`, `.github/workflows/ci.yml`

## Run / Verify

- Quick server:
  - `python3 -m http.server 8000`
  - Open `http://localhost:8000`
- Alternative:
  - `python3 serve.py`
- Test artifacts:
  - `test-suite.html` (browser-based automated tests; rendered list + `#test-summary` DOM)
  - `test.html` (manual testing notes)
- Automated run (headless, matches CI):
  - One-time: `npm install` (also installs Husky pre-push hook via `prepare`)
  - One-time: `npx playwright install chromium`
  - `npm test` — boots `http-server` on `127.0.0.1:4173`, drives `test-suite.html` in Chromium, asserts `Failed == 0`

## Testing + CI

- The only source of automated tests today is `test-suite.html`. The Playwright spec just drives that harness; do not split test logic between the two.
- `tests/test-suite.spec.js` asserts:
  - `#test-summary` shows `Failed: 0`
  - `Total Tests >= 7` (sanity: suite actually ran)
  - no `.test-fail` rows rendered
- When adding a new test case:
  1. Add a `testXxx()` function and call it from `runAllTests()` in `test-suite.html` (duplicate any helpers there; the harness intentionally re-declares enums/utilities).
  2. Use timezone-safe date literals (e.g. midday UTC like `YYYY-MM-15T12:00:00Z`), since the suite runs locally (varied TZ) and in CI (UTC). Midnight-UTC boundary dates have caused false failures.
  3. Bump the `>= 7` minimum in `tests/test-suite.spec.js` only if you want to enforce that the new test actually executed.
- GitHub Actions workflow: `.github/workflows/ci.yml`
  - Triggers on push to `master` and all pull requests.
  - Node 20, `npm ci`, `npx playwright install --with-deps chromium`, `npm test`.
  - Uploads `playwright-report/` as an artifact on failure.
  - Concurrency-cancels older runs on the same ref.
- Local pre-push hook: `.husky/pre-push` runs `npm test` before `git push`. If it fails the push is aborted. Bypass (rare) with `git push --no-verify`.
- The hook is installed automatically by `npm install` via the `prepare` script. If a teammate skips `npm install`, they won't get the hook — but CI will still catch regressions.
- Do not commit `node_modules/`, `playwright-report/`, `test-results/`, `.playwright/`, or `.husky/_/` (Husky-generated dispatcher). All are gitignored.

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
- The runtime app must remain static (no bundler, no imports). Node tooling is strictly dev-only: do not add runtime dependencies or a build step.
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
4. Run through relevant parts of `test-suite.html` (manually in the browser and/or headless via `npm test`).
5. Document any required sync with duplicate/legacy code paths.
6. Before pushing, `npm test` runs automatically via the Husky pre-push hook; the same suite runs again in GitHub Actions.
