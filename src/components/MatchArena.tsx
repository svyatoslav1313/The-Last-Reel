"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Network, Star, Undo2, X } from "lucide-react";
import { posterUrl } from "@/data/movies";
import { hasTheme } from "@/data/themes";
import { useThemePlayer, type ThemePlayer } from "@/hooks/useThemePlayer";
import { APP_NAME } from "@/i18n/types";
import { useLocale } from "@/i18n/useLocale";
import type { Match, Movie, Round } from "@/types/tournament";
import { LanguageSwitch } from "./LanguageSwitch";
import { Poster } from "./Poster";
import { NowPlaying, ThemeIcon } from "./ThemeControls";

/** How long the winner/loser reaction plays before the next duel slides in. */
const VOTE_DELAY_MS = 750;

interface MatchArenaProps {
  round: Round;
  match: Match;
  completedMatches: number;
  totalMatches: number;
  canUndo: boolean;
  /** True while the bracket overlay is open; suspends the voting shortcuts. */
  paused: boolean;
  onVote: (winnerId: string) => void;
  onUndo: () => void;
  onOpenBracket: () => void;
  onQuit: () => void;
}

export function MatchArena({
  round,
  match,
  completedMatches,
  totalMatches,
  canUndo,
  paused,
  onVote,
  onUndo,
  onOpenBracket,
  onQuit,
}: MatchArenaProps) {
  const reduceMotion = useReducedMotion();
  const { t } = useLocale();
  const player = useThemePlayer();
  const stopMusic = player.stop;
  const [pick, setPick] = useState<{
    matchId: string;
    winnerId: string;
  } | null>(null);
  const timer = useRef<number | null>(null);
  const pickedId = pick?.matchId === match.id ? pick.winnerId : null;

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const choose = useCallback(
    (winnerId: string) => {
      if (pickedId) return;
      // A theme belongs to its duel; don't let it play on over the next one.
      stopMusic();
      setPick({ matchId: match.id, winnerId });
      timer.current = window.setTimeout(
        () => {
          onVote(winnerId);
          // Cleared so the same match is votable again if the vote is undone.
          setPick(null);
        },
        reduceMotion ? 200 : VOTE_DELAY_MS,
      );
    },
    [pickedId, match.id, onVote, reduceMotion, stopMusic],
  );

  useEffect(() => {
    if (paused) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey)
        return;
      if (event.key === "1" || event.key === "ArrowLeft") {
        if (match.movieA) choose(match.movieA.id);
      } else if (event.key === "2" || event.key === "ArrowRight") {
        if (match.movieB) choose(match.movieB.id);
      } else {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paused, match.movieA, match.movieB, choose]);

  const matchNumber = match.matchIndex + 1;
  const roundName = t.roundName(round.matches.length);
  const matchLabel = t.arena.matchOf(matchNumber, round.matches.length);

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      {match.movieA && match.movieB && (
        <DuelBackdrop
          matchId={match.id}
          movieA={match.movieA}
          movieB={match.movieB}
          pickedId={pickedId}
        />
      )}

      {/* No background of its own: the header sits directly on the duel backdrop. */}
      <nav aria-label={t.arena.navLabel}>
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="hidden md:inline">{APP_NAME}</span>
            <LanguageSwitch className="hidden md:flex" />
          </div>

          <p aria-live="polite" className="min-w-0 truncate text-sm">
            <span className="font-medium text-zinc-100">{roundName}</span>
            <span className="text-zinc-500"> — </span>
            <span className="text-zinc-300">{matchLabel}</span>
          </p>

          <div className="flex shrink-0 items-center">
            <NavButton
              label={t.arena.undo}
              onClick={() => {
                stopMusic();
                onUndo();
              }}
              disabled={!canUndo || pickedId !== null}
            >
              <Undo2 className="size-4" aria-hidden />
            </NavButton>
            <NavButton
              label={t.arena.viewBracket}
              onClick={onOpenBracket}
              text={t.arena.bracket}
            >
              <Network className="size-4" aria-hidden />
            </NavButton>
            <NavButton label={t.arena.quit} onClick={onQuit}>
              <X className="size-4" aria-hidden />
            </NavButton>
          </div>
        </div>
        <div
          role="progressbar"
          aria-label={t.arena.progress}
          aria-valuemin={0}
          aria-valuemax={totalMatches}
          aria-valuenow={completedMatches}
          className="h-px w-full bg-white/10"
        >
          <motion.div
            className="h-full origin-left bg-zinc-100"
            initial={false}
            animate={{ scaleX: completedMatches / totalMatches }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-6 md:py-10">
        <h1 className="sr-only">
          {roundName}, {matchLabel}
        </h1>
        <AnimatePresence mode="wait" initial={false}>
          {match.movieA && match.movieB && (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex w-full flex-col items-center justify-center gap-3 md:flex-row md:items-start md:gap-10 md:[--card:min(40vw,36vh,340px)]"
            >
              <MovieCard
                movie={match.movieA}
                hotkeys={["1", "←"]}
                pickedId={pickedId}
                onChoose={choose}
                player={player}
              />
              {/* On desktop the margin centres "vs" on the posters (height = 1.5 × card width), not on the whole card. */}
              <span
                className="text-xs font-medium tracking-widest text-zinc-400 uppercase md:mt-[calc(var(--card)*0.75_-_0.5rem)]"
                aria-hidden
              >
                {t.arena.vs}
              </span>
              <MovieCard
                movie={match.movieB}
                hotkeys={["2", "→"]}
                pickedId={pickedId}
                onChoose={choose}
                player={player}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <NowPlaying player={player} className="mt-6 max-w-full justify-center" />
        <p className="mt-3 hidden text-xs text-zinc-500 md:block">
          {t.arena.hintPress} <Kbd>1</Kbd> <Kbd>←</Kbd> / <Kbd>2</Kbd>{" "}
          <Kbd>→</Kbd> {t.arena.hintToVote} · <Kbd>B</Kbd> {t.arena.hintBracket}
        </p>
      </main>
    </div>
  );
}

interface DuelBackdropProps {
  matchId: string;
  movieA: Movie;
  movieB: Movie;
  pickedId: string | null;
}

/**
 * Ambient light for the duel: each film's poster, heavily blurred, tints its
 * own side of the screen (top/bottom on mobile). Backdrops cross-fade between
 * matches, and once a vote is cast the loser's colour drains away.
 */
function DuelBackdrop({
  matchId,
  movieA,
  movieB,
  pickedId,
}: DuelBackdropProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={matchId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Scaled up so the blur's soft edge falls outside the viewport. */}
          <div className="absolute inset-0 flex scale-125 flex-col opacity-45 blur-[80px] saturate-150 md:flex-row">
            {[movieA, movieB].map((movie) => (
              <div
                key={movie.id}
                className={`relative flex-1 transition-opacity duration-500 ${
                  pickedId && pickedId !== movie.id ? "opacity-0" : ""
                }`}
              >
                {/* A tiny source is enough: the blur discards all detail anyway. */}
                <Image
                  src={posterUrl(movie.posterPath, "w342")}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface MovieCardProps {
  movie: Movie;
  hotkeys: [string, string];
  pickedId: string | null;
  onChoose: (movieId: string) => void;
  player: ThemePlayer;
}

function MovieCard({
  movie,
  hotkeys,
  pickedId,
  onChoose,
  player,
}: MovieCardProps) {
  const { t, localize } = useLocale();
  const text = localize(movie);
  const isWinner = pickedId === movie.id;
  const isLoser = pickedId !== null && !isWinner;
  const themeStatus = player.statusOf(movie.id);
  const themeActive = themeStatus === "playing" || themeStatus === "loading";

  return (
    // The wrapper exists so the play button can sit over the poster without
    // being nested inside the vote button.
    <div className="relative w-full max-w-md shrink-0 md:w-(--card) md:max-w-none">
      {hasTheme(movie.id) && pickedId === null && (
        <button
          type="button"
          onClick={() => player.toggle(movie.id)}
          onPointerEnter={() => player.prefetch(movie.id)}
          onFocus={() => player.prefetch(movie.id)}
          aria-pressed={themeActive}
          aria-label={themeActive ? t.music.pause : t.music.play(text.title)}
          title={themeActive ? t.music.pause : t.music.play(text.title)}
          className={`liquid-glass absolute bottom-5 left-5 z-10 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/20 md:top-[calc(var(--card)*1.5_-_2.5rem)] md:right-2 md:bottom-auto md:left-auto ${
            themeStatus === "playing" ? "text-amber-400" : "text-zinc-100"
          }`}
        >
          <ThemeIcon status={themeStatus} />
        </button>
      )}
    <motion.button
      type="button"
      onClick={() => onChoose(movie.id)}
      aria-disabled={pickedId !== null}
      aria-label={t.arena.voteFor(text.title, movie.year, movie.rating.toFixed(1))}
      animate={{
        scale: isWinner ? 1.02 : isLoser ? 0.97 : 1,
        opacity: isLoser ? 0.2 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-colors md:flex-col md:items-stretch md:rounded-none md:border-0 md:p-0 ${
        isWinner ? "border-amber-400" : "border-zinc-800"
      }`}
    >
      <div
        className={`relative aspect-[2/3] w-[30%] max-w-[120px] shrink-0 overflow-hidden rounded-lg transition-shadow md:w-full md:max-w-none md:rounded-xl md:ring-1 ${
          isWinner
            ? "md:ring-2 md:ring-amber-400"
            : pickedId
              ? "md:ring-zinc-800"
              : "md:ring-zinc-800 md:group-hover:ring-zinc-400 md:group-focus-visible:ring-zinc-400"
        }`}
      >
        <Poster movie={movie} eager sizes="(min-width: 768px) 340px, 120px" />
        <span
          className="absolute top-2 left-2 hidden gap-1 md:flex"
          aria-hidden
        >
          <Kbd solid>{hotkeys[0]}</Kbd>
          <Kbd solid>{hotkeys[1]}</Kbd>
        </span>
        <AnimatePresence>
          {isWinner && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-amber-400 text-zinc-950"
            >
              <Check className="size-4" strokeWidth={3} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h2 className="text-base leading-snug font-semibold tracking-tight text-balance md:text-xl">
          {text.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-1.5 py-0.5 font-medium text-zinc-200">
            <Star
              className="size-3 fill-amber-400 text-amber-400"
              aria-hidden
            />
            IMDb {movie.rating.toFixed(1)}
          </span>
          <span className="tabular-nums">{movie.year}</span>
          <span className="basis-full md:basis-auto">
            {text.genres.join(", ")}
          </span>
        </div>
        <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400 md:mt-1 md:text-sm">
          {text.synopsis}
        </p>
      </div>
    </motion.button>
    </div>
  );
}

/** `solid` is the glass variant, for badges that sit on top of a poster. */
function Kbd({
  children,
  solid = false,
}: {
  children: React.ReactNode;
  solid?: boolean;
}) {
  return (
    <kbd
      className={`inline-flex h-5 min-w-5 items-center justify-center px-1 font-mono text-[11px] ${
        solid
          ? "liquid-glass rounded-md text-zinc-100"
          : "rounded border border-zinc-700 text-zinc-300"
      }`}
    >
      {children}
    </kbd>
  );
}

interface NavButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  /** Visible text shown next to the icon on wider screens. */
  text?: string;
  disabled?: boolean;
}

function NavButton({
  label,
  onClick,
  children,
  text,
  disabled = false,
}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-md px-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-zinc-100 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
      {text && <span className="hidden sm:inline">{text}</span>}
    </button>
  );
}
