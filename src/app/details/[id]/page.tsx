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
        `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
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

  const unhoverButtonStyle = (index: number) => ({
    border: `1px solid ${details ? details.color : 'teal'}`,
    color: `white`,
    backgroundColor: buttonHoverStates[index]
      ? darkenHexColor(details ? details.color : 'teal', 10)
      : darkenHexColor(details ? details.color : 'teal', 0),
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
          <h1 className="text-xl lg:text-4xl md:text-2xl sm:text-xl mb-5">
            {details.title.english}
          </h1>
          <div className="flex gap-5">
            <Image
              className="rounded-md max-w-[150px] max-h-[200px] lg:max-w-[300] lg:max-h-[500] md:max-w-[250px] md:max-h-[350px] sm:max-w-[150px] sm:max-h-[250px]"
              src={details.image}
              alt={details.title.native}
              width={300}
              height={500}
              objectFit="cover"
            />
            <div className="flex flex-col">
              <p
                className={`${
                  details.description.length >= 500 ? 'text-xs' : 'text-sm'
                } md:${
                  details.description.length >= 500 ? 'text-xs' : 'text-sm'
                } lg:${
                  details?.description.length >= 500 ? 'text-xl' : 'text-2xl'
                }`}
                dangerouslySetInnerHTML={{ __html: details.description }}
              />
              <button
                onClick={() =>
                  (window.location.href = `/watch/${details.episodes[0].id}/${details.id}`)
                }
                onMouseEnter={() => handleMouseEnter(99999)}
                onMouseLeave={() => handleMouseLeave(99999)}
                style={unhoverButtonStyle(99999)}
                className="border rounded-full p-2 hover:text-gray-200 transition-colors duration-[0.3s] max-w-32 text-xs md:text-sm lg:text-[18px] lg:p-3"
              >
                Watch now
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-xl lg:text-4xl md:text-2xl sm:text-xl">
              Details
            </h1>
            <div className="mt-2">
              {' '}
              <p className="text-sm md:text-xl lg:text-2xl">
                Studio(s): {details.studios.join(', ')}
              </p>
              <p className="text-sm md:text-xl lg:text-2xl">
                Rating: {details.rating}%
              </p>
              <p className="text-sm md:text-xl lg:text-2xl">
                Season: {details.season}
              </p>
              <p className="text-sm md:text-xl lg:text-2xl">
                Status: {details.status}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 max-h-[100px] max-w-[500px] overflow-y-auto">
            {details.episodes.map((episode, index) => (
              <div key={index}>
                <a key={index} href={`/watch/${episode.id}/${details.id}`}>
                  <button
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    style={buttonStyle(index)}
                    className="border rounded-lg p-2 hover:text-gray-200 transition-colors duration-[0.3s] max-w-32 text-xs md:text-sm lg:text-[18px] lg:p-3"
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
