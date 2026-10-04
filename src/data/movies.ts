import type { BracketSize, Category, Movie, TournamentSource } from "@/types/tournament";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function posterUrl(posterPath: string, size: "w342" | "w500" | "w780" = "w780"): string {
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export const MOVIES: Movie[] = [
  {
    id: "shawshank-redemption",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    director: "Frank Darabont",
    genres: ["Drama", "Crime"],
    synopsis:
      "A banker sentenced to life in Shawshank prison forms an unlikely friendship and quietly refuses to let the walls take his hope.",
    posterPath: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    categories: ["nineties", "imdb-top"],
  },
  {
    id: "the-godfather",
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    director: "Francis Ford Coppola",
    genres: ["Crime", "Drama"],
    synopsis:
      "The reluctant youngest son of a New York mafia dynasty is drawn into the family business after an attempt on his father's life.",
    posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    categories: ["imdb-top"],
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    director: "Christopher Nolan",
    genres: ["Action", "Crime", "Thriller"],
    synopsis:
      "Batman faces the Joker, an anarchist who turns Gotham into a moral experiment and pushes its protector to his breaking point.",
    posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    categories: ["imdb-top"],
  },
  {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.8,
    director: "Quentin Tarantino",
    genres: ["Crime", "Drama"],
    synopsis:
      "Hitmen, a boxer, a gangster's wife and two small-time robbers collide in a set of out-of-order Los Angeles crime stories.",
    posterPath: "/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
    categories: ["nineties", "imdb-top"],
  },
  {
    id: "fight-club",
    title: "Fight Club",
    year: 1999,
    rating: 8.8,
    director: "David Fincher",
    genres: ["Drama", "Thriller"],
    synopsis:
      "An insomniac office worker and a charismatic soap salesman start an underground fight club that spirals into something far bigger.",
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    categories: ["nineties", "imdb-top", "mind-benders"],
  },
  {
    id: "inception",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Action", "Thriller"],
    synopsis:
      "A thief who steals secrets from dreams is offered a clean slate if he can do the opposite: plant an idea in a target's mind.",
    posterPath: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    categories: ["cult-sci-fi", "imdb-top", "mind-benders"],
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    director: "The Wachowskis",
    genres: ["Sci-Fi", "Action"],
    synopsis:
      "A hacker learns that reality is a simulation built to pacify humanity and joins the rebellion against the machines running it.",
    posterPath: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    categories: ["cult-sci-fi", "nineties", "imdb-top", "mind-benders"],
  },
  {
    id: "goodfellas",
    title: "Goodfellas",
    year: 1990,
    rating: 8.7,
    director: "Martin Scorsese",
    genres: ["Crime", "Biography", "Drama"],
    synopsis:
      "The rise and unravelling of mob associate Henry Hill, told across three decades of loyalty, excess and paranoia.",
    posterPath: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
    categories: ["nineties", "imdb-top"],
  },
  {
    id: "se7en",
    title: "Se7en",
    year: 1995,
    rating: 8.6,
    director: "David Fincher",
    genres: ["Crime", "Mystery", "Thriller"],
    synopsis:
      "Two detectives, one retiring and one new to the city, hunt a killer who stages his murders around the seven deadly sins.",
    posterPath: "/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg",
    categories: ["nineties", "imdb-top", "mind-benders"],
  },
  {
    id: "silence-of-the-lambs",
    title: "The Silence of the Lambs",
    year: 1991,
    rating: 8.6,
    director: "Jonathan Demme",
    genres: ["Crime", "Thriller", "Horror"],
    synopsis:
      "An FBI trainee seeks the help of imprisoned cannibal Dr. Hannibal Lecter to catch another serial killer still at large.",
    posterPath: "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    categories: ["nineties", "imdb-top", "mind-benders"],
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    director: "Christopher Nolan",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    synopsis:
      "With Earth dying, a former pilot leaves his children behind to lead a mission through a wormhole in search of a new home.",
    posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    categories: ["cult-sci-fi", "imdb-top"],
  },
  {
    id: "blade-runner",
    title: "Blade Runner",
    year: 1982,
    rating: 8.1,
    director: "Ridley Scott",
    genres: ["Sci-Fi", "Thriller"],
    synopsis:
      "In a rain-soaked future Los Angeles, a burnt-out cop is ordered to hunt down four fugitive replicants who want more life.",
    posterPath: "/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg",
    categories: ["cult-sci-fi"],
  },
  {
    id: "2001-a-space-odyssey",
    title: "2001: A Space Odyssey",
    year: 1968,
    rating: 8.3,
    director: "Stanley Kubrick",
    genres: ["Sci-Fi", "Adventure"],
    synopsis:
      "A mysterious monolith sends a crew toward Jupiter, with the ship's unnervingly calm computer HAL 9000 along for the ride.",
    posterPath: "/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg",
    categories: ["cult-sci-fi"],
  },
  {
    id: "alien",
    title: "Alien",
    year: 1979,
    rating: 8.5,
    director: "Ridley Scott",
    genres: ["Sci-Fi", "Horror"],
    synopsis:
      "The crew of a commercial towing ship answers a distress signal and brings something lethal back on board.",
    posterPath: "/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg",
    categories: ["cult-sci-fi"],
  },
  {
    id: "terminator-2",
    title: "Terminator 2: Judgment Day",
    year: 1991,
    rating: 8.6,
    director: "James Cameron",
    genres: ["Sci-Fi", "Action"],
    synopsis:
      "A reprogrammed Terminator is sent back to protect young John Connor from a relentless liquid-metal assassin.",
    posterPath: "/5M0j0B18abtBI5gi2RhfjjurTqb.jpg",
    categories: ["cult-sci-fi", "nineties", "imdb-top"],
  },
  {
    id: "back-to-the-future",
    title: "Back to the Future",
    year: 1985,
    rating: 8.5,
    director: "Robert Zemeckis",
    genres: ["Sci-Fi", "Adventure", "Comedy"],
    synopsis:
      "A teenager is flung back to 1955 in a time-travelling DeLorean and has to make sure his parents still fall in love.",
    posterPath: "/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg",
    categories: ["cult-sci-fi", "imdb-top"],
  },
  {
    id: "memento",
    title: "Memento",
    year: 2000,
    rating: 8.4,
    director: "Christopher Nolan",
    genres: ["Mystery", "Thriller"],
    synopsis:
      "A man who can't form new memories uses tattoos and Polaroids to track down his wife's killer, in a story told backwards.",
    posterPath: "/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg",
    categories: ["mind-benders"],
  },
  {
    id: "the-prestige",
    title: "The Prestige",
    year: 2006,
    rating: 8.5,
    director: "Christopher Nolan",
    genres: ["Mystery", "Drama", "Thriller"],
    synopsis:
      "Two rival magicians in Victorian London sacrifice everything to outdo each other with the ultimate illusion.",
    posterPath: "/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg",
    categories: ["mind-benders"],
  },
  {
    id: "shutter-island",
    title: "Shutter Island",
    year: 2010,
    rating: 8.2,
    director: "Martin Scorsese",
    genres: ["Mystery", "Thriller"],
    synopsis:
      "A U.S. Marshal investigates a patient's disappearance from an island asylum where nothing, including his own memory, holds still.",
    posterPath: "/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg",
    categories: ["mind-benders"],
  },
  {
    id: "donnie-darko",
    title: "Donnie Darko",
    year: 2001,
    rating: 8.0,
    director: "Richard Kelly",
    genres: ["Sci-Fi", "Mystery", "Drama"],
    synopsis:
      "A troubled teenager survives a freak accident and is told by a figure in a rabbit suit that the world will end in 28 days.",
    posterPath: "/fhQoQfejY1hUcwyuLgpBrYs6uFt.jpg",
    categories: ["cult-sci-fi", "mind-benders"],
  },
  {
    id: "the-truman-show",
    title: "The Truman Show",
    year: 1998,
    rating: 8.2,
    director: "Peter Weir",
    genres: ["Sci-Fi", "Comedy", "Drama"],
    synopsis:
      "An insurance salesman slowly realises his whole life is a television show and everyone he knows is in on it.",
    posterPath: "/vuza0WqY239yBXOadKlGwJsZJFE.jpg",
    categories: ["cult-sci-fi", "nineties", "mind-benders"],
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park",
    year: 1993,
    rating: 8.2,
    director: "Steven Spielberg",
    genres: ["Sci-Fi", "Adventure"],
    synopsis:
      "A preview tour of a theme park of cloned dinosaurs goes catastrophically wrong when the power fails.",
    posterPath: "/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg",
    categories: ["cult-sci-fi", "nineties"],
  },
  {
    id: "forrest-gump",
    title: "Forrest Gump",
    year: 1994,
    rating: 8.8,
    director: "Robert Zemeckis",
    genres: ["Drama", "Romance"],
    synopsis:
      "A kind-hearted Alabama man drifts through decades of American history while never losing sight of his childhood love.",
    posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    categories: ["nineties", "imdb-top"],
  },
  {
    id: "schindlers-list",
    title: "Schindler's List",
    year: 1993,
    rating: 9.0,
    director: "Steven Spielberg",
    genres: ["Biography", "Drama", "History"],
    synopsis:
      "A German industrialist turns his factory into a refuge, saving more than a thousand Jewish workers during the Holocaust.",
    posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    categories: ["nineties", "imdb-top"],
  },
  {
    id: "the-usual-suspects",
    title: "The Usual Suspects",
    year: 1995,
    rating: 8.5,
    director: "Bryan Singer",
    genres: ["Crime", "Mystery", "Thriller"],
    synopsis:
      "The lone talkative survivor of a dockside massacre recounts how five criminals crossed paths with the legendary Keyser Söze.",
    posterPath: "/bUPmtQzrRhzqYySeiMpv7GurAfm.jpg",
    categories: ["nineties", "mind-benders"],
  },
  {
    id: "eternal-sunshine",
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    rating: 8.3,
    director: "Michel Gondry",
    genres: ["Sci-Fi", "Romance", "Drama"],
    synopsis:
      "After a painful breakup, a couple each undergo a procedure to erase the other from memory, and one changes his mind midway.",
    posterPath: "/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg",
    categories: ["cult-sci-fi", "mind-benders"],
  },
  {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    director: "Bong Joon-ho",
    genres: ["Thriller", "Drama", "Comedy"],
    synopsis:
      "A struggling family cons its way into working for a wealthy household, until a secret in the basement upends everything.",
    posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    categories: ["imdb-top", "mind-benders"],
  },
  {
    id: "return-of-the-king",
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    rating: 9.0,
    director: "Peter Jackson",
    genres: ["Fantasy", "Adventure", "Drama"],
    synopsis:
      "As armies gather for the last battle for Middle-earth, Frodo and Sam make the final climb to Mount Doom.",
    posterPath: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    categories: ["imdb-top"],
  },
  {
    id: "12-monkeys",
    title: "12 Monkeys",
    year: 1995,
    rating: 8.0,
    director: "Terry Gilliam",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    synopsis:
      "A convict is sent back in time to trace the origin of a plague that wiped out most of humanity, and starts doubting his sanity.",
    posterPath: "/gt3iyguaCIw8DpQZI1LIN5TohM2.jpg",
    categories: ["cult-sci-fi", "nineties", "mind-benders"],
  },
  {
    id: "mulholland-drive",
    title: "Mulholland Drive",
    year: 2001,
    rating: 7.9,
    director: "David Lynch",
    genres: ["Mystery", "Drama", "Thriller"],
    synopsis:
      "An aspiring actress and an amnesiac woman search Los Angeles for answers in a dream that keeps folding in on itself.",
    posterPath: "/x7A59t6ySylr1L7aubOQEA480vM.jpg",
    categories: ["mind-benders"],
  },
  {
    id: "the-fifth-element",
    title: "The Fifth Element",
    year: 1997,
    rating: 7.6,
    director: "Luc Besson",
    genres: ["Sci-Fi", "Action", "Adventure"],
    synopsis:
      "A 23rd-century cab driver ends up with the key to saving Earth in his back seat: a mysterious woman named Leeloo.",
    posterPath: "/fPtlCO1yQtnoLHOwKtWz7db6RGU.jpg",
    categories: ["cult-sci-fi", "nineties"],
  },
  {
    id: "the-terminator",
    title: "The Terminator",
    year: 1984,
    rating: 8.1,
    director: "James Cameron",
    genres: ["Sci-Fi", "Action"],
    synopsis:
      "A cyborg assassin arrives from 2029 to kill a waitress whose unborn son will one day lead the war against the machines.",
    posterPath: "/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
    categories: ["cult-sci-fi"],
  },
  {
    id: "arrival",
    title: "Arrival",
    year: 2016,
    rating: 7.9,
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    synopsis:
      "A linguist is recruited to communicate with newly arrived aliens, and learning their language changes how she experiences time.",
    posterPath: "/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    categories: ["cult-sci-fi", "mind-benders"],
  },
  {
    id: "saving-private-ryan",
    title: "Saving Private Ryan",
    year: 1998,
    rating: 8.6,
    director: "Steven Spielberg",
    genres: ["War", "Drama"],
    synopsis:
      "After the Normandy landings, a squad of soldiers crosses occupied France to bring home a paratrooper whose brothers have all been killed.",
    posterPath: "/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg",
    categories: ["nineties", "imdb-top"],
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "imdb-top",
    showcase: ["the-godfather", "shawshank-redemption", "the-dark-knight", "schindlers-list"],
  },
  {
    id: "cult-sci-fi",
    showcase: ["blade-runner", "alien", "the-matrix", "2001-a-space-odyssey"],
  },
  {
    id: "nineties",
    showcase: ["pulp-fiction", "goodfellas", "fight-club", "jurassic-park"],
  },
  {
    id: "mind-benders",
    showcase: ["memento", "inception", "shutter-island", "mulholland-drive"],
  },
  {
    id: "random",
    showcase: ["interstellar", "parasite", "back-to-the-future", "se7en"],
  },
];

const MOVIES_BY_ID = new Map(MOVIES.map((movie) => [movie.id, movie]));

export function getMovie(id: string): Movie | undefined {
  return MOVIES_BY_ID.get(id);
}

export function getPool(source: TournamentSource): Movie[] {
  if (source === "random") return MOVIES;
  return MOVIES.filter((movie) => movie.categories.includes(source));
}

/** Picks `size` distinct movies from the source pool in random seed order. */
export function drawMovies(source: TournamentSource, size: BracketSize): Movie[] {
  const pool = [...getPool(source)];
  if (pool.length < size) {
    throw new Error(`"${source}" has ${pool.length} movies, fewer than the ${size} required.`);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}
