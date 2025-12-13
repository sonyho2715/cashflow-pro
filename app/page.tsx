import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsSection from '@/components/landing/StatsSection';
import BentoGrid from '@/components/landing/BentoGrid';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="font-sans text-zinc-900 bg-white selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      <Navbar />
      <Hero />
      <StatsSection />
      <BentoGrid />
      <Pricing />
      <Footer />
    </div>
  );
}
