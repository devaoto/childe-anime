import Trending from '../components/trending';
import NavBar from '@/components/navbar';
import Recent from '@/components/recent';
import Popular from '@/components/popular';
import Random from '@/components/random';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <Popular />
      <Trending />
      <Random />
      <Recent />
      <Footer />
    </div>
  );
}
