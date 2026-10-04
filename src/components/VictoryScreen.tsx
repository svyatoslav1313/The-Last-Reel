"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { posterUrl } from "@/data/movies";
import { hasTheme } from "@/data/themes";
import { useThemePlayer } from "@/hooks/useThemePlayer";
import { useLocale } from "@/i18n/useLocale";
import type { MatchResult, Movie } from "@/types/tournament";
import { Poster } from "./Poster";
import { NowPlaying, ThemeIcon } from "./ThemeControls";

const CONFETTI_COLORS = ["#fafafa", "#a1a1aa", "#52525b", "#fbbf24"];

interface VictoryScreenProps {
  champion: Movie;
  runnerUp: Movie;
  /** The champion's wins, in round order. */
  path: MatchResult[];
  sourceName: string;
  size: number;
  /** Plain-text summary placed on the clipboard by "Copy Results". */
  resultsText: string;
  onPlayAgain: () => void;
  onChangeCategory: () => void;
  onOpenBracket: () => void;
}

type CopyStatus = "idle" | "copied" | "failed";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API is unavailable on insecure origins or when permission is denied.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

export function VictoryScreen({
  champion,
  runnerUp,
  path,
  sourceName,
  size,
  resultsText,
  onPlayAgain,
  onChangeCategory,
  onOpenBracket,
}: VictoryScreenProps) {
  const { t, localize } = useLocale();
  const text = localize(champion);
  const player = useThemePlayer();
  const themeStatus = player.statusOf(champion.id);
  const themeActive = themeStatus === "playing" || themeStatus === "loading";
  const copyLabels: Record<CopyStatus, string> = {
    idle: t.victory.copyIdle,
    copied: t.victory.copyDone,
    failed: t.victory.copyFailed,
  };
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    const base = { colors: CONFETTI_COLORS, disableForReducedMotion: true, zIndex: 40 };
    confetti({ ...base, particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.6 } });

    const stopAt = Date.now() + 1500;
    const interval = window.setInterval(() => {
      if (Date.now() > stopAt) {
        window.clearInterval(interval);
        return;
      }
      confetti({ ...base, particleCount: 20, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } });
      confetti({ ...base, particleCount: 20, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } });
    }, 300);

    return () => {
      window.clearInterval(interval);
      confetti.reset();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    const ok = await copyText(resultsText);
    setCopyStatus(ok ? "copied" : "failed");
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyStatus("idle"), 2500);
  };

  return (
    <div className="relative isolate mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-12 sm:px-6 sm:py-20">
      {/*
       * Ambient light from the winner: its poster, heavily blurred, fills the
       * screen and fades in over the shared backdrop (same idea as the duel's
       * DuelBackdrop, with one film instead of two).
       */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Scaled up so the blur's soft edge falls outside the viewport. */}
        <div className="absolute inset-0 scale-125 opacity-40 blur-[80px] saturate-150">
          {/* A tiny source is enough: the blur discards all detail anyway. */}
          <Image src={posterUrl(champion.posterPath, "w342")} alt="" fill sizes="64px" className="object-cover" />
        </div>
        {/* Scrim: keeps text readable when the poster is pale. */}
        <div className="absolute inset-0 bg-zinc-950/35" />
      </motion.div>

      <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative aspect-[2/3] w-52 shrink-0 overflow-hidden rounded-xl ring-1 ring-zinc-800 sm:w-60"
        >
          <Poster movie={champion} eager sizes="240px" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col items-center text-center md:items-start md:text-left"
        >
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="size-2 rounded-full bg-amber-400" aria-hidden />
            {t.victory.kicker} · {sourceName} · {t.films(size)}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
            {t.victory.headline(text.title)}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-zinc-400 md:justify-start">
            <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-1.5 py-0.5 text-xs font-medium text-zinc-200">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
              IMDb {champion.rating.toFixed(1)}
            </span>
            <span className="tabular-nums">{champion.year}</span>
            <span className="text-zinc-500" aria-hidden>
              ·
            </span>
            <span>{text.director}</span>
            <span className="text-zinc-500" aria-hidden>
              ·
            </span>
            <span>{text.genres.join(", ")}</span>
          </div>
          <p className="mt-4 max-w-lg text-pretty text-zinc-400">{text.synopsis}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start">
            <button
              type="button"
              onClick={onPlayAgain}
              className="inline-flex h-10 items-center rounded-full bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white active:bg-zinc-300"
            >
              {t.victory.playAgain}
            </button>
            <SecondaryButton onClick={onChangeCategory}>{t.victory.changeCategory}</SecondaryButton>
            <SecondaryButton onClick={handleCopy}>
              <span aria-live="polite">{copyLabels[copyStatus]}</span>
            </SecondaryButton>
            <SecondaryButton onClick={onOpenBracket}>{t.victory.viewBracket}</SecondaryButton>
            {hasTheme(champion.id) && (
              <button
                type="button"
                onClick={() => player.toggle(champion.id)}
                onPointerEnter={() => player.prefetch(champion.id)}
                onFocus={() => player.prefetch(champion.id)}
                aria-pressed={themeActive}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors ${
                  themeStatus === "playing"
                    ? "border-amber-400 text-amber-400"
                    : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                }`}
              >
                <ThemeIcon status={themeStatus} />
                {themeActive ? t.music.pause : t.music.playTheme}
              </button>
            )}
          </div>
          <NowPlaying player={player} className="mt-3 max-w-full justify-center md:justify-start" />
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        aria-labelledby="recap-heading"
        className="mt-16 grid gap-x-12 gap-y-10 border-t border-zinc-800 pt-8 md:grid-cols-[1fr_260px]"
      >
        <h2 id="recap-heading" className="sr-only">
          {t.victory.recap}
        </h2>

        <div>
          <h3 className="text-sm text-zinc-400">{t.victory.path}</h3>
          <ol className="mt-3 divide-y divide-zinc-800">
            {path.map((result) => (
              <li key={result.matchId} className="flex items-center gap-4 py-3">
                <span className="w-32 shrink-0 text-sm text-zinc-400">{t.roundName(result.roundMatchCount)}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-400">
                  {t.victory.beat}{" "}
                  <span className="font-medium text-zinc-100">{localize(result.loser).title}</span>{" "}
                  <span className="text-zinc-500 tabular-nums">{result.loser.year}</span>
                </span>
                <span className="relative h-9 w-6 shrink-0 overflow-hidden rounded-sm opacity-60 grayscale">
                  <Poster movie={result.loser} sizes="24px" compact />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-sm text-zinc-400">{t.victory.runnerUp}</h3>
          <div className="mt-4 flex items-center gap-4">
            <span className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-zinc-800">
              <Poster movie={runnerUp} sizes="64px" />
            </span>
            <span className="min-w-0">
              <span className="block leading-snug font-medium tracking-tight">{localize(runnerUp).title}</span>
              <span className="mt-1 block text-sm text-zinc-400 tabular-nums">
                {runnerUp.year} · IMDb {runnerUp.rating.toFixed(1)}
              </span>
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function SecondaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center rounded-full border border-zinc-800 px-5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
    >
      {children}
    </button>
  );
}
