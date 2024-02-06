// SwiperComponent.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Tooltip } from 'antd';
import Image from 'next/image';
import { Card } from 'keep-react';

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
}

const SwiperComponent: React.FC<SwiperComponentProps> = ({
  animeList,
  isMobile,
}) => {
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
      {animeList.map((anime, index) => (
        <SwiperSlide style={{ width: 'auto' }} key={index}>
          <p
            onDoubleClick={() =>
              (window.location.href = `/details/${anime.id}`)
            }
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                      className="h-auto w-full object-cover select-none"
                      style={{ height: 200, width: 600 }}
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
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperComponent;
