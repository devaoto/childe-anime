'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from 'antd';

const { Meta } = Card;

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

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/anime/trending?perPage=12');
      const result = await response.json();

      setTrendingList(result);
    })();
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-semibold mb-6">Trending Anime</h1>
      <div className="flex flex-wrap w-[1400px] gap-3">
        {trendingList?.results?.map((anime, index) => (
          <a key={index} href={`/details/${anime.id}`}>
            <Card
              hoverable={true}
              style={{ width: 200 }}
              cover={
                <Image
                  src={`${anime.image}`}
                  alt={`${anime.title?.native}`}
                  width={200}
                  height={300}
                  objectFit={'cover'}
                  className="max-h-[260px]"
                />
              }
            >
              <Meta
                title={`${
                  anime.title?.english
                    ? anime.title.english
                    : anime.title?.romaji
                }`}
                description={`Total Episodes: ${anime.totalEpisodes}`}
              />
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
