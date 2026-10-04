"use client";

import { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";
import { posterUrl } from "@/data/movies";
import { useLocale } from "@/i18n/useLocale";
import type { Movie } from "@/types/tournament";

interface PosterProps {
  movie: Movie;
  /** Passed to next/image so the browser requests an appropriately sized file. */
  sizes: string;
  eager?: boolean;
  /** Hides the title in the fallback, for thumbnails too small to fit text. */
  compact?: boolean;
  className?: string;
}

/**
 * Fills its (positioned, sized) parent with the movie poster. If the image
 * can't be loaded it swaps to a generated title card instead of a broken icon.
 */
export function Poster(props: PosterProps) {
  // Keyed so a failed load for one movie doesn't stick when the slot shows another.
  return <PosterImage key={props.movie.id} {...props} />;
}

function PosterImage({ movie, sizes, eager = false, compact = false, className = "" }: PosterProps) {
  const [failed, setFailed] = useState(false);
  const { t, localize } = useLocale();
  const title = localize(movie).title;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${title} (${movie.year})`}
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-zinc-900 p-2 text-center ${className}`}
      >
        <Film className={compact ? "size-4 text-zinc-600" : "size-6 text-zinc-600"} aria-hidden />
        {!compact && (
          <>
            <span className="text-sm leading-tight font-medium text-zinc-300">{title}</span>
            <span className="text-xs text-zinc-500">{movie.year}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 animate-pulse bg-zinc-900" aria-hidden />
      <Image
        src={posterUrl(movie.posterPath)}
        alt={t.posterAlt(title, movie.year)}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    </>
  );
}
