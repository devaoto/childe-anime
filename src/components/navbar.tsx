'use client';

import React from 'react';
import { Input } from 'antd';
import { Navbar, Button } from 'keep-react';
import Link from 'next/link';

const { Search } = Input;

type Props = {
  searchValue?: string;
};

export default function NavBar({ searchValue }: Readonly<Props>) {
  let searchQuery = searchValue ? searchValue : undefined;

  return (
    <Navbar fluid={true} className="bg-teal-500/50">
      <Navbar.Container className="flex items-center justify-between">
        <Navbar.Container className="flex items-center">
          <Navbar.Brand>
            <a
              href="/"
              className="text-sm mr-2 ml-0 pl-0 md:text-xl lg:text-3xl"
            >
              Childe<span className="text-teal-500">Anime</span>
            </a>
          </Navbar.Brand>
          <Navbar.Divider></Navbar.Divider>
          <Navbar.Container
            tag="ul"
            className="lg:flex hidden items-center justify-between gap-8"
          >
            <Link
              href={'/'}
              className="text-white text-xl hover:text-white/75 duration-300"
            >
              Home
            </Link>
            <Link
              href={'/trending'}
              className="text-white text-xl hover:text-white/75 duration-300"
            >
              Trending
            </Link>
          </Navbar.Container>
          <Navbar.Collapse
            collapseType="sidebar"
            className="bg-teal-500 text-white"
          >
            <Navbar.Container
              tag="ul"
              className="flex flex-col gap-5 text-white"
            >
              <Link
                href={'/'}
                className="text-white text-xl hover:text-white/75 duration-300"
              >
                Home
              </Link>
              <Link
                href={'/trending'}
                className="text-white text-xl hover:text-white/75 duration-300"
              >
                Trending
              </Link>
            </Navbar.Container>
          </Navbar.Collapse>
        </Navbar.Container>

        <Navbar.Container className="flex gap-2">
          <Search
            placeholder="Search by Anime name..."
            enterButton="Search"
            size="large"
            value={searchQuery}
            onSearch={(value) =>
              (window.location.href = `/search?q=${encodeURIComponent(value)}`)
            }
          />
          <Navbar.Toggle />
        </Navbar.Container>
      </Navbar.Container>
    </Navbar>
  );
}
