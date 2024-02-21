import Trending from '../components/trending';
import NavBar from '@/components/navbar';
import Recent from '@/components/recent';
import Popular from '@/components/popular';
import Random from '@/components/random';
import Footer from '@/components/footer';
import { Meteors } from '@/components/meteors';
import { SparklesCore } from '@/components/sparkles';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <div>
        <NavBar />
        <Popular />
        <Trending />
        <Random />
        <Recent />
        <Footer />
      </div>
      <Meteors number={3} />
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#008080"
        />
      </div>
    </div>
  );
}
