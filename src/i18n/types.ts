import type { BracketSize, TournamentSource } from "@/types/tournament";

export const APP_NAME = "The Last Reel";

export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Every user-facing string in the app. Entries that depend on a number, a
 * title or grammar (plurals, word order) are functions rather than templates.
 */
export interface Dictionary {
  /** Short label for the language switch, e.g. "EN". */
  code: string;
  pageTitle: string;
  language: string;

  /** Round name from the number of matches in it: 1 = final, 2 = semifinals, ... */
  roundName: (matchCount: number) => string;
  films: (count: number) => string;
  duels: (count: number) => string;
  posterAlt: (title: string, year: number) => string;

  categories: Record<TournamentSource, { name: string; description: string }>;

  setup: {
    kicker: string;
    headlineLead: string;
    headlineRest: string;
    intro: string;
    start: string;
    lineup: string;
    bracketSize: string;
    sizeRounds: Record<BracketSize, string>;
    /** Follows the category name: "<name>, 8 films drawn at random from 18." */
    drawSummary: (size: number, poolSize: number) => string;
  };

  arena: {
    navLabel: string;
    matchOf: (matchNumber: number, total: number) => string;
    undo: string;
    viewBracket: string;
    bracket: string;
    quit: string;
    /** Quit confirmation dialog: heading, explanation and its two buttons. */
    quitTitle: string;
    quitBody: string;
    quitAction: string;
    quitCancel: string;
    progress: string;
    voteFor: (title: string, year: number, rating: string) => string;
    vs: string;
    /** The hint reads: {hintPress} [1][←] / [2][→] {hintToVote} · [B] {hintBracket} */
    hintPress: string;
    hintToVote: string;
    hintBracket: string;
  };

  bracket: {
    title: string;
    advance: string;
    championLine: (title: string) => string;
    active: string;
    winner: string;
    eliminated: string;
    close: string;
    treeLabel: string;
    champion: string;
    tbd: string;
    nowVoting: string;
    awaiting: string;
  };

  victory: {
    kicker: string;
    headline: (title: string) => string;
    playAgain: string;
    changeCategory: string;
    copyIdle: string;
    copyDone: string;
    copyFailed: string;
    viewBracket: string;
    recap: string;
    path: string;
    /** Label before the beaten film's title in the path list. */
    beat: string;
    runnerUp: string;
  };

  /** Film theme previews. */
  music: {
    play: (title: string) => string;
    pause: string;
    /** Short button label on the victory screen. */
    playTheme: string;
    unavailable: string;
    /** Name of the service the credit link points to. */
    store: string;
  };

  /** Plain-text summary copied to the clipboard. */
  results: {
    champion: string;
    runnerUp: string;
    path: string;
    full: string;
    pathLine: (roundName: string, opponent: string) => string;
    resultLine: (winner: string, loser: string) => string;
  };
}
