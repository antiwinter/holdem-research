# Holdem Research → React PWA refactor

## Context

The repo is currently a 3-file Node CLI equity calculator (`cards.js`, `equity.js`, `index.js`). We're turning it into a mobile-first React PWA study tool. The CLI moves untouched to `ref/cli/` as an archived, self-contained reference. New app: home page listing study modules — **RFI Chart**, **RFI Practice**, **Equity Practice** (placeholder).

Decisions locked with the user:
- **Naming**: RFI (Raise First In), not "FRI".
- **Range data model**: single source of truth = one ordered list of the 169 hand classes. Percentile = combo-weighted cumulative share (pair 6 / suited 4 / offsuit 12 combos, /1326). Positions = %-cutoffs into that ordering (nested tiers). One editable seed file; user can swap the ranking later.
- **Practice reveal**: both the percentile number and which positions open the hand.
- **Styling**: Tailwind v4.
- **6th stepped color = fold tier** (5 RFI positions: UTG, MP, CO, SB, BTN with monotonic cutoffs UTG 15.4 < MP 17.8 < CO 25.0 < SB 42.0 < BTN 45.0). If the user intended BB as a 6th real position, it's a one-line change in `POSITIONS`.

## Stack (versions verified on npm today)

- Vite `^7` (**not** 8 — vite-plugin-pwa 1.2.0 peer-caps at ^7), `@vitejs/plugin-react`
- React `19.3`, react-dom, `react-router ^8.3` (browser-back works in standalone PWA)
- TypeScript (strict), Tailwind `4.2` via `@tailwindcss/vite` (CSS-first: `@import "tailwindcss"`, no config file)
- `vite-plugin-plugin` → `vite-plugin-pwa ^1.2.0` (generateSW, registerType autoUpdate)
- `ts-fsrs ^5.4.2` (MIT) wrapped by our own thin module
- `vitest` for the two pure-logic modules
- npm; plain localStorage (169 items max — no IndexedDB, no state library)

## Target layout

```
ref/cli/                    # moved as-is: index.js cards.js equity.js + own package.json (git mv)
index.html                  # viewport-fit=cover, apple-touch-icon, theme-color, apple-mobile-web-app-capable
package.json  vite.config.ts  tsconfig.json
public/icons/               # pwa-192.png pwa-512.png maskable-512.png apple-touch-icon.png
src/
  main.tsx  App.tsx  styles.css
  modules/
    home/HomePage.tsx                 # module list; RFI Practice row shows "N due" badge
    rfi-chart/RfiChartPage.tsx        # mode toggle + chart
    rfi-chart/HandGrid.tsx            # 13x13 grid (only consumer → lives here, promote later if reused)
    rfi-practice/RfiPracticePage.tsx  # drill flow
    equity-practice/EquityPracticePage.tsx  # placeholder
  shared/
    cards/cards.ts                    # port of cards.js encode/parse/format (no chalk) + handClass(a,b)
    cards/PlayingCard.tsx             # <PlayingCard card={c}/> white card face, ♠♣ black / ♦♥ red
    cards/cards.test.ts
    range/ranking.ts                  # SEED DATA: HAND_RANKING (169 ordered) + POSITIONS (cutoffs)
    range/range.ts                    # precomputed percentile/tier/positionsFor API
    range/range.test.ts               # 169 classes, distinct, anchors, percentile math
    fsrs/scheduler.ts                 # ts-fsrs wrapper: review(id, 'pass'|'fail'), dueBefore(now) — generic string ids
    fsrs/store.ts                     # versioned localStorage {v:1, cards:Record<id,CardSerialized>}, pub/sub
    fsrs/useFsrs.ts                   # useSyncExternalStore selectors: useDueCount(), useCard(id)
    ui/SegmentedSwitch.tsx            # generic slide toggle (chart mode; reusable later)
.agent/plans/                # copy of approved plan here (AGENTS.md convention)
```

`shared/fsrs` is keyed by generic ids (not hand-specific) so Equity Practice can reuse it later. Chart mode persisted in localStorage.

## Data seed (ranking.ts)

Transcribe a published 169-hand ordering — Sklansky–Chubukov (Wikipedia; retry fetch at implementation, fall back to a public mirror). Verify on load in `range.test.ts`: exactly 169 distinct classes (78 suited-axes convention: `"AA".."22"`, `"AKs".."A2s"` etc.), anchors correct (AA first, 32o last), combo weights sum to 1326, percentile monotone non-decreasing. Ranking is plain editable data — the whole model derives from it.

## Key implementations

**RFI Chart** — page: `min-h-dvh` column, safe-area insets. Chart wrapper `flex-1 container-type:size`; grid `width: min(100cqw, 100cqh); aspect-ratio: 1` (fits both vw and vh with zero JS). Cells: CSS grid `repeat(13, 1fr)`, hand label sized in `cqw` units.
- Gradient mode: cell color `hsl(h, 65%, 48%)`, hue = `140 * (1 - percentile/100)` (premium green → trash red).
- Stepped mode: 6 fixed colors — one per tier UTG/MP/CO/SB/BTN + gray fold; legend row under toggle. Colorblind-safe ramp, finalized visually during implementation.
- `SegmentedSwitch` top center; choice persisted.

**RFI Practice** — one mechanism, no special cases: every grade (pass `Rating.Good`, fail `Rating.Again`) goes through FSRS and creates/updates the hand's card. Next-hand picker: most-overdue card if any, else uniform random over 169 excluding the previous hand. Flow: two large `PlayingCard`s (random combo of the class: pair/suited/offsuit suits correct) → tap card area reveals big percentile + position chips (tier colors) → Pass/Fail enabled only after reveal → next hand. Session footer: seen/due counts.

**FSRS** — `ts-fsrs` defaults (retention 0.9, fuzz off = deterministic per AGENTS.md). Store revives `due`/`last_review` ISO strings to `Date` on read. Verify exact v5 API (`fsrs()`, `createEmptyCard`, `.next(card, now, rating)`) against the ts-fsrs README during implementation.

**PWA** — vite-plugin-pwa manifest (name "Holdem Research", display standalone, 192/512/maskable icons, theme color), generateSW precache, autoUpdate silent. iOS: `viewport-fit=cover` + `env(safe-area-inset-*)` padding, apple-touch-icon, `overscroll-behavior: none`, tap-highlight transparent.

## Implementation order

1. `git mv` CLI → `ref/cli/` + its own package.json; root `.gitignore` += `dist`.
2. Scaffold app (manual, not `create-vite`): package.json, vite.config (react + tailwind + pwa plugins), tsconfig, index.html, styles.css, main/App/router + placeholder pages.
3. `shared/cards` port + tests.
4. `shared/range` (seed + API + tests).
5. Home page.
6. RFI Chart (grid, both modes, toggle, persistence).
7. `shared/fsrs` (scheduler, store, hook).
8. RFI Practice.
9. PWA (icons, manifest, meta, safe-area).
10. Visual polish both modes/orientations; copy plan to `.agent/plans/`.

## Verification

- `cd ref/cli && npm i && node index.js 5s6d as8d7c` — equity output unchanged.
- `npm run dev` in browser (mobile emulation 360×640, tablet, desktop): chart stays square, gradient monotonic, stepped 6 colors + legend, toggle persists across reload; practice reveal shows % + positions, pass/fail advances, failed hand returns promptly (inspect store JSON), Home due-badge correct.
- `npm run build && npm run preview`: SW registers, manifest valid, reload offline works.
- `npx tsc --noEmit && npx vitest run` green.
