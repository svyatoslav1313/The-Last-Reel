"use client";

import { ArrowUpRight, LoaderCircle, Music, Pause, Play, VolumeX } from "lucide-react";
import type { ThemePlayer, ThemeStatus } from "@/hooks/useThemePlayer";
import { useLocale } from "@/i18n/useLocale";

export function ThemeIcon({ status, className = "size-3.5" }: { status: ThemeStatus; className?: string }) {
  switch (status) {
    case "loading":
      return <LoaderCircle className={`${className} animate-spin`} aria-hidden />;
    case "playing":
      return <Pause className={`${className} fill-current`} aria-hidden />;
    case "error":
      return <VolumeX className={className} aria-hidden />;
    default:
      return <Play className={`${className} fill-current`} aria-hidden />;
  }
}

/**
 * Credit line for whatever is playing: track, artist and a link to it on Apple
 * Music. Keeps its height when empty so the layout doesn't jump.
 */
export function NowPlaying({ player, className = "" }: { player: ThemePlayer; className?: string }) {
  const { t } = useLocale();
  const { status, track } = player;

  return (
    <p aria-live="polite" className={`flex min-h-5 items-center gap-1.5 text-xs text-zinc-400 ${className}`}>
      {status === "error" && t.music.unavailable}
      {status === "playing" && track && (
        <>
          <Music className="size-3.5 shrink-0 text-amber-400" aria-hidden />
          <span className="min-w-0 truncate">
            <span className="text-zinc-200">{track.name}</span> — {track.artist}
          </span>
          {track.storeUrl && (
            <a
              href={track.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-0.5 text-zinc-300 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-100"
            >
              {t.music.store}
              <ArrowUpRight className="size-3" aria-hidden />
            </a>
          )}
        </>
      )}
    </p>
  );
}
