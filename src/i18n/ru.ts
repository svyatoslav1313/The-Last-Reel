import { APP_NAME, type Dictionary } from "./types";

const rules = new Intl.PluralRules("ru");

/** Russian has three plural forms: 1 фильм, 2 фильма, 5 фильмов. */
const plural = (count: number, one: string, few: string, many: string) => {
  const rule = rules.select(count);
  return `${count} ${rule === "one" ? one : rule === "few" ? few : many}`;
};

export const ru: Dictionary = {
  code: "RU",
  pageTitle: `${APP_NAME} — кинотурнир`,
  language: "Язык",

  roundName: (matchCount) => {
    switch (matchCount) {
      case 1:
        return "Финал";
      case 2:
        return "Полуфинал";
      case 4:
        return "Четвертьфинал";
      default:
        return `1/${matchCount} финала`;
    }
  },
  films: (count) => plural(count, "фильм", "фильма", "фильмов"),
  duels: (count) => plural(count, "дуэль", "дуэли", "дуэлей"),
  posterAlt: (title, year) => `Постер: ${title} (${year})`,

  categories: {
    "imdb-top": {
      name: "Высшая лига IMDb",
      description:
        "Фильмы с самым высоким рейтингом в коллекции. Каждый выбор будет трудным.",
    },
    "cult-sci-fi": {
      name: "Культовая фантастика",
      description:
        "Научная фантастика, определившая жанр: от монолита Кубрика до гептаподов Вильнёва.",
    },
    nineties: {
      name: "Шедевры 90-х",
      description:
        "Тарантино, Финчер, Спилберг и Скорсезе на пике формы. Все фильмы вышли с 1990 по 1999 год.",
    },
    "mind-benders": {
      name: "Триллеры-головоломки",
      description:
        "Ненадёжные рассказчики, неожиданные развязки и истории, которые хочется пересмотреть.",
    },
    random: {
      name: "Случайный микс",
      description:
        "Случайная выборка из всей коллекции. Ждите очень неравных пар.",
    },
  },

  setup: {
    kicker: "Кинотурнир на выбывание",
    headlineLead: "Два фильма на входе.",
    headlineRest: "Корона — одному.",
    intro:
      "Выберите категорию, пройдите серию дуэлей один на один и узнайте, какой фильм вы на самом деле любите больше всего.",
    start: "Начать турнир",
    lineup: "Подборка",
    bracketSize: "Размер сетки",
    sizeRounds: {
      8: "Четвертьфинал → Полуфинал → Финал",
      16: "1/8 финала → Четвертьфинал → Полуфинал → Финал",
    },
    drawSummary: (size, poolSize) =>
      `${plural(size, "фильм", "фильма", "фильмов")} случайным образом из ${poolSize}.`,
  },

  arena: {
    navLabel: "Турнир",
    matchOf: (matchNumber, total) => `Матч ${matchNumber} из ${total}`,
    undo: "Отменить последний голос",
    viewBracket: "Открыть сетку",
    bracket: "Сетка",
    quit: "Выйти из турнира",
    quitTitle: "Выйти из турнира?",
    quitBody: "Ваши голоса будут потеряны.",
    quitAction: "Выйти",
    quitCancel: "Продолжить",
    progress: "Прогресс турнира",
    voteFor: (title, year, rating) =>
      `Голосовать за «${title}» (${year}), IMDb ${rating}`,
    vs: "vs",
    hintPress: "Нажмите на постер или",
    hintToVote: "для голосования",
    hintBracket: "— сетка",
  },

  bracket: {
    title: "Турнирная сетка",
    advance: "Победители проходят вправо.",
    championLine: (title) => `Корона достаётся фильму «${title}».`,
    active: "Текущий матч",
    winner: "Победитель",
    eliminated: "Выбыл",
    close: "Закрыть сетку",
    treeLabel: "Турнирная сетка, прокручивается",
    champion: "Чемпион",
    tbd: "Определится позже",
    nowVoting: "Идёт голосование",
    awaiting: "Ждём победителя",
  },

  victory: {
    kicker: "Ваш чемпион",
    headline: (title) => `Победитель — «${title}».`,
    playAgain: "Сыграть ещё",
    changeCategory: "Сменить категорию",
    copyIdle: "Скопировать результаты",
    copyDone: "Скопировано",
    copyFailed: "Не удалось скопировать",
    viewBracket: "Турнирная сетка",
    recap: "Итоги турнира",
    path: "Путь к победе",
    beat: "Соперник:",
    runnerUp: "Финалист",
  },

  music: {
    play: (title) => `Включить музыку из фильма «${title}»`,
    pause: "Остановить музыку",
    playTheme: "Музыка из фильма",
    unavailable: "Превью музыки недоступно",
    store: "Apple Music",
  },

  results: {
    champion: "Чемпион",
    runnerUp: "Финалист",
    path: "Путь к победе",
    full: "Все результаты",
    pathLine: (roundName, opponent) => `${roundName}: соперник — ${opponent}`,
    resultLine: (winner, loser) => `${winner} — победа над «${loser}»`,
  },
};
