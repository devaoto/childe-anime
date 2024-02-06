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
          <SwiperComponent
            animeList={trendingList.results || []}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
