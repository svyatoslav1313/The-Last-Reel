export type CategoryId = "cult-sci-fi" | "nineties" | "imdb-top" | "mind-benders";

/** Where a tournament's line-up is drawn from: a preset category or the whole library. */
export type TournamentSource = CategoryId | "random";

export type BracketSize = 8 | 16;

export type TournamentPhase = "setup" | "playing" | "complete";

export interface Movie {
  id: string;
  title: string;
  year: number;
  /** IMDb user rating (snapshot, out of 10). */
  rating: number;
  director: string;
  genres: string[];
  synopsis: string;
  /** TMDB poster file path, e.g. "/abc123.jpg". */
  posterPath: string;
  categories: CategoryId[];
}

/** Display name and description live in the i18n dictionaries, keyed by id. */
export interface Category {
  id: TournamentSource;
  /** Movie ids used for the poster preview on the setup card. */
  showcase: string[];
}

export interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number;
  movieA: Movie | null;
  movieB: Movie | null;
  winnerId: string | null;
}

/** A round's display name is derived from `matches.length` (see `Dictionary.roundName`). */
export interface Round {
  index: number;
  matches: Match[];
}

export interface MatchResult {
  matchId: string;
  roundIndex: number;
  /** Number of matches in the round, which identifies it (1 = final). */
  roundMatchCount: number;
  matchIndex: number;
  winner: Movie;
  loser: Movie;
}

export interface TournamentState {
  phase: TournamentPhase;
  source: TournamentSource;
  size: BracketSize;
  rounds: Round[];
  currentRound: number;
  activeMatchIndex: number;
  /** Every decided match, in the order it was played. */
  history: MatchResult[];
  champion: Movie | null;
  runnerUp: Movie | null;
}
