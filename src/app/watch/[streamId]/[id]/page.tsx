'use client';

import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Image from 'next/image';
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

type Props = {
  params: {
    streamId: string;
    id: number;
  };
};

export default function Watch({ params }: Readonly<Props>) {
  const [data, setData] = useState<any | null>(null);
  const [buttonHoverStates, setButtonHoverStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [details, setDetails] = useState<Anime | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.amvstr.me/api/v2/stream/${params.streamId}`
      );
      const result = await response.json();

      setData(result);
    })();
  }, [params.streamId]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
      );
      const result = await response.json();
      setDetails(result);
    })();
  }, [params.id]);

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

  const handleMouseEnter = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleMouseLeave = (index: number) => {
    setButtonHoverStates((prevState) => ({ ...prevState, [index]: false }));
  };

  const buttonStyle = (index: number) => ({
    border: `1px solid ${details?.color ? details.color : '#008080'}`,
    color: `${details?.color ? details.color : '#008080'}`,
    backgroundColor: buttonHoverStates[index]
      ? darkenHexColor(details?.color ? details.color : '#008080', 60)
      : darkenHexColor(details?.color ? details.color : '#008080', 90),
  });

  const unhoverButtonStyle = () => ({
    border: `1px solid ${details?.color ? details.color : '#008080'}`,
    color: `${details?.color ? details.color : '#008080'}`,
    backgroundColor: darkenHexColor(
      details?.color ? details.color : '#008080',
      60
    ),
  });

  return (
    <>
      {details ? (
        <div
          style={{
            backgroundColor: details?.color
              ? darkenHexColor(details.color, 90)
              : '#000000',
          }}
          className="h-full"
        >
          <div className="ml-2">
            <h1 className="lg:text-2xl md:text-base sm:text-sm mb-3">
              Watching{' '}
              <span className="font-semibold">
                {details?.title?.english
                  ? details.title.english
                  : details?.title.romaji}
              </span>
            </h1>
            <div className="flex flex-col gap-20 lg:flex-row">
              <iframe
                src={data?.plyr?.main || data?.plyr?.backup}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                title={params.streamId}
                allow="picture-in-picture"
                className="lg:w-2/4 md:w-3/4 sm:w-full  rounded-lg h-[30vh] lg:h-[50vh] md:h-[30vh]"
              ></iframe>
              <div className="flex flex-wrap gap-2 mt-4 max-h-[360px] max-w-[500px] overflow-y-auto">
                <div className="">
                  {' '}
                  {details?.episodes.map((episode, index) => {
                    const streamId = parseInt(
                      RegExp(/episode-(\d+)/).exec(
                        params?.streamId
                      )?.[1] as string,
                      10
                    );

                    return (
                      <React.Fragment key={index}>
                        {index + 1 !== streamId && (
                          <Tooltip
                            placement="top"
                            title={
                              <h1 className="text-xs">
                                {details?.title?.english
                                  ? details?.title?.english
                                  : details?.title.romaji}{' '}
                                episode {episode.number}
                              </h1>
                            }
                          >
                            <a href={`/watch/${episode.id}/${details.id}`}>
                              <button
                                onMouseEnter={() => handleMouseEnter(index + 1)}
                                onMouseLeave={() => handleMouseLeave(index + 1)}
                                disabled={index + 1 > details.currentEpisode}
                                style={buttonStyle(index + 1)}
                                className={`border rounded-lg hover:text-gray-200 p-2 transition-colors duration-[0.3s] mb-2 max-w-40 text-xs md:text-sm lg:text-[18px] lg:p-3`}
                              >
                                Episode {index + 1}
                              </button>{' '}
                            </a>
                          </Tooltip>
                        )}
                        {index + 1 === streamId && (
                          <Tooltip
                            title={`You're already watching this`}
                            placement="top"
                          >
                            <button
                              style={unhoverButtonStyle()}
                              className="rounded-lg  cursor-not-allowed transition-colors duration-300 p-2 mb-2 max-w-40 text-xs md:text-sm lg:text-[18px] lg:p-3"
                            >
                              Episode {index + 1}
                            </button>{' '}
                          </Tooltip>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-xl lg:text-4xl md:text-2xl sm:text-xl ">
              Relations
            </h1>
            <div className="flex gap-3 mt-4">
              {details?.relations.map((relation, value) => {
                return (
                  <a
                    key={relation.id}
                    href={`/details/${relation.id}`}
                    className="cursor-pointer hover:scale-105 duration-300"
                  >
                    <Tooltip
                      key={relation.id}
                      title={
                        <h1 className="text-xs">
                          Watch {relation.title?.english}{' '}
                          {relation.relationType}
                        </h1>
                      }
                      placement="top"
                    >
                      <Image
                        src={relation.image as string}
                        alt={relation.title?.native as string}
                        height={500}
                        width={500}
                        className="h-[150px] w-[90px] lg:h-[300px] lg:w-[150px] md:h-[250px] md:w-[100px] object-cover rounded-md select-none"
                      />
                    </Tooltip>
                  </a>
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
