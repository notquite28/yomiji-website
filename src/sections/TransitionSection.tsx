import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const kanjiRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Vermilion line scales in
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Product wordmark fades in; vertical drift is owned by the parallax tween
      if (kanjiRef.current) {
        gsap.fromTo(kanjiRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.8, delay: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.to(kanjiRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
      }

      // Subtitle fades in
      if (subRef.current) {
        gsap.fromTo(subRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.6, delay: 0.25, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Divider scales in
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1, scaleX: 1, duration: 0.6, delay: 0.35, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Decorative element parallax drift
      if (decorRef.current) {
        gsap.to(decorRef.current, {
          x: 60,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="transition"
      ref={sectionRef}
      className="relative z-10 bg-charcoal mt-[-1px] overflow-hidden"
    >
      {/* Decorative reading-path line */}
      <div
        ref={decorRef}
        className="absolute bottom-0 right-[10%] w-[1px] h-[300px] bg-vermilion/[0.08]"
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw] flex flex-col items-center text-center relative">
        <div className="w-full flex justify-center pt-16 md:pt-24">
          <div
            ref={lineRef}
            className="w-[1px] h-16 md:h-24 bg-vermilion origin-top"
            style={{ opacity: 0 }}
          />
        </div>

        <div
          ref={kanjiRef}
          className="font-display text-[64px] md:text-[96px] text-off-white leading-none mt-8"
          style={{ letterSpacing: '-1.5px', opacity: 0 }}
        >
          読み道
        </div>

        <p
          ref={subRef}
          className="text-[12px] uppercase tracking-[0.3em] text-dim font-body mt-6"
          style={{ opacity: 0 }}
        >
          Yomiji — the reading path through reviews
        </p>

        <div
          ref={dividerRef}
          className="flex items-center gap-4 mt-10 origin-center"
          style={{ opacity: 0 }}
        >
          <div className="w-12 h-[1px] bg-dim" />
          <div className="w-1.5 h-1.5 bg-vermilion rotate-45" />
          <div className="w-12 h-[1px] bg-dim" />
        </div>
      </div>

      <div className="h-24 md:h-32" />
    </section>
  );
}
