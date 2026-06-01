import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const phones = [
  {
    id: 1,
    src: assetUrl('images/yomiji/dash.jpg'),
    srcSet: `${assetUrl('images/yomiji/dash-540.webp')} 540w, ${assetUrl('images/yomiji/dash-720.webp')} 720w, ${assetUrl('images/yomiji/dash.jpg')} 1440w`,
    label: 'Dashboard',
  },
  {
    id: 2,
    src: assetUrl('images/yomiji/reviews.jpg'),
    srcSet: `${assetUrl('images/yomiji/reviews-540.webp')} 540w, ${assetUrl('images/yomiji/reviews-720.webp')} 720w, ${assetUrl('images/yomiji/reviews.jpg')} 1440w`,
    label: 'Reviews',
  },
  {
    id: 3,
    src: assetUrl('images/yomiji/lessons.jpg'),
    srcSet: `${assetUrl('images/yomiji/lessons-540.webp')} 540w, ${assetUrl('images/yomiji/lessons-720.webp')} 720w, ${assetUrl('images/yomiji/lessons.jpg')} 1440w`,
    label: 'Lessons',
  },
  {
    id: 4,
    src: assetUrl('images/yomiji/anki.jpg'),
    srcSet: `${assetUrl('images/yomiji/anki-540.webp')} 540w, ${assetUrl('images/yomiji/anki-720.webp')} 720w, ${assetUrl('images/yomiji/anki.jpg')} 1440w`,
    label: 'Anki Mode',
  },
  {
    id: 5,
    src: assetUrl('images/yomiji/subject.jpg'),
    srcSet: `${assetUrl('images/yomiji/subject-540.webp')} 540w, ${assetUrl('images/yomiji/subject-720.webp')} 720w, ${assetUrl('images/yomiji/subject.jpg')} 1440w`,
    label: 'Subjects',
  },
];

export default function PhoneShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
        const phoneEls = gsap.utils.toArray<HTMLDivElement>('.phone-item', section);

        if (headerRef.current) {
          gsap.fromTo(headerRef.current,
            { autoAlpha: 0, y: reduceMotion ? 0 : 30 },
            {
              autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : 0.8, ease: 'power2.out',
              scrollTrigger: reduceMotion ? undefined : { trigger: section, start: 'top 85%', toggleActions: 'play none none reverse' },
            }
          );
        }

        if (reduceMotion) {
          gsap.set(phoneEls, { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, clearProps: 'willChange' });
          return;
        }

        if (isMobile) {
          gsap.set(phoneEls, { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 0 });

          phoneEls.forEach((phone, i) => {
            gsap.fromTo(phone,
              { autoAlpha: 0, y: 28 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                delay: i * 0.06,
                ease: 'power2.out',
                scrollTrigger: { trigger: phone, start: 'top 88%', toggleActions: 'play none none reverse' },
              }
            );
          });
          return;
        }

        if (!isDesktop) return;

        phoneEls.forEach((phone, i) => {
          const offset = i - 2;
          gsap.set(phone, {
            x: offset * 132,
            y: Math.abs(offset) * 34,
            rotation: offset * 5,
            scale: 1,
            autoAlpha: 1,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.8}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(phoneEls, {
          x: 0,
          y: (i) => (i - 2) * 8,
          rotation: (i) => (i - 2) * 2,
          scale: (i) => 1 - Math.abs(i - 2) * 0.045,
          duration: 0.62,
          ease: 'power2.inOut',
          stagger: { each: 0.015, from: 'center' },
        });

        tl.to(phoneEls, {
          y: (i) => -window.innerHeight * 0.42 + (i - 2) * 8,
          scale: (i) => 0.78 - Math.abs(i - 2) * 0.03,
          autoAlpha: (i) => (Math.abs(i - 2) > 1 ? 0.45 : 0.82),
          duration: 0.38,
          ease: 'power2.in',
        });
      },
      section
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[80px] md:py-[120px] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <div ref={headerRef} className="text-center mb-12 md:mb-16" style={{ opacity: 0 }}>
          <p className="text-[12px] uppercase tracking-[0.3em] text-vermilion font-body mb-4">
            Five paths. One local cache.
          </p>
          <h2
            className="font-display text-[36px] md:text-[48px] text-off-white leading-[1.1]"
            style={{ letterSpacing: '-1px' }}
          >
            Study anywhere, then sync cleanly
          </h2>
        </div>

        <div className="relative -mx-4 flex min-h-[440px] snap-x snap-mandatory items-center gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-auto md:min-h-[620px] md:justify-center md:gap-0 md:overflow-visible md:px-0 md:pb-0">
          {phones.map((phone, i) => (
            <div
              key={phone.id}
              className="phone-item relative w-[180px] shrink-0 snap-center md:absolute md:w-[240px]"
              style={{
                zIndex: 10 - Math.abs(i - 2),
                willChange: 'transform',
              }}
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-off-white/10 bg-[#11120F] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.6)]">
                <div className="mx-auto mb-2 h-5 w-20 rounded-full bg-off-white/10" />
                <div className="overflow-hidden rounded-[1.35rem] bg-charcoal aspect-[720/1584]">
                  <img
                    src={phone.src}
                    srcSet={phone.srcSet}
                    sizes="(max-width: 767px) 180px, 240px"
                    alt={`${phone.label} screen`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-20" />
              </div>
              <div className="absolute inset-0 -z-10 translate-y-4 scale-95 rounded-[2rem] bg-black/25 blur-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
