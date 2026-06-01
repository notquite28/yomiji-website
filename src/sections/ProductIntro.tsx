import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProductIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const decorRevealRef = useRef<HTMLDivElement>(null);
  const decorParallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const elements = [badgeRef.current, titleRef.current, descRef.current, tagsRef.current, buttonsRef.current].filter(Boolean);

      gsap.fromTo(elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      // Decorative kanji parallax - moves horizontally as you scroll
      if (decorRevealRef.current && decorParallaxRef.current) {
        gsap.fromTo(decorRevealRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 0.04, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.fromTo(decorParallaxRef.current,
          { x: 100 },
          {
            x: -80,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[80px] md:py-[120px] overflow-hidden"
    >
      <div
        ref={decorRevealRef}
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        <div
          ref={decorParallaxRef}
          className="font-display text-[300px] md:text-[500px] text-off-white leading-none"
        >
          道
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw] relative">
        <div className="flex flex-col items-center text-center max-w-[780px] mx-auto gap-8">
          <div ref={badgeRef} className="flex flex-wrap items-center justify-center gap-3" style={{ opacity: 0 }}>
            <span className="text-[12px] uppercase tracking-[0.24em] text-vermilion font-body">Offline-first WaniKani client</span>
          </div>

          <h2
            ref={titleRef}
            className="font-display text-[34px] md:text-[56px] text-off-white leading-[1.08]"
            style={{ letterSpacing: '-1.2px', opacity: 0 }}
          >
            Reviews, lessons, and search that keep moving without a connection.
          </h2>

          <p ref={descRef} className="text-[16px] md:text-[20px] text-dim font-body leading-[160%]" style={{ opacity: 0 }}>
            読路 stores your synced WaniKani subjects, assignments, study materials, and review stats in SQLite. Study on the train, clear reviews offline, then flush pending progress when you reconnect.
          </p>

          <div ref={tagsRef} className="flex flex-wrap justify-center gap-4" style={{ opacity: 0 }}>
            {['Android', 'iOS', 'SQLite cache', 'Pending write sync'].map((tag) => (
              <span key={tag} className="text-[12px] uppercase tracking-[0.15em] text-dim font-body px-4 py-2 border border-[#1A1A1A] rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mt-4" style={{ opacity: 0 }}>
            <a href="https://github.com/notquite28/yomiji" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-off-white text-charcoal text-[13px] uppercase tracking-[0.15em] font-body rounded-full hover:bg-vermilion hover:text-off-white transition-colors duration-300"
              data-cursor-hover>
              <Github size={16} /> Get it on GitHub
            </a>
            <a href="https://github.com/notquite28/yomiji/releases" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-[#1A1A1A] text-off-white text-[13px] uppercase tracking-[0.15em] font-body rounded-full hover:border-vermilion hover:text-vermilion transition-colors duration-300"
              data-cursor-hover>
              <Download size={16} /> Releases
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
