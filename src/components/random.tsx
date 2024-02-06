'use client';
import React, { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import SwiperComponent from './slider';
import { Card } from 'keep-react';

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

export default function Random() {
  const [randomList, setrandomList] = useState<Anime | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/anime/random?perPage=20');
      const result = await response.json();

      setrandomList(result);
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
    <div id="random">
      {randomList ? (
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">Random Anime</h1>
          <Card
            className="max-w-xs overflow-hidden rounded-md max-h-[80%] min-h-[300px] h-xs lg:w-4/5 lg:h-4/5 md:h-3/5 md:w-full hover:scale-105 duration-300"
            imgSrc={`${randomList.image}`}
            imgSize={'md'}
            imgAlt={`${randomList.title?.native}`}
            href={`/details/${randomList.id as string}`}
          >
            <Card.Container className="my-3">
              <Card.Title>
                <h1 className="text-[12px] lg:text-sm md:text-xs">
                  {' '}
                  {randomList?.title?.english
                    ? randomList.title.english.length > 35
                      ? `${randomList.title.english.slice(0, 35)}...`
                      : randomList.title.english
                    : (randomList.title?.romaji?.length as number) > 35
                    ? `${randomList.title?.romaji?.slice(0, 35)}`
                    : `${randomList.title?.romaji}`}
                </h1>
              </Card.Title>
              <Card.Description>
                Total episodes: {randomList?.totalEpisodes}
              </Card.Description>
            </Card.Container>
          </Card>
        </div>
      ) : (
        <div>Loading random randomList...</div>
      )}
    </div>
  );
}
