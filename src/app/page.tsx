import Image from 'next/image';
import Trending from '../components/trending';
import NavBar from '@/components/navbar';
import Recent from '@/components/recent';
import Popular from '@/components/popular';
import Random from '@/components/random';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <Popular />
      <Trending />
      <Random />
      <Recent />
    </div>
  );
}
