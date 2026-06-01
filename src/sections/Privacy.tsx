import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const words = [
  { text: 'PRIVATE', sub: 'Token in secure storage. Study data in your local cache.' },
  { text: 'OFFLINE', sub: 'Reviews, lessons, search, and browsing keep working without signal.' },
  { text: 'SYNC', sub: 'Pending reviews, lessons, synonyms, and notes flush when you reconnect.' },
  { text: 'OPEN SOURCE', sub: 'Apache 2.0. Based on Tsurukame. Built in public.' },
];

export default function Privacy() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions as { isDesktop: boolean; isMobile: boolean; reduceMotion: boolean };

        if (reduceMotion) {
          gsap.set(track, { clearProps: 'transform' });
          return;
        }

        if (isMobile) {
          gsap.set(track, { x: 0, y: 0 });
          gsap.to(track, {
            y: () => -(track.scrollHeight - window.innerHeight),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${track.scrollHeight - window.innerHeight}`,
              scrub: 1,
              pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          return;
        }

        if (!isDesktop) return;

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="privacy"
      ref={sectionRef}
      className="relative z-20 overflow-hidden bg-charcoal motion-reduce:overflow-visible md:h-[calc(100vh+300vw)] motion-reduce:md:h-auto"
    >
      <div
        ref={pinRef}
        className="relative z-20 flex h-[100svh] w-full items-start overflow-hidden bg-charcoal motion-reduce:h-auto motion-reduce:overflow-visible md:h-screen md:items-center motion-reduce:md:h-auto"
      >
        <div
          ref={trackRef}
          className="flex w-full flex-col gap-0 px-5 motion-reduce:md:w-full motion-reduce:md:flex-col md:w-[400vw] md:flex-row md:gap-0 md:px-0"
        >
          {words.map((word, i) => (
            <article
              key={word.text}
              className="relative flex min-h-[100svh] w-full shrink-0 flex-col justify-center overflow-hidden border-t border-off-white/10 bg-transparent py-16 md:h-screen md:w-screen md:border-0 md:px-[8vw]"
            >
              <span className="absolute right-6 top-6 font-body text-[13px] leading-none tracking-[0.32em] text-vermilion/50 md:right-[8vw] md:top-[14vh]">
                0{i + 1} / 04
              </span>
              <p className="mb-6 text-[12px] uppercase tracking-[0.3em] text-vermilion font-body">
                Trust Layer
              </p>
              <h2 className="max-w-[920px] font-display text-[52px] leading-[0.92] tracking-[-3px] text-off-white md:text-[132px] lg:text-[168px]">
                {word.text}
              </h2>
              <p className="mt-8 max-w-[620px] text-[15px] uppercase leading-[180%] tracking-[0.2em] text-dim font-body md:text-[18px]">
                {word.sub}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
