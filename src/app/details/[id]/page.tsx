'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from 'antd';

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

interface Episode {
  id: string;
  title: string | null;
  image: string;
  imageHash: string;
  number: number;
  createdAt: string | null;
  description: string | null;
  url: string;
}

type Props = {
  params: { id: number };
};

function darkenHexColor(hex: string, percent: number) {
  percent = Math.min(100, Math.max(0, percent));

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  let darkness = percent / 100;

  r = Math.round(r * (1 - darkness));
  g = Math.round(g * (1 - darkness));
  b = Math.round(b * (1 - darkness));

  let darkenedHex = `#${((r << 16) | (g << 8) | b)
    .toString(16)
    .padStart(6, '0')}`;

  return darkenedHex;
}

export default function Details({ params }: Readonly<Props>) {
  const [details, setDetails] = useState<Anime | null>(null);
  const [buttonHoverStates, setButtonHoverStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
      );
      const result = await response.json();
      console.log('Result', result);

      setDetails(result);
    })();
  }, [params.id]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}?provider=gogoanime`
      );
      const data = await response.json();
      setList(data);
    })();
  }, [params.id]);

  const episodeRanges = useMemo(() => {
    const numEpisodes = list?.length;
    const rangeCount = Math.ceil(numEpisodes / 100);
    const ranges = [];

    for (let i = 0; i < rangeCount; i++) {
      const start = i * 100 + 1;
      const end = Math.min((i + 1) * 100, numEpisodes);
      ranges.push(`${start}-${end}`);
    }

    return ranges;
  }, [list]);

  const handleMouseEnter = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: false }));
  };

  const buttonStyle = (index: number) => ({
    border: `1px solid ${details ? details.color : 'teal'}`,
    color: `${details ? details.color : 'teal'}`,
    backgroundColor: buttonHoverStates[index]
      ? darkenHexColor(details ? details.color : 'teal', 60)
      : darkenHexColor(details ? details.color : 'teal', 90),
  });

  return (
    <div
      style={{
        backgroundColor: details ? darkenHexColor(details.color, 90) : 'black',
      }}
      className="h-screen"
    >
      {details ? (
        <>
          <h1 className="text-4xl mb-5">{details.title.english}</h1>
          <div className="flex gap-5">
            <Image
              className="rounded-md"
              src={details.image}
              alt={details.title.native}
              width={300}
              height={500}
              objectFit="cover"
            />
            <div className="flex flex-col">
              <p
                className={
                  details.description.length >= 400 ? 'text-xl' : 'text-2xl'
                }
                dangerouslySetInnerHTML={{ __html: details.description }}
              />
              <Button
                type="primary"
                shape="round"
                size="large"
                className="bg-cyan-500 max-w-[160px]"
                href={`/watch/${details?.title.romaji
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9\s]/g, ' ')
                  .replace(/\s+/g, '-')}-episode-1/${details.id}`}
              >
                Watch anime
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-4xl">Details</h1>
            <hr className="w-28" />
            <div className="mt-2">
              {' '}
              <p className="text-2xl">
                Studio(s): {details.studios.join(', ')}
              </p>
              <p className="text-2xl">Rating: {details.rating}%</p>
              <p className="text-2xl">Season: {details.season}</p>
              <p className="text-2xl">Status: {details.status}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {details.episodes.map((episode, index) => (
              <div key={index}>
                <a key={index} href={`/watch/${episode.id}/${details.id}`}>
                  <button
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    style={buttonStyle(index)}
                    className="border rounded-lg p-2 hover:text-gray-200 transition-colors duration-[0.3s]"
                  >
                    Episode {index + 1}
                  </button>
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
