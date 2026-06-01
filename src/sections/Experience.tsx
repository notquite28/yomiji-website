import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: 'Senior Product Designer',
    company: 'Polestar',
    years: '2022 — PRESENT',
  },
  {
    role: 'Lead Designer',
    company: 'Aesop Digital',
    years: '2019 — 2022',
  },
  {
    role: 'UI/UX Designer',
    company: 'Sony Design',
    years: '2016 — 2019',
  },
  {
    role: 'Junior Designer',
    company: 'Pentagram Tokyo',
    years: '2014 — 2016',
  },
  {
    role: 'Design Intern',
    company: 'Muji Labo',
    years: '2013 — 2014',
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: 'top' },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[120px] md:py-[240px]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <h2
          ref={headerRef}
          className="font-display text-[48px] md:text-[64px] text-off-white leading-[110%] mb-16 md:mb-24 opacity-0"
          style={{ letterSpacing: '-1.5px' }}
        >
          EXPERIENCE
        </h2>

        <div className="relative">
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-[1px] bg-vermilion"
            style={{ transformOrigin: 'top' }}
          />

          <div className="pl-8 md:pl-12 flex flex-col">
            {experiences.map((exp, index) => (
              <div
                key={index}
                ref={(el) => { itemsRef.current[index] = el; }}
                className="group py-6 border-b border-[#1A1A1A] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-300 -mx-4 px-4 md:-mx-6 md:px-6 cursor-default"
                data-cursor-hover
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                    <h3 className="text-[20px] md:text-[24px] text-off-white font-body group-hover:text-vermilion transition-colors duration-300">
                      {exp.role}
                    </h3>
                    <span className="text-[16px] text-dim font-body">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.2em] text-dim font-body">
                    {exp.years}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
