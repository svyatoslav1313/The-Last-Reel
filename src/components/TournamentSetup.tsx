"use client";

import { motion } from "framer-motion";
import {
  Award,
  Brain,
  Clapperboard,
  Rocket,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, getMovie, getPool } from "@/data/movies";
import { APP_NAME } from "@/i18n/types";
import { useLocale } from "@/i18n/useLocale";
import type { BracketSize, TournamentSource } from "@/types/tournament";
import { LanguageSwitch } from "./LanguageSwitch";
import { Poster } from "./Poster";

const CATEGORY_ICONS: Record<TournamentSource, LucideIcon> = {
  "imdb-top": Award,
  "cult-sci-fi": Rocket,
  nineties: Clapperboard,
  "mind-benders": Brain,
  random: Shuffle,
};

const SIZES: BracketSize[] = [8, 16];

const OPTION_BASE = "rounded-xl border text-left transition-colors";
const OPTION_IDLE = "border-zinc-800 hover:border-zinc-600";
const OPTION_SELECTED = "border-zinc-100 bg-zinc-900";

interface TournamentSetupProps {
  source: TournamentSource;
  size: BracketSize;
  onSourceChange: (source: TournamentSource) => void;
  onSizeChange: (size: BracketSize) => void;
  onStart: () => void;
}

export function TournamentSetup({
  source,
  size,
  onSourceChange,
  onSizeChange,
  onStart,
}: TournamentSetupProps) {
  const { t } = useLocale();
  const selectedName = t.categories[source].name;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 pb-20 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
        <LanguageSwitch />
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-start py-16 sm:py-24"
      >
        <p className="text-sm text-zinc-500">{t.setup.kicker}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          {t.setup.headlineLead}{" "}
          <span className="text-zinc-500">{t.setup.headlineRest}</span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-pretty text-zinc-400 sm:text-lg">
          {t.setup.intro}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <StartButton label={t.setup.start} onStart={onStart} />
          <p className="text-sm text-zinc-500">
            {selectedName} · {t.films(size)} · {t.duels(size - 1)}
          </p>
        </div>
      </motion.section>

      <section aria-labelledby="category-heading">
        <h2 id="category-heading" className="mb-4 text-sm text-zinc-500">
          {t.setup.lineup}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            const isSelected = category.id === source;
            const text = t.categories[category.id];
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSourceChange(category.id)}
                className={`${OPTION_BASE} flex flex-col p-5 ${isSelected ? OPTION_SELECTED : OPTION_IDLE}`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`size-5 ${isSelected ? "text-zinc-100" : "text-zinc-500"}`}
                    aria-hidden
                  />
                  <span
                    className={`flex size-4 items-center justify-center rounded-full border ${
                      isSelected ? "border-zinc-100" : "border-zinc-700"
                    }`}
                    aria-hidden
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-zinc-100" />
                    )}
                  </span>
                </div>
                <h3 className="mt-5 font-medium tracking-tight">{text.name}</h3>
                <p className="mt-1 flex-1 text-sm text-zinc-500">
                  {text.description}
                </p>
                <div className="mt-5 flex items-end justify-between">
                  <div className="flex gap-1.5">
                    {category.showcase.map((id) => {
                      const movie = getMovie(id);
                      if (!movie) return null;
                      return (
                        <div
                          key={id}
                          className="relative h-12 w-8 overflow-hidden rounded"
                        >
                          <Poster movie={movie} sizes="32px" compact />
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs text-zinc-500 tabular-nums">
                    {t.films(getPool(category.id).length)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="size-heading" className="mt-12">
        <h2 id="size-heading" className="mb-4 text-sm text-zinc-500">
          {t.setup.bracketSize}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SIZES.map((option) => {
            const isSelected = option === size;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSizeChange(option)}
                className={`${OPTION_BASE} flex items-center gap-5 p-5 ${isSelected ? OPTION_SELECTED : OPTION_IDLE}`}
              >
                <span
                  className={`w-12 shrink-0 text-4xl font-semibold tracking-tight tabular-nums ${
                    isSelected ? "text-zinc-100" : "text-zinc-600"
                  }`}
                  aria-hidden
                >
                  {option}
                </span>
                <span>
                  <span className="block font-medium tracking-tight">
                    {t.films(option)} · {t.duels(option - 1)}
                  </span>
                  <span className="mt-0.5 block text-sm text-zinc-500">
                    {t.setup.sizeRounds[option]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-500">
          <span className="text-zinc-100">{selectedName}</span>,{" "}
          {t.setup.drawSummary(size, getPool(source).length)}
        </p>
        <StartButton label={t.setup.start} onStart={onStart} />
      </div>
    </div>
  );
}

function StartButton({
  label,
  onStart,
}: {
  label: string;
  onStart: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="inline-flex h-11 shrink-0 items-center rounded-full bg-zinc-100 px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-white active:bg-zinc-300"
    >
      {label}
    </button>
  );
}
