"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Trophy, X } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import type { Match, Movie, Round } from "@/types/tournament";
import { Poster } from "./Poster";

interface BracketViewProps {
  rounds: Round[];
  /** Id of the match currently being voted on, if the tournament is still running. */
  activeMatchId: string | null;
  champion: Movie | null;
  onClose: () => void;
}

type LineTone = "champion" | "decided" | "pending";

const LINE_COLORS: Record<LineTone, string> = {
  champion: "border-amber-400",
  decided: "border-zinc-600",
  pending: "border-zinc-800",
};

/** Sticky, and padded into the column gaps so connector lines don't show through between headers. */
const COLUMN_HEADER = "sticky top-0 z-10 -mx-6 shrink-0 bg-zinc-950 px-6 pt-5 pb-3";

export function BracketView({ rounds, activeMatchId, champion, onClose }: BracketViewProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Modal behaviour: lock page scroll, move focus in, restore it on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    activeRef.current?.scrollIntoView({ block: "center", inline: "center" });
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button, [tabindex='0']");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const { t, localize } = useLocale();
  const championId = champion?.id ?? null;
  const final = rounds[rounds.length - 1]?.matches[0];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose} aria-hidden />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bracket-title"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="relative flex h-[calc(100dvh-1.5rem)] flex-col rounded-t-[2rem] border border-b-0 border-white/10 bg-zinc-950 sm:h-[calc(100dvh-3rem)]"
      >
        <span className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-white/25" aria-hidden />
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-zinc-800 px-5 pt-2 pb-4 sm:px-6">
          <div>
            <h2 id="bracket-title" className="font-semibold tracking-tight">
              {t.bracket.title}
            </h2>
            <p className="text-sm text-zinc-500">
              {champion ? t.bracket.championLine(localize(champion).title) : t.bracket.advance}
            </p>
          </div>
          <div className="order-last flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 sm:order-none sm:w-auto">
            <LegendItem swatch="border-amber-400" label={t.bracket.active} />
            <LegendItem swatch="border-amber-400 bg-amber-400" label={t.bracket.winner} />
            <LegendItem swatch="border-zinc-700 bg-zinc-800" label={t.bracket.eliminated} />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.bracket.close}
            className="liquid-glass inline-flex size-9 items-center justify-center rounded-full text-zinc-200 transition-colors hover:bg-white/15"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div
          className="flex-1 overflow-auto overscroll-contain px-4 pb-5 sm:px-6"
          tabIndex={0}
          role="group"
          aria-label={t.bracket.treeLabel}
        >
          <div className="mx-auto flex min-h-full w-max gap-12">
            {rounds.map((round, roundIndex) => (
              <section
                key={round.index}
                className="flex w-52 flex-col"
                aria-label={t.roundName(round.matches.length)}
              >
                <div className={COLUMN_HEADER}>
                  <h3 className="text-xs text-zinc-500">{t.roundName(round.matches.length)}</h3>
                </div>
                <div className="flex flex-1 flex-col">
                  {round.matches.map((match) => {
                    const isActive = match.id === activeMatchId;
                    const outgoing: LineTone =
                      championId && match.winnerId === championId
                        ? "champion"
                        : match.winnerId
                          ? "decided"
                          : "pending";
                    const incoming: LineTone =
                      championId && (match.movieA?.id === championId || match.movieB?.id === championId)
                        ? "champion"
                        : match.movieA || match.movieB
                          ? "decided"
                          : "pending";
                    const isTopOfPair = match.matchIndex % 2 === 0;
                    return (
                      <div key={match.id} className="relative flex flex-1 items-center py-2">
                        {roundIndex > 0 && (
                          <span
                            className={`absolute top-1/2 -left-6 w-6 border-t ${LINE_COLORS[incoming]}`}
                            aria-hidden
                          />
                        )}
                        <div ref={isActive ? activeRef : undefined} className="w-full">
                          <MatchBox match={match} isActive={isActive} championId={championId} />
                        </div>
                        {roundIndex < rounds.length - 1 && (
                          <span
                            className={`absolute -right-6 w-6 border-r ${LINE_COLORS[outgoing]} ${
                              isTopOfPair ? "top-1/2 bottom-0 border-t" : "top-0 bottom-1/2 border-b"
                            }`}
                            aria-hidden
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="flex w-40 flex-col" aria-label={t.bracket.champion}>
              <div className={COLUMN_HEADER}>
                <h3 className="text-xs text-zinc-500">{t.bracket.champion}</h3>
              </div>
              <div className="relative flex flex-1 items-center py-2">
                <span
                  className={`absolute top-1/2 -left-12 w-12 border-t ${LINE_COLORS[final?.winnerId ? "champion" : "pending"]}`}
                  aria-hidden
                />
                <ChampionBox champion={champion} />
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MatchBox({ match, isActive, championId }: { match: Match; isActive: boolean; championId: string | null }) {
  const { t } = useLocale();
  return (
    <div
      className={`overflow-hidden rounded-lg border bg-zinc-950 ${isActive ? "border-amber-400" : "border-zinc-800"}`}
      aria-current={isActive ? "true" : undefined}
    >
      {isActive && (
        <span className="flex items-center gap-1.5 border-b border-zinc-800 px-2 py-1 text-[11px] font-medium text-amber-400">
          <span className="size-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden />
          {t.bracket.nowVoting}
        </span>
      )}
      <MatchRow movie={match.movieA} winnerId={match.winnerId} championId={championId} />
      <div className="h-px bg-zinc-800" aria-hidden />
      <MatchRow movie={match.movieB} winnerId={match.winnerId} championId={championId} />
    </div>
  );
}

function MatchRow({ movie, winnerId, championId }: { movie: Movie | null; winnerId: string | null; championId: string | null }) {
  const { t, localize } = useLocale();
  if (!movie) {
    return <div className="flex h-10 items-center px-2.5 text-xs text-zinc-700">{t.bracket.tbd}</div>;
  }
  const title = localize(movie).title;

  const isWinner = winnerId === movie.id;
  const isEliminated = winnerId !== null && !isWinner;
  const onChampionPath = isWinner && movie.id === championId;

  return (
    <div className={`flex h-10 items-center gap-2 px-2 ${isEliminated ? "opacity-40" : ""}`}>
      <span className="relative h-7 w-5 shrink-0 overflow-hidden rounded-sm">
        <Poster movie={movie} sizes="20px" compact className={isEliminated ? "grayscale" : ""} />
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-xs ${
          onChampionPath
            ? "font-medium text-amber-400"
            : isWinner
              ? "font-medium text-zinc-100"
              : isEliminated
                ? "text-zinc-400 line-through"
                : "text-zinc-300"
        }`}
        title={title}
      >
        {title}
      </span>
      {isWinner && (
        <Check className="size-3.5 shrink-0 text-amber-400" strokeWidth={2.5} aria-label={t.bracket.winner} />
      )}
      {isEliminated && <span className="sr-only">{t.bracket.eliminated}</span>}
    </div>
  );
}

function ChampionBox({ champion }: { champion: Movie | null }) {
  const { t, localize } = useLocale();
  if (!champion) {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-800 px-3 py-6 text-center text-xs text-zinc-600">
        <Trophy className="size-4" aria-hidden />
        {t.bracket.awaiting}
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-lg border border-amber-400 bg-zinc-950">
      <div className="relative aspect-[2/3] w-full">
        <Poster movie={champion} sizes="160px" />
      </div>
      <p className="truncate px-2.5 py-2 text-xs font-medium text-amber-400">{localize(champion).title}</p>
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2.5 rounded-sm border ${swatch}`} aria-hidden />
      {label}
    </span>
  );
}
