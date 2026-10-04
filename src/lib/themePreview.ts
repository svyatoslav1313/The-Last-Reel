import { THEME_TRACK_IDS } from "@/data/themes";

export interface ThemeTrack {
  name: string;
  artist: string;
  /** Apple's 30-second preview stream. */
  previewUrl: string;
  /** Track page on Apple Music, shown as the credit link. */
  storeUrl: string;
}

const LOOKUP_URL = "https://itunes.apple.com/lookup";

/** One request per film per session; failures are cached too so we don't hammer the API. */
const cache = new Map<string, Promise<ThemeTrack | null>>();

async function lookup(trackId: number): Promise<ThemeTrack | null> {
  try {
    const response = await fetch(`${LOOKUP_URL}?id=${trackId}`);
    if (!response.ok) return null;
    const data: { results?: Record<string, unknown>[] } = await response.json();
    const track = data.results?.[0];
    if (!track || typeof track.previewUrl !== "string") return null;
    return {
      name: String(track.trackName ?? ""),
      artist: String(track.artistName ?? ""),
      previewUrl: track.previewUrl,
      storeUrl: String(track.trackViewUrl ?? ""),
    };
  } catch {
    // Offline, blocked, or rate-limited: the caller shows "unavailable".
    return null;
  }
}

/** Resolves the preview for a film's theme, or null if there is none or it can't be fetched. */
export function fetchThemePreview(movieId: string): Promise<ThemeTrack | null> {
  const trackId = THEME_TRACK_IDS[movieId];
  if (trackId === undefined) return Promise.resolve(null);
  let pending = cache.get(movieId);
  if (!pending) {
    pending = lookup(trackId);
    cache.set(movieId, pending);
  }
  return pending;
}

/*
 * Playback goes through a single shared <audio> element, kept outside React:
 * only one theme can ever sound at a time, across every screen.
 */
const VOLUME = 0.7;
let audio: HTMLAudioElement | null = null;
let onEnded: (() => void) | null = null;

/** Starts a preview stream. Resolves false if the browser refuses or the stream fails. */
export async function playPreview(url: string, ended: () => void): Promise<boolean> {
  if (!audio) {
    audio = new Audio();
    audio.volume = VOLUME;
    audio.addEventListener("ended", () => onEnded?.());
  }
  onEnded = ended;
  audio.src = url;
  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function stopPreview() {
  onEnded = null;
  audio?.pause();
}
