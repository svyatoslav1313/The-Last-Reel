import { localizeMovie } from "@/i18n/localizeMovie";
import { APP_NAME, type Dictionary, type Locale } from "@/i18n/types";
import type { Match, MatchResult, Movie, Round, TournamentState } from "@/types/tournament";

/** Builds the full bracket tree: round one is seeded in order, later rounds start empty. */
export function createRounds(movies: Movie[]): Round[] {
  const rounds: Round[] = [];
  for (let matchCount = movies.length / 2, index = 0; matchCount >= 1; matchCount /= 2, index++) {
    const matches: Match[] = Array.from({ length: matchCount }, (_, matchIndex) => ({
      id: `r${index}-m${matchIndex}`,
      roundIndex: index,
      matchIndex,
      movieA: index === 0 ? movies[matchIndex * 2] : null,
      movieB: index === 0 ? movies[matchIndex * 2 + 1] : null,
      winnerId: null,
    }));
    rounds.push({ index, matches });
  }
  return rounds;
}

function cloneRounds(rounds: Round[]): Round[] {
  return rounds.map((round) => ({
    ...round,
    matches: round.matches.map((match) => ({ ...match })),
  }));
}

/** Writes `movie` into the slot of the next round that match (roundIndex, matchIndex) feeds. */
function setAdvancingSlot(rounds: Round[], roundIndex: number, matchIndex: number, movie: Movie | null) {
  const next = rounds[roundIndex + 1]?.matches[Math.floor(matchIndex / 2)];
  if (!next) return;
  if (matchIndex % 2 === 0) next.movieA = movie;
  else next.movieB = movie;
}

export function applyVote(state: TournamentState, winnerId: string): TournamentState {
  if (state.phase !== "playing") return state;

  const round = state.rounds[state.currentRound];
  const match = round?.matches[state.activeMatchIndex];
  if (!match || !match.movieA || !match.movieB || match.winnerId) return state;

  const { movieA, movieB } = match;
  if (winnerId !== movieA.id && winnerId !== movieB.id) return state;
  const winner = winnerId === movieA.id ? movieA : movieB;
  const loser = winnerId === movieA.id ? movieB : movieA;

  const rounds = cloneRounds(state.rounds);
  rounds[state.currentRound].matches[state.activeMatchIndex].winnerId = winner.id;
  setAdvancingSlot(rounds, state.currentRound, state.activeMatchIndex, winner);

  const history: MatchResult[] = [
    ...state.history,
    {
      matchId: match.id,
      roundIndex: round.index,
      roundMatchCount: round.matches.length,
      matchIndex: match.matchIndex,
      winner,
      loser,
    },
  ];

  const isFinal = state.currentRound === rounds.length - 1;
  if (isFinal) {
    return { ...state, rounds, history, phase: "complete", champion: winner, runnerUp: loser };
  }

  const roundFinished = state.activeMatchIndex + 1 >= round.matches.length;
  return {
    ...state,
    rounds,
    history,
    currentRound: roundFinished ? state.currentRound + 1 : state.currentRound,
    activeMatchIndex: roundFinished ? 0 : state.activeMatchIndex + 1,
  };
}

/** Reverts the most recent vote and makes that match active again. */
export function undoLastVote(state: TournamentState): TournamentState {
  const last = state.history[state.history.length - 1];
  if (!last) return state;

  const rounds = cloneRounds(state.rounds);
  rounds[last.roundIndex].matches[last.matchIndex].winnerId = null;
  setAdvancingSlot(rounds, last.roundIndex, last.matchIndex, null);

  return {
    ...state,
    rounds,
    history: state.history.slice(0, -1),
    phase: "playing",
    currentRound: last.roundIndex,
    activeMatchIndex: last.matchIndex,
    champion: null,
    runnerUp: null,
  };
}

export function formatResults(state: TournamentState, t: Dictionary, locale: Locale): string {
  const { champion, runnerUp, history, rounds, size, source } = state;
  if (!champion || !runnerUp) return "";

  const title = (movie: Movie) => localizeMovie(movie, locale).title;
  const label = (movie: Movie) => `${title(movie)} (${movie.year})`;
  const lines = [
    `🏆 ${APP_NAME} — ${t.categories[source].name} · ${t.films(size)}`,
    "",
    `${t.results.champion}: ${label(champion)} — IMDb ${champion.rating.toFixed(1)}`,
    `${t.results.runnerUp}: ${label(runnerUp)}`,
    "",
    `${t.results.path}:`,
    ...history
      .filter((result) => result.winner.id === champion.id)
      .map((result) => `  ${t.results.pathLine(t.roundName(result.roundMatchCount), label(result.loser))}`),
    "",
    `${t.results.full}:`,
  ];

  for (const round of rounds) {
    lines.push(t.roundName(round.matches.length));
    for (const result of history.filter((entry) => entry.roundIndex === round.index)) {
      lines.push(`  ${t.results.resultLine(title(result.winner), title(result.loser))}`);
    }
  }

  return lines.join("\n");
}
