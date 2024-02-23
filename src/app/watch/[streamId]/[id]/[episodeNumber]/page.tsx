'use client';

import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Footer from '@/components/footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import axios from 'axios';
import { NextSeo } from 'next-seo';

import {
  AnifyEpisodeDetail,
  VideoConfig,
  Episode,
} from '@/lib/types/watch.types';
import { sendRequest } from '@/lib/utils/request';
import { AnimeAnilist, Anime } from '@/lib/types/details.types';

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
  const [details, setDetails] = useState<Anime | AnimeAnilist | null>(null);
  const [episodeLinks, setEpisodeLinks] = useState<VideoConfig | null>(null);
  const [encodedIframeData, setEncodedIframeData] = useState<any>(null);
  const [episodes, setEpisodes] = useState<
    AnifyEpisodeDetail[] | Episode[] | null
  >(null);
  const [universalProvider, setUniProvider] = useState<
    'gogoanime' | 'zoro' | null
  >(null);
  const [universalServer, setUniServer] = useState<
    'vidcloud' | 'gogocdn' | null
  >(null);
  const [uniqueCharacters, setUniqueCharacters] = useState<any>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTab, setIsTab] = useState<boolean>(false);
  const [currentEpisode, setCurrentEpisode] = useState<
    AnifyEpisodeDetail | Episode | undefined | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`https://api.anify.tv/info/${params.id}`);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        const response = await fetch(
          `https://consumet-api-h1ga.onrender.com/meta/anilist/info/${params.id}`
        );
        const data = await response.json();

        setDetails(data);
      }
    })();
  }, [params.id]);
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
      }
    })();
  }, [params.id, details]);

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

    (async () => {
      try {
        setUniProvider(provider as 'gogoanime' | 'zoro');
        setUniServer(server as 'gogocdn' | 'vidcloud');
        const streamId = params.streamId;
        const episodes = await sendRequest(
          `https://api.anify.tv/sources?providerId=${provider}&watchId=${streamId}&episodeNumber=${params.episodeNumber}&id=${params.id}&subType=sub&server=${server}`
        );

        setEpisodeLinks(episodes);
      } catch (error) {
        if (details && details?.episodes) {
          try {
            const episodesList = (details as Anime).episodes.data.find(
              (provider) => provider.providerId === 'gogoanime'
            )?.episodes;

            console.log('params.episodeNumber', params.episodeNumber);
            console.log('episodesList', episodesList);

            const episodeSelected = episodesList?.find((episode) => {
              console.log('episode.number:', episode);
              console.log('params.episodeNumber:', params.episodeNumber);
              console.log('typeof episode.number', typeof episode.number);
              console.log(
                'typeof params.episodeNumber',
                typeof params.episodeNumber
              );
              return episode.number === Number(params.episodeNumber);
            });

            if (episodeSelected) {
              const result = await sendRequest(
                `https://api.amvstr.me/api/v2/stream/${decodeURIComponent(
                  episodeSelected?.id as string
                ).replace(/\//g, '')}`
              );

              setEpisodeLinks(null);
              setUniProvider('gogoanime');
              setUniServer('gogocdn');
              setData(result);
            }
          } catch (error) {
            try {
              const episodesList = (details as AnimeAnilist)?.episodes;

              console.log('params.episodeNumber', params.episodeNumber);
              console.log('episodesList', episodesList);

              const episodeSelected = episodesList?.find(
                (episode) => episode.number === params.episodeNumber
              );
              if (episodeSelected) {
                const result = await sendRequest(
                  `https://api.amvstr.me/api/v2/stream/${decodeURIComponent(
                    episodeSelected?.id as string
                  ).replace(/\//g, '')}`
                );

                setEpisodeLinks(null);
                setUniProvider('gogoanime');
                setUniServer('gogocdn');
                setData(result);
              }
            } catch (error) {
              const episodeId = params.streamId;

              const result = await sendRequest(
                `https://api.amvstr.me/api/v2/stream/${decodeURIComponent(
                  episodeId
                ).replace(/\//g, '')}`
              );
              setEpisodeLinks(null);
              setUniProvider('gogoanime');
              setUniServer('gogocdn');
              setData(result);
            }
          }
        }
      }
    })();
  }, [params.streamId, params.id, params.episodeNumber, details]);

  useEffect(() => {
    (async () => {
      console.log('epLinks', episodeLinks);
      if (episodeLinks && episodeLinks?.sources && episodeLinks?.subtitles) {
        if (universalProvider === 'zoro') {
          const autoQualitySource = episodeLinks?.sources.find(
            (source) => source.quality === 'auto'
          );

          if (autoQualitySource) {
            try {
              const result = await axios.post(
                `https://childe-anime-player.vercel.app/plyr/iframe`,
                {
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
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              setEncodedIframeData(`${result.data}`);
            } catch (error) {
              console.error('Episode fetching error:', error);
            }
          }
        } else {
          (async () => {
            const result = await sendRequest(
              `https://api.amvstr.me/api/v2/stream/${decodeURIComponent(
                params.streamId
              ).replace(/\//g, '')}`
            );
            setData(result);
          })();
        }
      }
    })();
  }, [details, episodeLinks, params.streamId, universalProvider]);

  useEffect(() => {
    if (details && (details as Anime).characters) {
      const uniqueChars: any = {};

      (details as Anime).characters.forEach((char) => {
        if (!uniqueChars[char.name]) {
          uniqueChars[char.name] = char;
        }
      });

      setUniqueCharacters(uniqueChars);
    }
  }, [details]);

  useEffect(() => {
    const episodeNumber = params.episodeNumber;

    const currentEpisode = episodes?.find(
      (episode) => episode.number === Number(episodeNumber)
    );

    setCurrentEpisode(currentEpisode);
  }, [params.episodeNumber, episodes]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 768;
      const isTabletDevice =
        window.innerWidth >= 768 && window.innerWidth < 1024;

      setIsMobile(isMobileDevice);
      setIsTab(isTabletDevice);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          <NextSeo
            title={
              details?.title.english
                ? details?.title.english
                : details?.title.romaji
            }
            description={`Watch ${
              details?.title.english
                ? details?.title.english
                : details?.title.romaji
            } on Childe anime for free without any ads`}
          />
          <div className="ml-2">
            <div className="mb-2"></div>
            <div className="flex flex-col gap-2 lg:gap-20 lg:flex-row">
              <div className="w-full lg:w-2/4 md:w-3/4 sm:w-full">
                {universalServer === 'gogocdn' ? (
                  data?.plyr?.main ? (
                    <div>
                      <iframe
                        src={data?.plyr?.main || data?.plyr?.backup}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        title={params.streamId}
                        allow="picture-in-picture"
                        className="rounded-lg h-[30vh] lg:h-[50vh] md:h-[30vh] w-full"
                      ></iframe>
                      <h1 className="font-semibold">
                        {details.title.english} - {currentEpisode?.title}
                      </h1>
                    </div>
                  ) : (
                    <div>Loading...</div>
                  )
                ) : (
                  <>
                    {encodedIframeData ? (
                      <div>
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
                          className="rounded-lg h-[50vh] lg:h-[60vh] md:h-[55vh] w-full mb-0 pb-0"
                        />
                        <h1 className="font-semibold lg:text-2xl md:text-xl ml-2 mt-0 pt-0">
                          {details.title.english} - {currentEpisode?.title}
                        </h1>
                      </div>
                    ) : (
                      <div>Loading player...</div>
                    )}
                  </>
                )}
              </div>

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
          </div>
          <div className="mt-10">
            <h1 className="text-2xl mb-5">Voice Actors</h1>
            <div className="w-full flex flex-wrap flex-row gap-7">
              <Swiper
                slidesPerView={isMobile ? 2 : isTab ? 4 : 8}
                spaceBetween={isMobile ? 40 : isTab ? 30 : 20}
                modules={[Mousewheel]}
                mousewheel={{
                  sensitivity: 50,
                }}
                direction="horizontal"
                className="w-full"
              >
                {uniqueCharacters &&
                  Object.values(uniqueCharacters).map((char: any) => (
                    <SwiperSlide key={char.name}>
                      <div className="flex flex-col max-w-48 max-h-48 justify-center items-center select-none">
                        <img
                          src={char.image}
                          alt={`${char.name} - ${char.voiceActor.name}`}
                          width={512}
                          height={512}
                          loading="lazy"
                          className="object-cover rounded-full max-h-32 max-w-32"
                        />
                        <p className="text-xs font-semibold">{char.name}</p>
                        <p className="text-[9px] font-semibold">
                          {char.voiceActor.name}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
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
