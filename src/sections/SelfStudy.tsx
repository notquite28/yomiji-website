import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    num: '01',
    title: 'Recent Mistakes',
    desc: 'Pulls misses from the last 24 hours so fragile items get drilled before they fade.',
  },
  {
    num: '02',
    title: 'Leech Radar',
    desc: 'Ranks high incorrect-to-correct ratios with a configurable threshold across apprentice or all items.',
  },
  {
    num: '03',
    title: 'Burned Refresh',
    desc: 'Practice burned subjects in the review UI without changing SRS or submitting progress.',
  },
];

export default function SelfStudy() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title slides in
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, x: -80 },
          {
            opacity: 1, x: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Vertical line grows
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Each item: dramatic reveal with parallax
      itemsRef.current.forEach((item, i) => {
        if (!item) return;

        gsap.fromTo(item,
          { opacity: 0, y: 80 },
          {
            opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse' },
          }
        );

        // Each card drifts at different speed
        const parallax = item.querySelector<HTMLDivElement>('.self-study-card-content');
        if (!parallax) return;

        gsap.to(parallax, {
          y: -20 * (i + 1),
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="selfstudy"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[80px] md:py-[160px] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Left: Title with vertical line */}
          <div className="md:w-[300px] flex-shrink-0 relative">
            <div
              ref={lineRef}
              className="absolute left-0 top-0 w-[1px] h-full bg-vermilion origin-top hidden md:block"
              style={{ transform: 'scaleY(0)' }}
            />
            <div ref={titleRef} className="md:pl-8" style={{ opacity: 0 }}>
              <p className="text-[12px] uppercase tracking-[0.3em] text-vermilion font-body mb-6">
                Practice
              </p>
              <h2
                className="font-display text-[48px] md:text-[72px] text-off-white leading-[1.05]"
                style={{ letterSpacing: '-1.5px' }}
              >
                Self-Study
              </h2>
              <p className="text-[15px] text-dim font-body leading-[170%] mt-6">
                Practice mode uses the review engine without touching WaniKani SRS.
              </p>
            </div>
          </div>

          {/* Right: Stacked numbered items */}
          <div className="flex-1 grid gap-4">
            {items.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => { itemsRef.current[i] = el; }}
                className="group relative overflow-hidden rounded-[24px] border border-off-white/10 bg-[#0D0E0B] p-6 transition-colors duration-300 hover:border-vermilion/30 md:p-7"
                style={{ opacity: 0 }}
              >
                <div className="absolute right-5 top-5 font-display text-[58px] leading-none text-off-white/[0.05]">
                  {item.num}
                </div>
                <div className="self-study-card-content max-w-[680px]">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-vermilion font-body">
                    Practice {item.num}
                  </span>
                  <h3 className="mt-4 text-[22px] md:text-[28px] text-off-white font-body group-hover:text-vermilion transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-dim font-body leading-[170%] mt-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
