'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from 'keep-react';
import { Tooltip } from 'antd';
import Footer from '@/components/footer';

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
  const [episodes, setEpisodes] = useState<AnifyEpisodeDetail[] | null>(null);

  const [buttonHoverStates, setButtonHoverStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
        );
        const data = await response.json();
        console.log('Result', data);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.anify.tv/episodes/${params.id}`
      );

      const results = await response.json();

      const zoroProvider = results.find(
        (provider: { providerId: string }) => provider.providerId === 'zoro'
      );
      const gogoProvider = results.find(
        (provider: { providerId: string }) =>
          provider.providerId === 'gogoanime'
      );

      if (zoroProvider) {
        setEpisodes(zoroProvider?.episodes);
      } else if (gogoProvider) {
        setEpisodes(gogoProvider?.episodes);
      } else {
        return <div>No provider found.</div>;
      }
    })();
  }, [params.id]);

  const handleMouseEnter = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: false }));
  };

  const getColorTypeByGenre = (genre: string): string => {
    const colorTypes = ['gray', 'success', 'warning', 'error', 'info'];
    const genreIndex = details?.genres.indexOf(genre);
    return colorTypes[(genreIndex as number) % colorTypes.length];
  };

  const buttonStyle = (index: number) => {
    const borderColor = details?.color ? details.color : '#008080';
    const baseColor = darkenHexColor(borderColor, 90);
    const hoverColor = darkenHexColor(borderColor, 60);

    return {
      border: `1px solid ${borderColor}`,
      color: 'white',
      backgroundColor: buttonHoverStates[index] ? hoverColor : baseColor,
    };
  };

  const unhoverButtonStyle = (index: number) => {
    const borderColor = details?.color ? details.color : '#008080';
    const baseColor = darkenHexColor(borderColor, 0);
    const hoverColor = darkenHexColor(borderColor, 10);

    return {
      border: `1px solid ${borderColor}`,
      color: 'white',
      backgroundColor: buttonHoverStates[index] ? hoverColor : baseColor,
    };
  };

  return (
    <div
      style={{
        backgroundColor: details?.color
          ? darkenHexColor(details.color, 90)
          : '#000000',
      }}
      className="h-auto"
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
                  (window.location.href = `/watch/${encodeURIComponent(
                    episodes?.[0].id as string
                  )}/${details.id}/1`)
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
              <div className="flex flex-row gap-2 text-xl">
                {details.genres.map((genre) => {
                  const randomColorType = getColorTypeByGenre(genre);
                  return (
                    <Tooltip
                      title={`Search for ${genre}`}
                      placement="top"
                      key={genre}
                    >
                      <a href={`/search?genres=${genre}`}>
                        <Badge
                          size={'xs'}
                          colorType="strong"
                          color={randomColorType}
                        >
                          {genre}
                        </Badge>
                      </a>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 max-h-[100px] max-w-[500px] overflow-y-auto">
            {episodes?.map((episode, index) => (
              <div key={episode.id}>
                <Tooltip
                  title={
                    <h1 className="text-xs">
                      Watch{' '}
                      {details.title.english
                        ? details.title?.english
                        : details?.title.romaji}{' '}
                      episode {index + 1}
                    </h1>
                  }
                  placement="top"
                >
                  <a
                    key={episode.id}
                    href={`/watch/${encodeURIComponent(episode.id)}/${
                      details.id
                    }/${episode.number}`}
                  >
                    <button
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      style={buttonStyle(index)}
                      className="border rounded-lg p-2 hover:text-gray-200 transition-colors duration-[0.3s] max-w-32 text-xs md:text-sm lg:text-[18px] lg:p-3"
                    >
                      Episode {index + 1}
                    </button>
                  </a>
                </Tooltip>
              </div>
            ))}
          </div>
          <Footer />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
