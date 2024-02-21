interface AnimeAnilist {
  id: string;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  malId: number;
  synonyms: string[];
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  image: string;
  imageHash: string;
  popularity: number;
  color: string;
  cover: string;
  coverHash: string;
  description: string;
  status: string;
  releaseDate: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  totalEpisodes: number;
  currentEpisode: number;
  rating: number;
  duration: number;
  genres: string[];
  season: string;
  studios: string[];
  subOrDub: string;
  type: string;
  recommendations: RecommendationAnilist[];
  characters: CharacterAnilist[];
  relations: RelationAnilist[];
  episodes: EpisodeAnilist[];
}

interface RecommendationAnilist {
  id: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

interface CharacterAnilist {
  id: number;
  role: string;
  name: {
    first: string;
    last: string | null;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  voiceActors: VoiceActorAnilist[];
}

interface VoiceActorAnilist {
  id: number;
  language: string;
  name: {
    first: string;
    last: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
}

interface RelationAnilist {
  id: number;
  relationType: string;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number | null;
  image: string;
  imageHash: string;
  color: string;
  type: string;
  cover: string;
  coverHash: string;
  rating: number;
}

interface EpisodeAnilist {
  id: string;
  title: string | null;
  image: string;
  imageHash: string;
  number: number;
  createdAt: string | null;
  description: string | null;
  url: string;
}

interface AnifyEpisodeDetail {
  id: string;
  number: number;
  title: string;
  isFiller: boolean;
  img: string | null;
  hasDub: boolean;
  description: string | null;
  rating: number | null;
  updatedAt: number;
}

interface Episode {
  id: string;
  img: string | null;
  title: string;
  hasDub: boolean;
  number: number;
  rating: null | number;
  isFiller: boolean;
  updatedAt: number;
  description: null | string;
}

interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

interface Title {
  native: string;
  romaji: string;
  english: string | null;
}

interface Relation {
  id: string;
  type: string;
  title: Title;
  format: string;
  relationType: string;
}

interface Character {
  name: string;
  image: string;
  voiceActor: {
    name: string;
    image: string;
  };
}

interface Popularity {
  mal: number;
  tmdb: number;
  anilist: number;
}

interface Rating {
  mal: number;
  tmdb: number;
  kitsu: number;
  anilist: number;
}

interface EpisodeData {
  episodes: Episode[];
  providerId: string;
}

interface LatestEpisode {
  updatedAt: number;
  latestTitle: string;
  latestEpisode: number;
}

interface Artwork {
  img: string;
  type: string;
  providerId: string;
}

interface Anime {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  trailer: string;
  status: string;
  season: string;
  title: {
    native: string;
    romaji: string;
    english: string;
  };
  currentEpisode: number;
  mappings: Mapping[];
  synonyms: string[];
  countryOfOrigin: string;
  description: string;
  duration: number;
  color: string;
  year: number;
  rating: Rating;
  popularity: Popularity;
  type: string;
  format: string;
  relations: Relation[];
  totalEpisodes: number;
  genres: string[];
  tags: string[];
  episodes: {
    data: EpisodeData[];
    latest: LatestEpisode;
  };
  averageRating: number;
  averagePopularity: number;
  artwork: Artwork[];
  characters: Character[];
}

export type { Anime, AnifyEpisodeDetail, AnimeAnilist };
