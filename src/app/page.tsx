import Image from 'next/image';
import Trending from '../components/trending';
import NavBar from '@/components/navbar';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <Trending />
    </div>
  );
}
