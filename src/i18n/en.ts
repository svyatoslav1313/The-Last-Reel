import { APP_NAME, type Dictionary } from "./types";

const plural = (count: number, one: string, other: string) =>
  `${count} ${count === 1 ? one : other}`;

export const en: Dictionary = {
  code: "EN",
  pageTitle: `${APP_NAME} — Movie Tournament`,
  language: "Language",

  roundName: (matchCount) => {
    switch (matchCount) {
      case 1:
        return "Final";
      case 2:
        return "Semifinals";
      case 4:
        return "Quarterfinals";
      default:
        return `Round of ${matchCount * 2}`;
    }
  },
  films: (count) => plural(count, "film", "films"),
  duels: (count) => plural(count, "duel", "duels"),
  posterAlt: (title, year) => `${title} (${year}) poster`,

  categories: {
    "imdb-top": {
      name: "IMDb Top Tier",
      description:
        "The highest-rated films in the library. Every match-up is a hard call.",
    },
    "cult-sci-fi": {
      name: "Cult Sci-Fi",
      description:
        "Genre-defining science fiction, from Kubrick's monolith to Villeneuve's heptapods.",
    },
    nineties: {
      name: "90s Masterpieces",
      description:
        "Tarantino, Fincher, Spielberg and Scorsese at full power, all released between 1990 and 1999.",
    },
    "mind-benders": {
      name: "Mind-Bending Thrillers",
      description:
        "Unreliable narrators, twist endings and stories that reward a second viewing.",
    },
    random: {
      name: "Random Mix",
      description:
        "A shuffled draw from the entire library. Expect some very unfair pairings.",
    },
  },

  setup: {
    kicker: "Single-elimination movie bracket",
    headlineLead: "Two films enter.",
    headlineRest: "One gets the crown.",
    intro:
      "Pick a category, vote your way through head-to-head duels, and find out which movie you actually love most.",
    start: "Start Tournament",
    lineup: "Line-up",
    bracketSize: "Bracket size",
    sizeRounds: {
      8: "Quarterfinals → Semifinals → Final",
      16: "Round of 16 → Quarters → Semis → Final",
    },
    drawSummary: (size, poolSize) =>
      `${size} films drawn at random from ${poolSize}.`,
  },

  arena: {
    navLabel: "Tournament",
    matchOf: (matchNumber, total) => `Match ${matchNumber} of ${total}`,
    undo: "Undo last vote",
    viewBracket: "View bracket",
    bracket: "Bracket",
    quit: "Quit tournament",
    quitTitle: "Quit this tournament?",
    quitBody: "Your votes so far will be lost.",
    quitAction: "Quit",
    quitCancel: "Keep playing",
    progress: "Tournament progress",
    voteFor: (title, year, rating) =>
      `Vote for ${title} (${year}), IMDb ${rating}`,
    vs: "vs",
    hintPress: "Click a poster or press",
    hintToVote: "to vote",
    hintBracket: "for the bracket",
  },

  bracket: {
    title: "Bracket",
    advance: "Winners advance to the right.",
    championLine: (title) => `${title} takes the crown.`,
    active: "Active match",
    winner: "Winner",
    eliminated: "Eliminated",
    close: "Close bracket",
    treeLabel: "Bracket tree, scrollable",
    champion: "Champion",
    tbd: "To be decided",
    nowVoting: "Now voting",
    awaiting: "Awaiting a winner",
  },

  victory: {
    kicker: "Your champion",
    headline: (title) => `${title} wins it all.`,
    playAgain: "Play Again",
    changeCategory: "Change Category",
    copyIdle: "Copy Results",
    copyDone: "Copied",
    copyFailed: "Couldn't copy",
    viewBracket: "View Bracket",
    recap: "Tournament recap",
    path: "Path to victory",
    beat: "Beat",
    runnerUp: "Runner-up",
  },

  music: {
    play: (title) => `Play the theme from ${title}`,
    pause: "Pause music",
    playTheme: "Play theme",
    unavailable: "Music preview unavailable",
    store: "Apple Music",
  },

  results: {
    champion: "Champion",
    runnerUp: "Runner-up",
    path: "Path to victory",
    full: "Full results",
    pathLine: (roundName, opponent) => `${roundName}: beat ${opponent}`,
    resultLine: (winner, loser) => `${winner} def. ${loser}`,
  },
};
