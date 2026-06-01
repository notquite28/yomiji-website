import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    label: 'Queue State Machine',
    title: 'Wrong answers re-enter the active queue with a five-item delay.',
    detail: 'Batch sizes from 1–15, wrap-up mode, meaning/reading completion, and a clean review summary keep long sessions predictable.',
  },
  {
    label: 'Answer Intelligence',
    title: 'Romaji becomes kana, typos are forgiven, and suspicious answers are caught.',
    detail: 'Fuzzy Levenshtein matching, exact-match mode, other-reading detection, okurigana checks, and queued synonyms are built in.',
  },
  {
    label: 'Nine Orderings',
    title: 'Oldest, newest, SRS-first, current-level-first, alternating, random — choose the rhythm.',
    detail: 'Review ordering is part of the product, not an afterthought. Pick the queue shape that fits the session.',
  },
];

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions as { isMobile: boolean; reduceMotion: boolean };

        if (titleRef.current) {
          gsap.fromTo(titleRef.current,
            { autoAlpha: 0, x: reduceMotion ? 0 : isMobile ? -24 : -100 },
            {
              autoAlpha: 1, x: 0, duration: reduceMotion ? 0 : 1, ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
            }
          );
        }

        itemsRef.current.forEach((item, i) => {
          if (!item) return;
          gsap.fromTo(item,
            { autoAlpha: 0, x: reduceMotion ? 0 : isMobile ? 28 : 120 },
            {
              autoAlpha: 1, x: 0, duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : i * 0.12, ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
          const parallax = item.querySelector<HTMLDivElement>('.review-card-content');
          if (!parallax || reduceMotion || isMobile) return;

          gsap.to(parallax, {
            x: -30,
            ease: 'none',
            scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        });
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative z-10 bg-charcoal pt-[56px] pb-[80px] md:pt-[72px] md:pb-[160px] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <div ref={titleRef} className="mb-20 md:mb-32" style={{ opacity: 0 }}>
          <p className="text-[12px] uppercase tracking-[0.3em] text-vermilion font-body mb-6">
            Review Engine
          </p>
          <h2
            className="font-display text-[52px] md:text-[100px] lg:text-[130px] text-off-white leading-[0.95]"
            style={{ letterSpacing: '-3px' }}
          >
            Reviews
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feat, i) => (
            <div
              key={feat.label}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="group relative min-h-[360px] overflow-hidden rounded-[28px] border border-off-white/10 bg-[#0D0E0B] p-6 md:p-8"
              style={{ opacity: 0 }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-vermilion/[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-vermilion/35 to-transparent" />
              <div className="review-card-content relative flex h-full flex-col">
                <div className="mb-10 flex items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-vermilion font-body">
                    {feat.label}
                  </span>
                  <span className="font-display text-[54px] leading-none text-off-white/[0.06]">
                    0{i + 1}
                  </span>
                </div>
                <h3
                  className="font-display text-[24px] leading-[1.12] text-off-white transition-colors duration-500 group-hover:text-vermilion md:text-[30px] lg:text-[34px]"
                  style={{ letterSpacing: '-0.5px' }}
                >
                  {feat.title}
                </h3>
                <p className="mt-auto pt-8 text-[13px] md:text-[14px] text-dim font-body leading-[170%]">
                  {feat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-vermilion/20 bg-vermilion/[0.06] p-6 md:p-8">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-vermilion/15 blur-3xl" />
            <p className="relative text-[11px] uppercase tracking-[0.24em] text-vermilion font-body">
              Anki Mode
            </p>
            <h3 className="relative mt-8 font-display text-[34px] leading-[1.05] text-off-white md:text-[54px]">
              When typing slows you down, reveal and self-grade.
            </h3>
            <p className="relative mt-6 max-w-[620px] text-[14px] leading-[175%] text-dim font-body md:text-[15px]">
              See the item, reveal meaning and reading together, then grade yourself with a deliberate tap. Built for catch-up sessions, tired evenings, and recognition-first practice.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {['Read the card', 'Reveal answers', 'Self-grade'].map((step, i) => (
              <div key={step} className="rounded-[22px] border border-off-white/10 bg-[#0D0E0B] p-5">
                <span className="font-display text-[48px] leading-none text-off-white/10">
                  0{i + 1}
                </span>
                <p className="mt-8 text-[13px] uppercase tracking-[0.18em] text-off-white font-body">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
