'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { motion } from 'framer-motion';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import { Card } from 'keep-react';
import { Tooltip } from 'antd';

SwiperCore.use([Mousewheel]);

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

export default function Trending() {
  const [trendingList, setTrendingList] = useState<AnimeListResponse | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/anime/trending?perPage=20');
      const result = await response.json();

      setTrendingList(result);
    })();
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div id="trending">
      {trendingList ? (
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">Trending Anime</h1>

          <Swiper
            slidesPerView={5}
            spaceBetween={20}
            mousewheel={{
              sensitivity: 20,
            }}
            style={{ width: 'auto' }}
            className="flex flex-wrap w-full gap-3"
          >
            {trendingList?.results?.map((anime, index) => (
              <SwiperSlide style={{ width: 'auto' }} key={index}>
                <a href={`/details/${anime.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMobile ? (
                      <div>
                        <Tooltip
                          title={
                            <h1 className="text-xs">
                              {anime.title?.english
                                ? anime.title.english
                                : anime.title?.romaji}
                            </h1>
                          }
                          placement="top"
                        >
                          <Image
                            src={anime.image as string}
                            alt={`${anime.title?.native}`}
                            width={500}
                            height={500}
                            objectFit="cover"
                            className="h-auto w-full object-cover"
                          />
                        </Tooltip>
                      </div>
                    ) : (
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
                          <Card.Description>
                            Total episodes: {anime?.totalEpisodes}
                          </Card.Description>
                        </Card.Container>
                      </Card>
                    )}
                  </motion.div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
