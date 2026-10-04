/**
 * Apple Music track id of a soundtrack cue for each film, keyed by movie id.
 * Only ids are stored here: the audio is Apple's own 30-second preview,
 * streamed from their CDN when the user presses play (see lib/themePreview).
 * Films without an entry simply get no play button.
 */
export const THEME_TRACK_IDS: Record<string, number> = {
  "shawshank-redemption": 331545686,
  "the-godfather": 1440844663,
  "the-dark-knight": 284530645,
  "pulp-fiction": 1469583198,
  "fight-club": 164363624,
  inception: 380350246,
  "the-matrix": 1443853925,
  goodfellas: 322025962,
  se7en: 1455572890,
  "silence-of-the-lambs": 1443219466,
  interstellar: 1533984393,
  "blade-runner": 73327390,
  "2001-a-space-odyssey": 1394238694,
  alien: 1440854590,
  "terminator-2": 1440895540,
  "back-to-the-future": 1440830086,
  "the-prestige": 1444119965,
  "shutter-island": 1368090483,
  "donnie-darko": 906900619,
  "the-truman-show": 1543477197,
  "jurassic-park": 158331254,
  "forrest-gump": 418557001,
  "schindlers-list": 158331267,
  "eternal-sunshine": 1442912361,
  parasite: 1482778587,
  "return-of-the-king": 3991423,
  "12-monkeys": 1442244103,
  "mulholland-drive": 6773187276,
  "the-fifth-element": 1469434280,
  "the-terminator": 1500818928,
  arrival: 1440758337,
  "saving-private-ryan": 476949813,
};

export function hasTheme(movieId: string): boolean {
  return movieId in THEME_TRACK_IDS;
}
