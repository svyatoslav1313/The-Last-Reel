import { MOVIES } from "@/data/movies";
import type { Movie } from "@/types/tournament";
import { GENRES_RU, MOVIES_RU } from "./movies.ru";
import type { Locale } from "./types";

/** English is the source data, so it needs no lookup table. */
const MOVIES_BY_LOCALE: Record<Locale, Map<string, Movie> | null> = {
  en: null,
  ru: new Map(
    MOVIES.map((movie) => [
      movie.id,
      {
        ...movie,
        ...MOVIES_RU[movie.id],
        genres: movie.genres.map((genre) => GENRES_RU[genre] ?? genre),
      },
    ]),
  ),
};

/** Returns the movie with title, director, genres and synopsis in `locale`. */
export function localizeMovie(movie: Movie, locale: Locale): Movie {
  return MOVIES_BY_LOCALE[locale]?.get(movie.id) ?? movie;
}
