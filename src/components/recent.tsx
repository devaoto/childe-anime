'use client';
import React, { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import SwiperComponent from './slider';
import { Skeleton } from 'keep-react';

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

export default function Recent() {
  const [recentList, setrecentList] = useState<AnimeListResponse | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/anime/recent?perPage=20');
      const result = await response.json();

      setrecentList(result);
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
    <div id="recent">
      {recentList ? (
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">
            Recently Released Anime
          </h1>
          <SwiperComponent
            animeList={recentList.results || []}
            isMobile={isMobile}
            includeEpisodeList={false}
          />
        </div>
      ) : (
        <div>
          <Skeleton animation className="ml-5">
            <div className="w-[300px]">
              <Skeleton.Line height="h-[30px]" />
            </div>

            <div className="flex gap-10">
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
              <div className="w-[200px]">
                <Skeleton.Line height="max-h-[80%] min-h-[300px] h-xs lg:h-4/5 md:h-3/5" />
              </div>
            </div>
          </Skeleton>
        </div>
      )}
    </div>
  );
}
