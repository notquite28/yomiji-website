import { useState, useCallback, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '@/hooks/useLenis';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import Preloader from '@/sections/Preloader';
import HeroSection from '@/sections/HeroSection';
import TransitionSection from '@/sections/TransitionSection';
import ProductIntro from '@/sections/ProductIntro';
import PhoneShowcase from '@/sections/PhoneShowcase';
import Lessons from '@/sections/Lessons';
import Reviews from '@/sections/Reviews';
import SelfStudy from '@/sections/SelfStudy';
import Privacy from '@/sections/Privacy';
import Footer from '@/sections/Footer';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useLenis();

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Lock scroll behind the preloader so the page can't be scrolled before reveal.
  useEffect(() => {
    document.body.style.overflow = isLoaded ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoaded]);

  // Content/layout settles when the preloader clears; re-measure trigger positions.
  useEffect(() => {
    if (isLoaded) {
      ScrollTrigger.refresh();
    }
  }, [isLoaded]);

  return (
    <>
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />
      <Navigation isLoaded={isLoaded} />

      <main className="relative bg-charcoal">
        <HeroSection />
        <TransitionSection />
        <ProductIntro />
        <PhoneShowcase />
        <Lessons />
        <Reviews />
        <SelfStudy />
        <Privacy />
        <Footer />
      </main>
    </>
  );
}
