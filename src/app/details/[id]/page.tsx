'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from 'keep-react';
import { Tooltip } from 'antd';
import Footer from '@/components/footer';
import { decodeIds } from '@/lib/functions/decode';
import { encodeIds } from '@/lib/functions/encode';

import {
  Anime,
  AnifyEpisodeDetail,
  AnimeAnilist
} from '@/lib/types/details.types';
import { Episode } from '@/lib/types/watch.types';

type Props = {
  params: { id: string };
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
  const [details, setDetails] = useState<Anime | AnimeAnilist | null>(null);
  const [episodes, setEpisodes] = useState<
    AnifyEpisodeDetail[] | Episode[] | null
  >(null);

  const [buttonHoverStates, setButtonHoverStates] = useState<{
    [key: string]: boolean;
  }>({});

  const decodedId = decodeIds(
    decodeURIComponent(params.id),
    process.env.NEXT_PUBLIC_SECRET_KEY as string
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.anify.tv/info/${decodedId?.id}`
        );
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        const response = await fetch(
          `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${decodedId?.id}`
        );
        const data = await response.json();

        setDetails(data);
      }
    };

    fetchData();
  }, [decodedId?.id]);

  useEffect(() => {
    (async () => {
      try {
        const zoroProvider = (details as Anime).episodes.data.find(
          (provider: { providerId: string }) => provider.providerId === 'zoro'
        );
        const gogoProvider = (details as Anime).episodes.data.find(
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
      } catch (error) {
        try {
          const response = await fetch(
            `https://api.anify.tv/episodes/${decodedId?.id}`
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
        } catch (error) {
          const episodes = (details as AnimeAnilist).episodes;

          setEpisodes(episodes);
        }
      }
    })();
  }, [decodedId?.id, details]);

  const handleMouseEnter = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: false }));
  };

  console.log('Details', details);

  const getColorTypeByGenre = (genre: string): string => {
    const colorTypes = ['gray', 'success', 'warning', 'error', 'info'];
    const genreIndex = details?.genres?.indexOf(genre);
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
            {details.title?.english}
          </h1>
          <div className="flex gap-5">
            <Image
              className="rounded-md max-w-[150px] max-h-[200px] lg:max-w-[300] lg:max-h-[500] md:max-w-[250px] md:max-h-[350px] sm:max-w-[150px] sm:max-h-[250px]"
              src={
                (details as Anime).coverImage
                  ? (details as Anime).coverImage
                  : (details as AnimeAnilist).image
              }
              alt={details.title?.native as string}
              width={300}
              height={500}
              objectFit="cover"
            />
            <div className="flex flex-col">
              <p
                dangerouslySetInnerHTML={{
                  __html: details.description,
                }}
              />

              <button
                onClick={() =>
                  (window.location.href = `/watch/${encodeURIComponent(
                    encodeIds(
                      Number(details.id),
                      process.env.NEXT_PUBLIC_SECRET_KEY as string,
                      encodeURIComponent(episodes?.[0].id as string)
                    )
                  )}/1`)
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
                Rating:{' '}
                {(details as Anime).rating.anilist
                  ? `${(details as Anime).rating.anilist}/10`
                  : `${(details as AnimeAnilist).rating}%`}
              </p>
              <p className="text-sm md:text-xl lg:text-2xl">
                Season: {details.season}
              </p>
              <p className="text-sm md:text-xl lg:text-2xl">
                Status: {details.status}
              </p>
              <div className="flex flex-row gap-2 text-xl">
                {details.genres?.map((genre) => {
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
            {(episodes as AnifyEpisodeDetail[])
              ? (episodes as AnifyEpisodeDetail[])?.map((episode, index) => (
                  <div key={episode.id}>
                    <Tooltip
                      title={<h1 className="text-xs">{episode.title}</h1>}
                      placement="top"
                    >
                      <a
                        key={episode.id}
                        href={`/watch/${encodeURIComponent(
                          encodeIds(
                            Number(details.id),
                            process.env.NEXT_PUBLIC_SECRET_KEY as string,
                            encodeURIComponent(episode.id)
                          )
                        )}/${episode.number}`}
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
                ))
              : (episodes as Episode[])?.map((episode, index) => (
                  <div key={episode.id}>
                    <Tooltip
                      title={<h1 className="text-xs">{episode.title}</h1>}
                      placement="top"
                    >
                      <a
                        key={episode.id}
                        href={`/watch/${encodeURIComponent(
                          encodeIds(
                            Number(details.id),
                            process.env.NEXT_PUBLIC_SECRET_KEY as string,
                            encodeURIComponent(episode.id)
                          )
                        )}/${episode.number}`}
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
