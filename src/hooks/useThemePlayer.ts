"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchThemePreview,
  playPreview,
  stopPreview,
  type ThemeTrack,
} from "@/lib/themePreview";

export type ThemeStatus = "idle" | "loading" | "playing" | "error";

interface PlayerState {
  movieId: string | null;
  status: ThemeStatus;
  track: ThemeTrack | null;
}

const IDLE: PlayerState = { movieId: null, status: "idle", track: null };

// Bumped on every toggle/stop so a slow lookup can tell it has been superseded.
// Module-level because the audio element it guards is shared too.
let latestRequest = 0;

export interface ThemePlayer extends PlayerState {
  /** Status for one film: "idle" unless it is the one loading/playing/failed. */
  statusOf: (movieId: string) => ThemeStatus;
  /** Starts this film's theme, or stops it if it is already playing. Only ever one at a time. */
  toggle: (movieId: string) => void;
  /** Warms the lookup so a later click can start playback without waiting. */
  prefetch: (movieId: string) => void;
  stop: () => void;
}

/** Plays one film theme preview at a time. Music never starts on its own; playback stops on unmount. */
export function useThemePlayer(): ThemePlayer {
  const [state, setState] = useState<PlayerState>(IDLE);

  const stop = useCallback(() => {
    latestRequest++;
    stopPreview();
    setState(IDLE);
  }, []);

  useEffect(() => {
    return () => {
      latestRequest++;
      stopPreview();
    };
  }, []);

  const { movieId: activeId, status } = state;

  const toggle = useCallback(
    async (movieId: string) => {
      if (activeId === movieId && (status === "playing" || status === "loading")) {
        stop();
        return;
      }

      const request = ++latestRequest;
      const isCurrent = () => request === latestRequest;
      stopPreview();
      setState({ movieId, status: "loading", track: null });

      const track = await fetchThemePreview(movieId);
      if (!isCurrent()) return;
      if (!track) {
        setState({ movieId, status: "error", track: null });
        return;
      }

      const started = await playPreview(track.previewUrl, () => setState(IDLE));
      if (!isCurrent()) return;
      setState(
        started
          ? { movieId, status: "playing", track }
          : { movieId, status: "error", track: null },
      );
    },
    [activeId, status, stop],
  );

  const prefetch = useCallback((movieId: string) => {
    void fetchThemePreview(movieId);
  }, []);

  return {
    ...state,
    statusOf: (movieId) => (movieId === activeId ? status : "idle"),
    toggle,
    prefetch,
    stop,
  };
}
