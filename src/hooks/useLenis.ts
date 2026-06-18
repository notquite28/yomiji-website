import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const nativeScrollQuery = '(pointer: coarse), (max-width: 767px)';

// Module-level handle so non-React consumers (e.g. Navigation) can drive the
// active Lenis instance instead of fighting it with native smooth scrolling.
let activeLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return activeLenis;
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Recompute pin/scrub positions once web fonts swap in, since the large
    // display headings shift layout after triggers are first measured.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    if (window.matchMedia(nativeScrollQuery).matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    gsap.ticker.lagSmoothing(0);
    // Lenis is driven from GSAP's ticker; disabling lag smoothing prevents
    // a delayed tab from producing a large catch-up scroll jump.

    return () => {
      gsap.ticker.remove(updateLenis);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  return lenisRef;
}
