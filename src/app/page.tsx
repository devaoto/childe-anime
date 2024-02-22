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
        <div className="relative z-[2000]">
          <NavBar />
        </div>
        <Popular />
        <Trending />
        <div className="relative z-[2000]">
          <Random />
        </div>
        <Recent />
        <Footer />
        <div className="w-auto absolute inset-0 h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-auto h-full"
            particleColor="#008080"
          />
        </div>
      </div>
    </div>
  );
}
