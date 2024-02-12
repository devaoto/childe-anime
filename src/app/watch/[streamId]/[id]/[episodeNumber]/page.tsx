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

type Props = {
  params: {
    streamId: string;
    id: number;
    episodeNumber: number;
  };
};

export default function Watch({ params }: Readonly<Props>) {
  const [data, setData] = useState<any | null>(null);
  const [buttonHoverStates, setButtonHoverStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [details, setDetails] = useState<Anime | null>(null);
  const [episodeLinks, setEpisodeLinks] = useState<VideoConfig | null>(null);
  const [encodedIframeData, setEncodedIframeData] = useState<any>(null);
  const [episodes, setEpisodes] = useState<AnifyEpisodeDetail[] | null>(null);
  const [universialProvider, setUniProvider] = useState<
    'gogoanime' | 'zoro' | null
  >(null);
  const [unisersialServer, setUniServer] = useState<
    'vidcloud' | 'gogocdn' | null
  >(null);

  useEffect(() => {
    let provider;
    let server;
    if (decodeURIComponent(params.streamId).split('/').includes('watch')) {
      provider = 'zoro';
      server = 'vidcloud';
    } else {
      provider = 'gogoanime';
      server = 'gogocdn';
    }
    console.log(
      decodeURIComponent(params.streamId).split('/').includes('watch')
    );

    (async () => {
      setUniProvider(provider as 'gogoanime' | 'zoro');
      setUniServer(server as 'gogocdn' | 'vidcloud');
      const streamId = params.streamId;
      const response = await fetch(
        `https://api.anify.tv/sources?providerId=${provider}&watchId=${streamId}&episodeNumber=${params.episodeNumber}&id=${params.id}&subType=sub&server=${server}`
      );

      const episodes = await response.json();

      setEpisodeLinks(episodes);
    })();
  }, [params.streamId, params.id, params.episodeNumber]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
      );
      const result = await response.json();
      setDetails(result);
    })();
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

  useEffect(() => {
    (async () => {
      if (episodeLinks && episodeLinks?.sources && episodeLinks?.subtitles) {
        if (universialProvider === 'zoro') {
          const autoQualitySource = episodeLinks?.sources.find(
            (source) => source.quality === 'auto'
          );

          if (autoQualitySource) {
            const response = await fetch(
              `https://childe-anime-player.vercel.app/plyr/iframe`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: `${params.streamId}`,
                  video: {
                    type: 'video',
                    title: `${details?.title?.english}`,
                    sources: [
                      {
                        src: autoQualitySource.url,
                        size: autoQualitySource.quality,
                        type: '',
                      },
                    ],
                    tracks: episodeLinks?.subtitles?.map((subtitle) => ({
                      kind: 'captions',
                      label: subtitle.lang !== 'Thumbnail' ? subtitle.lang : '',
                      src: subtitle.lang !== 'Thumbnail' ? subtitle.url : '',
                      srclang: subtitle.lang.substring(0, 2).toLowerCase(),
                      default: subtitle.lang === 'English',
                    })),
                  },
                }),
              }
            );
            const result = await response.text();
            setEncodedIframeData(`${result}`);
          }
        } else {
          (async () => {
            const response = await fetch(
              `https://api.amvstr.me/api/v2/stream/${decodeURIComponent(
                params.streamId
              ).replace(/\//g, '')}`
            );
            const result = await response.json();

            setData(result);
          })();
        }
      }
    })();
  }, [details, episodeLinks, params.streamId, universialProvider]);

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

  const handleMouseEnter = (episodeNumber: number) => {
    setButtonHoverStates((prevState) => ({
      ...prevState,
      [episodeNumber]: true,
    }));
  };

  const handleMouseLeave = (episodeNumber: number) => {
    setButtonHoverStates((prevState) => ({
      ...prevState,
      [episodeNumber]: false,
    }));
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
          className="h-auto"
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
              {unisersialServer === 'gogocdn' ? (
                <iframe
                  src={data?.plyr?.main || data?.plyr?.backup}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  title={params.streamId}
                  allow="picture-in-picture"
                  className="lg:w-2/4 md:w-3/4 sm:w-full  rounded-lg h-[30vh] lg:h-[50vh] md:h-[30vh]"
                ></iframe>
              ) : (
                <iframe
                  ref={(iframe) => {
                    if (iframe) {
                      iframe.contentDocument?.open();
                      iframe.contentDocument?.write(encodedIframeData);
                      iframe.contentDocument?.close();
                    }
                  }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  title={params.streamId}
                  allow="autoplay; fullscreen; picture-in-picture; controls"
                  className="w-full rounded-lg h-[50vh] lg:h-[75vh] md:h-[55vh]"
                />
              )}

              <div className="flex flex-wrap gap-2 mt-4 max-h-[360px] max-w-[500px] overflow-y-auto">
                <div className="">
                  {' '}
                  {episodes?.map((episode, index) => {
                    return (
                      <React.Fragment key={episode.number}>
                        {episode.number !== params.episodeNumber && (
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
                            <a
                              href={`/watch/${encodeURIComponent(episode.id)}/${
                                details.id
                              }/${episode.number}`}
                            >
                              <button
                                onMouseEnter={() =>
                                  handleMouseEnter(episode.number)
                                }
                                onMouseLeave={() =>
                                  handleMouseLeave(episode.number)
                                }
                                disabled={index + 1 > details.currentEpisode}
                                style={buttonStyle(index + 1)}
                                className={`border rounded-lg hover:text-gray-200 p-2 transition-colors duration-[0.3s] mb-2 max-w-40 text-xs md:text-sm lg:text-[18px] lg:p-3`}
                              >
                                Episode {index + 1}
                              </button>{' '}
                            </a>
                          </Tooltip>
                        )}
                        {episode.number === params.episodeNumber && (
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
