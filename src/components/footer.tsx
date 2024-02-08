import React from 'react';

export default function Footer() {
  return (
    <div className="bg-gray-800 text-white p-8">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 lg:w-1/4 mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold">
            Childe<span className="text-teal-500">Anime</span>
          </h1>
          <p className="mt-4">
            ChildeAnime is a personal anime streaming site where you can watch
            anime without any ads or maybe even self-host it and modify it
            according to your needs.
          </p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4">
          <div className="flex flex-col gap-2">
            <a href="/privacy" className="hover:text-teal-500">
              Privacy and Policy
            </a>
            <a href="/terms-of-service" className="hover:text-teal-500">
              Terms of Service
            </a>
            <a href="/license" className="hover:text-teal-500">
              License of 3rd party libraries
            </a>
          </div>
        </div>
        <div className="w-full mt-8 lg:w-1/2 lg:mt-0">
          <p>
            &copy; This site is created by Mohtasim Alam Sohom with the help of{' '}
            <a href="https://consumet.org" className="hover:text-teal-500">
              Consumet API
            </a>{' '}
            along with Muhammad Hudda
          </p>
        </div>
      </div>
    </div>
  );
}
