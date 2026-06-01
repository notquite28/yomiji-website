import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockContentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isMobile, reduceMotion } = context.conditions as { isDesktop: boolean; isMobile: boolean; reduceMotion: boolean };

        if (decorRef.current && isDesktop && !reduceMotion) {
          gsap.to(decorRef.current, {
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        }

        blocksRef.current.forEach((block, i) => {
          if (!block) return;

          gsap.fromTo(block,
            { autoAlpha: 0, y: reduceMotion ? 0 : isMobile ? 20 : 30 },
            {
              autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : i * 0.1, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );

          const blockContent = blockContentsRef.current[i];
          if (!blockContent || !isDesktop || reduceMotion) return;

          gsap.to(blockContent, {
            y: -15 * (i + 1),
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
          });
        });
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative z-10 bg-charcoal border-t border-[#1A1A1A] overflow-hidden"
    >
      <div
        ref={decorRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[200px] md:text-[300px] text-off-white/[0.02] pointer-events-none select-none leading-none"
      >
        路
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw] py-16 md:py-24 relative">
        <div
          ref={(el) => { blocksRef.current[0] = el; blockContentsRef.current[0] = el?.firstElementChild as HTMLDivElement | null; }}
          className="text-center mb-16"
          style={{ opacity: 0 }}
        >
          <div>
          <p className="text-[12px] uppercase tracking-[0.3em] text-vermilion font-body mb-4">
            Open Source
          </p>
          <p className="text-[16px] text-dim font-body max-w-[500px] mx-auto leading-[170%]">
            Licensed under the Apache 2.0 license. Based on{' '}
            <a
              href="https://github.com/davidsansome/tsurukame"
              target="_blank"
              rel="noopener noreferrer"
              className="text-off-white hover:text-vermilion transition-colors underline underline-offset-4"
            >
              Tsurukame
            </a>{' '}
            by David Sansome.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['React Native 0.83', 'TypeScript 5.9', 'SQLite', 'Expo SDK 55', 'React Navigation 7', 'Jest'].map((tech) => (
              <span
                key={tech}
                className="text-[11px] uppercase tracking-[0.1em] text-dim font-body px-3 py-1.5 border border-[#1A1A1A] rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href="https://github.com/notquite28/yomiji"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-[#1A1A1A] text-off-white text-[12px] uppercase tracking-[0.15em] font-body rounded-full hover:border-vermilion hover:text-vermilion transition-colors duration-300"
            data-cursor-hover
          >
            <Github size={15} />
            View Source on GitHub
          </a>
          </div>
        </div>

        <div
          ref={(el) => { blocksRef.current[1] = el; blockContentsRef.current[1] = el?.firstElementChild as HTMLDivElement | null; }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1A1A1A]"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <span className="font-display text-off-white text-[18px]">読路</span>
            <span className="text-dim text-[12px] font-body">Yomiji</span>
          </div>

          <p className="text-[12px] text-dim font-body">
            &copy; 2026 読路 — A quieter path.
          </p>

          <a
            href="https://github.com/notquite28/yomiji"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] uppercase tracking-[0.15em] text-dim font-body hover:text-off-white transition-colors"
          >
            GitHub
          </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
