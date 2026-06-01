import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clients = [
  'Nike', 'Sony', 'Polestar', 'Aesop', 'Muji', 'Uniqlo',
  'Shiseido', 'Issey Miyake', 'Comme des Garcons', 'Kapital',
];

const services = [
  'Art Direction',
  'UI Design',
  'UX Strategy',
  'Brand Identity',
  'Motion Design',
  'Design Systems',
];

export default function Biography() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (textRef.current) {
        const words = textRef.current.querySelectorAll('.bio-word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (servicesRef.current) {
        const items = servicesRef.current.querySelectorAll('.service-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const bioText =
    'I believe in the power of restraint. Every element must earn its place. My work sits at the intersection of Japanese minimalism and functional design, crafting digital experiences that feel inevitable rather than imposed. I approach each project as a meditation on form, removing the unnecessary until only essence remains.';

  return (
    <section
      id="info"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[120px] md:py-[240px]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="md:w-[200px] flex-shrink-0">
            <h2
              className="font-display text-[48px] md:text-[64px] text-off-white leading-[110%] sticky top-32 whitespace-nowrap"
              style={{ letterSpacing: '-1.5px' }}
            >
              ( INFO )
            </h2>
          </div>

          <div className="flex-1 flex flex-col gap-20">
            <p
              ref={textRef}
              className="text-[20px] md:text-[24px] text-off-white leading-[150%] font-body max-w-[800px]"
            >
              {bioText.split(' ').map((word, i) => (
                <span key={i} className="bio-word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </p>

            <div className="overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...clients, ...clients].map((client, i) => (
                  <span
                    key={i}
                    className="text-[12px] uppercase tracking-[0.2em] text-dim font-body mx-6"
                  >
                    {client}
                    <span className="mx-6 text-dim/50">•</span>
                  </span>
                ))}
              </div>
            </div>

            <div ref={servicesRef}>
              <h3 className="text-[12px] uppercase tracking-[0.2em] text-dim font-body mb-8">
                SERVICES
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service}
                    className="service-item text-[16px] text-off-white font-body py-3 border-b border-[#1A1A1A] hover:border-vermilion transition-colors duration-300"
                    data-cursor-hover
                  >
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
