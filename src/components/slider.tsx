'client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { ConfigProvider, Popover } from 'antd';
import Image from 'next/image';
import { Card } from 'keep-react';
import { useRouter } from 'next/navigation';
import { encodeIds } from '@/lib/functions/encode';

interface Anime {
  id?: string;
  malId?: number;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred?: string;
  };
  image?: string;
  trailer?: {
    id?: string;
    site?: string;
    thumbnail?: string;
  };
  description?: string;
  status?: string;
  cover?: string;
  rating?: number;
  releaseDate?: number;
  color?: string;
  genres?: string[];
  totalEpisodes?: number;
  duration?: number;
  type?: string;
}

interface AnimeListResponse {
  currentPage?: number;
  hasNextPage?: boolean;
  results?: Anime[];
}

interface SwiperComponentProps {
  animeList: Anime[];
  isMobile: boolean;
  includeEpisodeList?: boolean;
  popoverPlacement?: 'top' | 'bottom';
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({
  animeList,
  isMobile,
  includeEpisodeList = true,
  popoverPlacement = 'top',
}) => {
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = useState<boolean[]>(
    new Array(animeList.length).fill(false)
  );

  const handleCardClick = (animeId: string, index: number) => {
    if (tooltipVisible[index]) {
      router.push(
        `/details/${encodeURIComponent(
          encodeIds(
            Number(animeId),
            process.env.NEXT_PUBLIC_SECRET_KEY as string
          )
        )}`
      );
    } else {
      const updatedTooltipVisible = [...tooltipVisible];
      updatedTooltipVisible.fill(false);
      updatedTooltipVisible[index] = true;
      setTooltipVisible(updatedTooltipVisible);
    }
  };

  return (
    <Swiper
      slidesPerView={5}
      spaceBetween={20}
      mousewheel={{
        sensitivity: 20,
      }}
      style={{ width: 'auto' }}
      className="flex flex-wrap w-full gap-3"
    >
      {animeList.map((anime, index) => {
        const content = (
          <div>
            <p className="text-white">Total Episodes: {anime.totalEpisodes}</p>
            <p className="text-white">Rating: {anime.rating}%</p>
            <a href={`/details/${anime.id}`}>
              <button className="bg-teal-500 text-white p-2 rounded-full text-[12px]">
                Details
              </button>
            </a>
          </div>
        );

        return (
          <SwiperSlide style={{ width: 'auto' }} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(anime.id as string, index)}
            >
              {isMobile ? (
                <div>
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgElevated: '#222222',
                        colorText: '#ffffff',
                        colorTextHeading: '#ffffff',
                      },
                    }}
                  >
                    <Popover
                      title={
                        <h1 className="text-xs">
                          {anime.title?.english
                            ? anime.title.english
                            : anime.title?.romaji}
                        </h1>
                      }
                      content={content}
                      placement={popoverPlacement}
                      visible={tooltipVisible[index]}
                      className="z-[9999]"
                    >
                      <Image
                        src={anime.image as string}
                        alt={`${anime.title?.native}`}
                        width={500}
                        height={500}
                        objectFit="cover"
                        className="h-auto w-full object-cover select-none max-h-[81px] rounded-md"
                      />
                    </Popover>
                  </ConfigProvider>
                </div>
              ) : (
                <ConfigProvider
                  theme={{
                    token: {
                      colorBgElevated: '#222222',
                      colorText: '#ffffff',
                      colorTextHeading: '#ffffff',
                    },
                  }}
                >
                  <Popover
                    placement={popoverPlacement}
                    className="z-[9999]"
                    title={
                      <h1 className="text-sm md:text-lg lg:text-xl xl:text-2xl">
                        Information about{' '}
                        {anime.title?.english
                          ? anime.title.english
                          : anime.title?.romaji}
                      </h1>
                    }
                    content={
                      <div className="flex gap-2">
                        <Image
                          src={anime.image as string}
                          alt={anime.title?.native as string}
                          width={700}
                          height={700}
                          className="w-32 h-40"
                        />
                        <div className="text-sm md:text-lg lg:text-xl xl:text-2xl">
                          <p>Status {anime.status}</p>
                          <p>Rating: {anime.rating}</p>
                          <p>Released: {anime.releaseDate}</p>
                          <a
                            href={`/details/${encodeIds(
                              Number(anime.id),
                              process.env.NEXT_PUBLIC_SECRET_KEY as string
                            )}`}
                          >
                            <button className="bg-teal-500 text-white p-2 rounded-full text-[12px]">
                              Details
                            </button>
                          </a>
                        </div>
                      </div>
                    }
                    trigger={'click'}
                  >
                    <Card
                      className="max-w-xs overflow-hidden rounded-md max-h-[80%] min-h-[300px] h-xs lg:w-4/5 lg:h-4/5 md:h-3/5 md:w-full"
                      imgSrc={`${anime.image}`}
                      imgSize={'md'}
                      imgAlt={`${anime.title?.native}`}
                    >
                      <Card.Container className="my-3">
                        <Card.Title>
                          <h1 className="text-[12px] lg:text-sm md:text-xs">
                            {' '}
                            {anime?.title?.english
                              ? anime.title.english.length > 35
                                ? `${anime.title.english.slice(0, 35)}...`
                                : anime.title.english
                              : (anime.title?.romaji?.length as number) > 35
                              ? `${anime.title?.romaji?.slice(0, 35)}`
                              : `${anime.title?.romaji}`}
                          </h1>
                        </Card.Title>
                        {includeEpisodeList ? (
                          <Card.Description>
                            Total episodes: {anime?.totalEpisodes}
                          </Card.Description>
                        ) : (
                          <Card.Description>Watch now</Card.Description>
                        )}
                      </Card.Container>
                    </Card>
                  </Popover>
                </ConfigProvider>
              )}
            </motion.div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default SwiperComponent;
