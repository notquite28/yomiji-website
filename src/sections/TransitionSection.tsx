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

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as { isDesktop: boolean; reduceMotion: boolean };

        if (lineRef.current) {
          gsap.fromTo(lineRef.current,
            { scaleY: 0, autoAlpha: 0 },
            {
              scaleY: 1, autoAlpha: 1, duration: reduceMotion ? 0 : 0.8, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 90%', toggleActions: 'play none none reverse' },
            }
          );
        }

        if (kanjiRef.current) {
          gsap.fromTo(kanjiRef.current,
            { autoAlpha: 0 },
            {
              autoAlpha: 1, duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.1, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );

          if (isDesktop && !reduceMotion) {
            gsap.to(kanjiRef.current, {
              y: -30,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
            });
          }
        }

        if (subRef.current) {
          gsap.fromTo(subRef.current,
            { autoAlpha: 0 },
            {
              autoAlpha: 1, duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.25, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        }

        if (dividerRef.current) {
          gsap.fromTo(dividerRef.current,
            { autoAlpha: 0, scaleX: 0 },
            {
              autoAlpha: 1, scaleX: 1, duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.35, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        }

        if (decorRef.current && isDesktop && !reduceMotion) {
          gsap.to(decorRef.current, {
            x: 60,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        }
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="transition"
      ref={sectionRef}
      className="relative z-10 bg-charcoal mt-[-1px] overflow-hidden"
    >
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
