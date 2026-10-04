# The Last Reel

A single-elimination tournament bracket game for movies. Pick a category, vote through head-to-head duels, crown a champion.

Built with Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, Lucide and canvas-confetti. No API keys or `.env` needed: the movie library is embedded in `src/data/movies.ts`, and posters load from the public TMDB image CDN (with a generated title card as fallback if one fails).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Languages

English and Russian. The language is picked from the browser on first visit, can be changed with the EN / RU switch, and is remembered. Strings live in `src/i18n/` (`en.ts`, `ru.ts`, and `movies.ru.ts` for film titles and synopses).

## Music

Each film in a duel, and the champion, has a play button for a theme from its soundtrack. These are Apple’s official 30-second previews, streamed on demand from Apple with a credit and link; no audio files are included in this project. It needs an internet connection, and two films (Memento, The Usual Suspects) have no track.

## Controls

| Key | Action |
| --- | --- |
| `1` / `←` | Vote for the first film |
| `2` / `→` | Vote for the second film |
| `B` | Toggle the bracket |
| `Esc` | Close the bracket |

## Structure

```
src/
  types/tournament.ts        Movie, Match, Round, TournamentState
  data/movies.ts             Movie library, category presets, random draw
  lib/bracket.ts             Pure bracket engine: build rounds, apply vote, undo, format results
  hooks/useTournament.ts     Reducer-backed hook exposing state and actions
  components/
    TournamentSetup.tsx      Home: category + bracket size
    MatchArena.tsx           Duel screen
    BracketView.tsx          Bracket tree drawer
    VictoryScreen.tsx        Champion reveal and recap
    Poster.tsx               next/image wrapper with fallback
  app/page.tsx               Wires the screens together
```
