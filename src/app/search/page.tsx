'use client';

import { useSearchParams } from 'next/navigation';
import { Input, Tooltip } from 'antd';
import NavBar from '@/components/navbar';
import { useEffect, useState } from 'react';
import { Card } from 'keep-react';
import Image from 'next/image';
import { Suspense } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { motion } from 'framer-motion';
import { Mousewheel } from 'swiper/modules';
import SwiperComponent from '@/components/slider';

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

function SearchComponent() {
  const [searchResult, setSearchResult] = useState<AnimeListResponse | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      let genres: string | null | undefined;
      let query: string | undefined;

      query = searchParams?.get('q') as string | undefined;

      if (searchParams?.get('genres')) {
        genres = searchParams?.get('genres');
      } else {
        genres = undefined;
      }

      if (query === null) {
        query === undefined;
      }

      const response = await fetch(
        `/api/anime/advanced-search?query=${query}&genres=${genres}`,
        {
          method: 'POST',
        }
      );
      const result = await response.json();

      console.log(result);

      setSearchResult(result);
    })();
  }, [searchParams]);

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
    <div>
      <NavBar searchValue={`${searchParams?.get('q')}`} />
      <h1 className="text-3xl mb-10 text-center">
        Search results for &quot;{searchParams?.get('q')}&quot;
      </h1>
      <div className="flex w-full items-center justify-center">
        <Input
          className="text-center font-semibold max-w-lg mb-8"
          value={`${searchParams?.get('q')}`}
        />
      </div>
      <div>
        {searchResult ? (
          <div className="container mx-auto my-8 flex gap-5 flex-wrap">
            {searchResult.results?.map((anime, index) => {
              return (
                <a
                  key={index}
                  href={`/details/${anime.id}`}
                  className="cursor-pointer hover:scale-105 duration-300"
                >
                  <Tooltip
                    title={`${
                      anime.title?.english
                        ? anime.title?.english
                        : anime?.title?.romaji
                    }`}
                    placement="top"
                  >
                    <Image
                      src={anime.image as string}
                      alt={anime.title?.native as string}
                      height={500}
                      width={500}
                      className="h-[150px] w-[90px] lg:h-[300px] lg:w-[150px] md:h-[250px] md:w-[100px] object-cover rounded-md select-none"
                    />
                  </Tooltip>
                </a>
              );
            })}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense>
      <SearchComponent />
    </Suspense>
  );
}
