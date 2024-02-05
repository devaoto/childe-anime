'use client';

import { useSearchParams } from 'next/navigation';
import { Input } from 'antd';
import NavBar from '@/components/navbar';
import { useEffect, useState } from 'react';
import { Card } from 'antd';
import Image from 'next/image';

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

export default function Search() {
  const [searchResult, setSearchResult] = useState<AnimeListResponse | null>(
    null
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const query = searchParams?.get('q');
      const response = await fetch(`/api/anime/search?query=${query}`, {
        method: 'POST',
      });
      const result = await response.json();

      console.log(result);

      setSearchResult(result);
    })();
  }, [searchParams]);

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
      <div className="flex flex-wrap w-[1400px] gap-3 ml-24">
        {searchResult?.results?.map((anime, index) => (
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
