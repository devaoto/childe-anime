'use client';

import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

type Props = {
  searchValue?: string;
};

export default function NavBar({ searchValue }: Readonly<Props>) {
  let searchQuery = searchValue ? searchValue : undefined;

  return (
    <div className="w-full bg-teal-500/20 h-16 flex">
      <div className="flex justify-center items-center">
        <a href="/" className="text-4xl pl-24">
          Childe<span className="text-teal-500">Anime</span>
        </a>
      </div>
      <div className="flex justify-center items-center h-16 w-full">
        <div className="pl-24 flex gap-48 ">
          <div className="flex gap-4">
            <a href="#trending" className="text-3xl">
              Trending
            </a>
            <a href="/popular" className="text-3xl">
              Popular
            </a>
          </div>
          <div>
            <Search
              placeholder="Search by Anime name..."
              enterButton="Search"
              size="large"
              value={searchQuery}
              onSearch={(value) =>
                (window.location.href = `/search?q=${encodeURIComponent(
                  value
                )}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
