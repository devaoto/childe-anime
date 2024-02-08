'use client';
import { useSearchParams } from 'next/navigation';
import { Input, Tooltip } from 'antd';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import NavBar from '@/components/navbar';

interface Anime {
  id?: string;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred?: string;
  };
  image?: string;
}

interface AnimeListResponse {
  results?: Anime[];
}

function SearchComponent() {
  const [searchResult, setSearchResult] = useState<AnimeListResponse | null>(
    null
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = searchParams?.get('q') ?? undefined;
        const genres = searchParams?.get('genres') ?? undefined;

        let url = `/api/anime/advanced-search?page=1&perPage=20`;
        if (query) {
          url += `&q=${query}`;
        }
        if (genres) {
          url += `&genres=${genres}`;
        }

        const response = await fetch(url);
        const result = await response.json();
        setSearchResult(result);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResult(null);
      }
    };

    fetchData();
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
      <div>
        {searchResult ? (
          <div className="container mx-auto my-8 flex gap-5 flex-wrap">
            {searchResult.results?.map((anime) => {
              return (
                <a
                  key={anime.id}
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
