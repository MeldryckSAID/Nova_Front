import { HeroSection } from '../components/organisms/HeroSection';
import { HelperSection } from '../components/organisms/HelperSection';
import { ScrollHeader } from '../components/organisms/ScrollHeader';
import { Footer } from '../components/organisms/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollHeader />
      <main className="flex-1">
        <HeroSection />
        <HelperSection />
      </main>
      <Footer />
    </div>
  );
}
