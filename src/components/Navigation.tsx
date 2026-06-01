import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NavigationProps {
  isLoaded: boolean;
}

export default function Navigation({ isLoaded }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { opacity: 0, xPercent: -50, y: -20 },
      { opacity: 1, xPercent: -50, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
    );

  }, [isLoaded]);

  const scrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed left-1/2 z-40 w-[calc(100%-1.5rem)] opacity-0 rounded-full border border-off-white/10 bg-charcoal/60 px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:w-fit md:px-5"
      style={{
        top: '12px',
        backdropFilter: 'blur(22px) saturate(140%)',
        WebkitBackdropFilter: 'blur(22px) saturate(140%)',
      }}
    >
      <div className="flex items-center justify-between gap-1 md:gap-5">
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="rounded-full px-2.5 py-2 font-display text-[13px] md:text-[15px] text-off-white hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/70 transition-colors duration-300"
          data-cursor-hover
        >
          読路
        </button>
        <span className="h-4 w-px bg-off-white/10" aria-hidden="true" />
        <button
          onClick={() => scrollTo('about')}
          className="rounded-full px-2.5 py-2 text-[10px] md:text-[12px] uppercase tracking-[0.14em] md:tracking-[0.2em] text-off-white hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/70 transition-colors duration-300 font-body"
          data-cursor-hover
        >
          About
        </button>
        <button
          onClick={() => scrollTo('lessons')}
          className="rounded-full px-2.5 py-2 text-[10px] md:text-[12px] uppercase tracking-[0.14em] md:tracking-[0.2em] text-off-white hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/70 transition-colors duration-300 font-body"
          data-cursor-hover
        >
          Features
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="rounded-full px-2.5 py-2 text-[10px] md:text-[12px] uppercase tracking-[0.14em] md:tracking-[0.2em] text-off-white hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/70 transition-colors duration-300 font-body"
          data-cursor-hover
        >
          GitHub
        </button>
      </div>
    </nav>
  );
}
