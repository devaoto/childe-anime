interface Anime {
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
  recommendations: Recommendation[];
  characters: Character[];
  relations: Relation[];
  episodes: Episode[];
}

interface Recommendation {
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

interface Character {
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
  voiceActors: VoiceActor[];
}

interface VoiceActor {
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

interface Relation {
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

export interface Episode {
  id: string;
  title: string | null;
  image: string;
  imageHash: string;
  number: number;
  createdAt: string | null;
  description: string | null;
  url: string;
}

interface Source {
  url: string;
  quality: string;
}

interface Subtitle {
  url: string;
  lang: string;
}

interface IntroOutro {
  start: number;
  end: number;
}

interface VideoHeaders {
  [key: string]: string;
}

interface VideoConfig {
  sources: Source[];
  subtitles: Subtitle[];
  audio: any[];
  intro: IntroOutro;
  outro: IntroOutro;
  headers: VideoHeaders;
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

export type { AnifyEpisodeDetail, Anime, VideoConfig };
