import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Lessons() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title parallax
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      }

      // Marquee slides in from right
      if (marqueeRef.current) {
        gsap.fromTo(marqueeRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1, duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
        // Continuous horizontal parallax drift
        gsap.to(marqueeRef.current, {
          x: -100,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
        });
      }

      // Steps reveal with alternating direction
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const fromX = i % 2 === 0 ? -80 : 80;

        gsap.fromTo(step,
          { opacity: 0, x: fromX, y: 30 },
          {
            opacity: 1, x: 0, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: step, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const steps = [
    { num: '01', title: 'Choose the queue', desc: 'Start from dashboard recommendations or hand-pick up to 100 lesson-stage subjects.' },
    { num: '02', title: 'Learn with context', desc: 'Meanings, readings, mnemonics, components, context sentences, and used-in chips stay available offline.' },
    { num: '03', title: 'Lock it in', desc: 'The lesson quiz uses the same answer checker and queues lesson starts for WaniKani sync.' },
  ];

  const configs = [
    { label: 'Lesson Cap', value: '1–50' },
    { label: 'Quiz Batch', value: '1–10' },
    { label: 'Ordering', value: 'Level + Type' },
    { label: 'Filters', value: 'Kana / Hidden' },
  ];

  return (
    <section
      id="lessons"
      ref={sectionRef}
      className="relative z-10 bg-charcoal pt-[80px] pb-[56px] md:pt-[160px] md:pb-[72px] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        {/* Section title */}
        <div ref={titleRef} className="mb-12 md:mb-20" style={{ opacity: 0 }}>
          <p className="text-[12px] uppercase tracking-[0.3em] text-vermilion font-body mb-6">
            Learn
          </p>
          <h2
            className="font-display text-[56px] md:text-[100px] lg:text-[130px] text-off-white leading-[0.95]"
            style={{ letterSpacing: '-3px' }}
          >
            Lessons
          </h2>
        </div>

        {/* Scrolling marquee text */}
        <div ref={marqueeRef} className="overflow-hidden mb-16 md:mb-24" style={{ opacity: 0 }}>
          <div className="flex w-max whitespace-nowrap animate-marquee motion-reduce:animate-none">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0" aria-hidden={group === 1}>
                {[1, 2, 3].map((j) => (
                  <span key={j} className="text-[14px] md:text-[16px] uppercase tracking-[0.3em] text-dim/40 font-body mx-4">
                    Pick lessons directly • Learn mnemonics offline • Quiz with kana conversion • Queue starts for sync •
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Two-phase steps */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-16 md:mb-24">
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { stepsRef.current[i] = el; }}
              className="group relative overflow-hidden rounded-[26px] border border-off-white/10 bg-[#0D0E0B] p-6 transition-colors duration-300 hover:border-vermilion/35 md:p-8"
              style={{ opacity: 0 }}
            >
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-vermilion/[0.07] blur-2xl" />
              <span className="text-[64px] md:text-[80px] font-display text-off-white/10 leading-none block">
                {step.num}
              </span>
              <h3 className="text-[20px] md:text-[24px] text-off-white font-body mt-2 mb-3 group-hover:text-vermilion transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[14px] text-dim font-body leading-[170%]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Config grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {configs.map((cfg) => (
            <div
              key={cfg.label}
              className="rounded-2xl border border-off-white/10 bg-[#0D0E0B]/80 p-5 transition-colors duration-300 hover:border-vermilion/25"
            >
              <span className="text-[11px] uppercase tracking-[0.1em] text-dim font-body">{cfg.label}</span>
              <p className="text-[18px] md:text-[20px] text-off-white font-body mt-1">{cfg.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
