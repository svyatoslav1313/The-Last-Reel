# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Last Reel: a single-page, single-elimination movie tournament game. Next.js 16 (App Router, Turbopack), React 19 with the React Compiler enabled, TypeScript, Tailwind CSS v4, Framer Motion, Lucide, canvas-confetti. Entirely client-side and self-contained: no API routes, no env vars, no backend.

## Commands

```bash
npm run dev            # dev server at http://localhost:3000
npm run build          # production build (also type-checks)
npm start              # serve the production build
npm run lint           # eslint (flat config, eslint-config-next)
npx tsc --noEmit       # type-check only
```

There is no test suite. Changes have been verified by driving the built app in a browser (setup → full bracket → victory, at desktop and ~390px widths).

## Architecture

State flows one way: pure engine → reducer hook → `page.tsx` → screen components.

- `src/lib/bracket.ts` is the tournament engine, as pure functions over `TournamentState`: `createRounds` builds the whole tree up front (round 0 seeded, later rounds with `null` slots), `applyVote` records a winner and writes it into the next round's slot, `undoLastVote` reverses the last `history` entry, `formatResults` builds the clipboard summary. Bracket rules belong here, not in components.
- `src/hooks/useTournament.ts` wraps the engine in `useReducer`. The random draw (`drawMovies`) happens in the `start` callback and is passed in the action, so the reducer stays pure. Don't move randomness into the reducer.
- `src/app/page.tsx` is the only route. It switches between three screens on `state.phase` (`setup` → `playing` → `complete`) inside `AnimatePresence mode="wait"`, and owns the UI state that isn't tournament state: the selected source/size on the setup screen and whether the bracket overlay is open. `BracketView` is rendered here as an overlay over both the arena and the victory screen.
- `src/data/movies.ts` holds the embedded movie library (English text) and category presets (ids and showcase posters only). `TournamentSource` is a `CategoryId` or `"random"` (whole library).

### Film music

Optional and user-initiated only (nothing autoplays). No audio is stored in the repo: `src/data/themes.ts` maps movie ids to Apple Music track ids, `lib/themePreview.ts` resolves an id to Apple’s 30-second preview via the public `itunes.apple.com/lookup` endpoint (CORS-enabled, no key, cached per session) and plays it through one shared `<audio>` element kept outside React, and `useThemePlayer` exposes status/toggle/stop to components. The credit line (`NowPlaying`) with the Apple Music link must stay wherever a preview can play. Films without an entry get no play button; lookup or playback failure shows “unavailable”. This is the app’s only runtime network dependency besides poster images. In the arena, music stops on vote and on undo.

### Localization (`src/i18n/`)

English and Russian, switched client-side with no routing. Nothing user-facing is hard-coded in components.

- `types.ts` defines the `Dictionary` interface, `Locale`, and `APP_NAME` (the brand, not translated). `en.ts` and `ru.ts` implement it; TypeScript fails the build if a key is missing in either. Entries that involve numbers or word order are functions (`films(n)`, `roundName(matchCount)`, `headline(title)`); Russian plurals go through `Intl.PluralRules`.
- `useLocale()` returns `{ locale, t, localize }`. The locale is held in a small external store read with `useSyncExternalStore`: the server snapshot is always `en`, the client picks `localStorage["locale"]`, else the browser language. That avoids a hydration mismatch and a setState-in-effect. `setLocale` is exported for `LanguageSwitch`.
- Movie text: `movies.ru.ts` holds Russian titles, directors and synopses keyed by movie id, plus a genre map. Tournament state stores the English `Movie` objects; components call `localize(movie)` at render time. Adding a movie means adding its entry to `movies.ru.ts` too (missing entries fall back to English).
- Round and category names are not stored anywhere: rounds are named from their match count via `t.roundName(round.matches.length)` (`MatchResult.roundMatchCount` for history), categories via `t.categories[id]`.
- `page.tsx` renders `<title>` itself (so it follows the locale; layout metadata has no title) and syncs `<html lang>` in an effect.
- Russian titles can't be declined for case, so Russian strings are phrased to keep titles in the nominative, usually inside «».

### Invariants worth knowing

- Match feeding is positional: match `i` of round `r` feeds match `floor(i/2)` of round `r+1`, slot A if `i` is even, B if odd. Match ids are `r{round}-m{index}`. `BracketView`'s connector lines rely on the same pairing (even index = top of a pair), and on every match cell in a column being equal height (`flex-1`).
- Every category must have at least 16 movies, or `drawMovies` throws for a 16-film bracket. Check the counts when editing a movie's `categories`.
- Poster paths are TMDB file paths served from `image.tmdb.org`, which is the only host allowed in `next.config.ts` `images.remotePatterns`. Always render posters through `components/Poster.tsx`: it fills a positioned, sized parent and swaps to a generated title card on load error. A new image host needs a `remotePatterns` entry.
- In `MatchArena`, a click or keypress sets a local `pick`, plays the winner/loser reaction, then commits via `onVote` after `VOTE_DELAY_MS`. The pick is cleared at commit so that a match re-opened by Undo is votable again. The duel is keyed by `match.id` so `AnimatePresence` slides between matches.
- Keyboard: `1`/`←` and `2`/`→` vote (handled in `MatchArena`, suspended via the `paused` prop while the bracket is open); `B` toggles the bracket (`page.tsx`); `Esc` closes it and Tab is trapped (`BracketView`).
- Quitting mid-tournament goes through `ConfirmDialog` (a generic alertdialog component: focus starts on cancel, Esc cancels, Tab is trapped), not `window.confirm`. `page.tsx` owns its open state and treats it like the bracket: voting keys and `B` are suspended while it is open. Quitting before the first vote skips it.

### Conventions

- Tailwind v4 is configured in CSS, not a config file: theme tokens live in `src/app/globals.css` (`@theme inline`).
- Visual style is minimalist and dark-only: `zinc-950` background with a soft, slowly drifting ambient colour backdrop (`body::before`/`::after` in `globals.css`; keep it low-contrast so text stays readable; on the duel screen `DuelBackdrop` in `MatchArena` layers the two competing posters over it, heavily blurred, one per side, and `VictoryScreen` does the same with the champion’s poster (plus a dark scrim, since pale posters wash out grey text)), hairline `zinc-800` borders, Geist Sans for everything (hierarchy comes from weight, size and `tracking-tight`, not a display font). No gradients, shadows or glows on content. The one exception is the `liquid-glass` utility (`globals.css`), an iOS 26-style translucent blur used only for floating chrome above content: the bracket sheet's close button and blurred backdrop, and the key badges on posters. The arena header is deliberately plain (no background, not sticky). Don't apply it to cards, lists or other content. Primary actions are white pills (`bg-zinc-100 text-zinc-950`); secondary ones are bordered or ghost. Amber (`amber-400`) is the only accent and is reserved for state: the active match, winners, and the champion's path.
- The React Compiler is on (`reactCompiler: true`) and its lint rules are active: no synchronous `setState` in effects and no ref reads during render. Derive values during render instead (see `pickedId` in `MatchArena`).
- Animate only `opacity` and `transform` with Framer Motion, with short ease-out durations rather than springs. `MotionConfig reducedMotion="user"` wraps the app, and confetti uses `disableForReducedMotion`.
- Import alias `@/*` maps to `src/*`.
