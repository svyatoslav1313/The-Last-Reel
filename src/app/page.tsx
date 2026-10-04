"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { BracketView } from "@/components/BracketView";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MatchArena } from "@/components/MatchArena";
import { TournamentSetup } from "@/components/TournamentSetup";
import { VictoryScreen } from "@/components/VictoryScreen";
import { useTournament } from "@/hooks/useTournament";
import { useLocale } from "@/i18n/useLocale";
import { formatResults } from "@/lib/bracket";
import type { BracketSize, TournamentSource } from "@/types/tournament";

const screenTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

export default function Home() {
  const tournament = useTournament();
  const { state, activeRound, activeMatch, championPath } = tournament;
  const { phase } = state;

  const [source, setSource] = useState<TournamentSource>(state.source);
  const [size, setSize] = useState<BracketSize>(state.size);
  const [bracketOpen, setBracketOpen] = useState(false);
  const closeBracket = useCallback(() => setBracketOpen(false), []);
  const [quitOpen, setQuitOpen] = useState(false);
  const cancelQuit = useCallback(() => setQuitOpen(false), []);
  const { locale, t } = useLocale();

  // The server always renders the default locale, so sync <html lang> to the active one.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [phase]);

  // "B" toggles the bracket whenever a tournament exists (not under the quit dialog).
  useEffect(() => {
    if (phase === "setup" || quitOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "b") setBracketOpen((open) => !open);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, quitOpen]);

  const leaveTournament = () => {
    setBracketOpen(false);
    setQuitOpen(false);
    tournament.reset();
  };

  // Nothing to lose before the first vote, so only then skip the confirmation.
  const quit = () => {
    if (state.history.length === 0) leaveTournament();
    else setQuitOpen(true);
  };

  const sourceName = t.categories[state.source].name;

  return (
    <MotionConfig reducedMotion="user">
      {/* Rendered here rather than in layout metadata so it follows the locale; React hoists it into <head>. */}
      <title>{t.pageTitle}</title>
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" {...screenTransition}>
            <TournamentSetup
              source={source}
              size={size}
              onSourceChange={setSource}
              onSizeChange={setSize}
              onStart={() => tournament.start(source, size)}
            />
          </motion.div>
        )}

        {phase === "playing" && activeRound && activeMatch && (
          <motion.div key="arena" {...screenTransition}>
            <MatchArena
              round={activeRound}
              match={activeMatch}
              completedMatches={tournament.completedMatches}
              totalMatches={tournament.totalMatches}
              canUndo={tournament.canUndo}
              paused={bracketOpen || quitOpen}
              onVote={tournament.vote}
              onUndo={tournament.undo}
              onOpenBracket={() => setBracketOpen(true)}
              onQuit={quit}
            />
          </motion.div>
        )}

        {phase === "complete" && state.champion && state.runnerUp && (
          <motion.div key="victory" {...screenTransition}>
            <VictoryScreen
              champion={state.champion}
              runnerUp={state.runnerUp}
              path={championPath}
              sourceName={sourceName}
              size={state.size}
              resultsText={formatResults(state, t, locale)}
              onPlayAgain={() => {
                setBracketOpen(false);
                tournament.start(state.source, state.size);
              }}
              onChangeCategory={leaveTournament}
              onOpenBracket={() => setBracketOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bracketOpen && phase !== "setup" && (
          <BracketView
            rounds={state.rounds}
            activeMatchId={activeMatch?.id ?? null}
            champion={state.champion}
            onClose={closeBracket}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quitOpen && phase === "playing" && (
          <ConfirmDialog
            title={t.arena.quitTitle}
            body={t.arena.quitBody}
            confirmLabel={t.arena.quitAction}
            cancelLabel={t.arena.quitCancel}
            onConfirm={leaveTournament}
            onCancel={cancelQuit}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
