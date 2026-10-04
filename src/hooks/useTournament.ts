"use client";

import { useCallback, useReducer } from "react";
import { drawMovies } from "@/data/movies";
import { applyVote, createRounds, undoLastVote } from "@/lib/bracket";
import type { BracketSize, Match, MatchResult, Movie, Round, TournamentSource, TournamentState } from "@/types/tournament";

type Action =
  | { type: "start"; source: TournamentSource; size: BracketSize; movies: Movie[] }
  | { type: "vote"; winnerId: string }
  | { type: "undo" }
  | { type: "reset" };

const initialState: TournamentState = {
  phase: "setup",
  source: "imdb-top",
  size: 8,
  rounds: [],
  currentRound: 0,
  activeMatchIndex: 0,
  history: [],
  champion: null,
  runnerUp: null,
};

function reducer(state: TournamentState, action: Action): TournamentState {
  switch (action.type) {
    case "start":
      return {
        ...initialState,
        phase: "playing",
        source: action.source,
        size: action.size,
        rounds: createRounds(action.movies),
      };
    case "vote":
      return applyVote(state, action.winnerId);
    case "undo":
      return undoLastVote(state);
    case "reset":
      return { ...initialState, source: state.source, size: state.size };
  }
}

export interface UseTournament {
  state: TournamentState;
  activeRound: Round | null;
  activeMatch: Match | null;
  completedMatches: number;
  totalMatches: number;
  /** The champion's wins in round order; empty until the tournament is complete. */
  championPath: MatchResult[];
  canUndo: boolean;
  start: (source: TournamentSource, size: BracketSize) => void;
  vote: (winnerId: string) => void;
  undo: () => void;
  reset: () => void;
}

export function useTournament(): UseTournament {
  const [state, dispatch] = useReducer(reducer, initialState);

  // The random draw happens here, outside the reducer, so the reducer stays pure.
  const start = useCallback((source: TournamentSource, size: BracketSize) => {
    dispatch({ type: "start", source, size, movies: drawMovies(source, size) });
  }, []);
  const vote = useCallback((winnerId: string) => dispatch({ type: "vote", winnerId }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const isPlaying = state.phase === "playing";
  const activeRound = isPlaying ? (state.rounds[state.currentRound] ?? null) : null;
  const activeMatch = activeRound?.matches[state.activeMatchIndex] ?? null;
  const championId = state.champion?.id;

  return {
    state,
    activeRound,
    activeMatch,
    completedMatches: state.history.length,
    totalMatches: state.size - 1,
    championPath: championId ? state.history.filter((result) => result.winner.id === championId) : [],
    canUndo: isPlaying && state.history.length > 0,
    start,
    vote,
    undo,
    reset,
  };
}
