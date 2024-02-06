'use client';
import React, { useEffect, useState } from 'react';
import SwiperCore from 'swiper';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import SwiperComponent from './slider';

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

export default function Popular() {
  const [popularList, setpopularList] = useState<AnimeListResponse | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/anime/popular?perPage=20');
      const result = await response.json();

      setpopularList(result);
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
    <div id="popular">
      {popularList ? (
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">Popular Anime</h1>
          <SwiperComponent
            animeList={popularList.results || []}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <div>Loading popular anime...</div>
      )}
    </div>
  );
}
