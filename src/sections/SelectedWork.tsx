import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const projects = [
  {
    id: 1,
    title: 'Monolith',
    tags: ['Art Direction', '3D Design'],
    image: assetUrl('images/work-1.jpg'),
  },
  {
    id: 2,
    title: 'Meridian Dashboard',
    tags: ['UI Design', 'Data Visualization'],
    image: assetUrl('images/work-2.jpg'),
  },
  {
    id: 3,
    title: 'Echo Type',
    tags: ['Typography', 'Branding'],
    image: assetUrl('images/work-3.jpg'),
  },
  {
    id: 4,
    title: 'Aurum Collection',
    tags: ['E-Commerce', 'Luxury'],
    image: assetUrl('images/work-4.jpg'),
  },
];

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLHeadingElement>(null);

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

      itemsRef.current.forEach((item) => {
        if (!item) return;

        const image = item.querySelector('.work-image') as HTMLElement;
        if (!image) return;

        gsap.set(item, { opacity: 0, y: 50 });

        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        const isDesktop = window.innerWidth >= 768;
        if (isDesktop) {
          const itemOffset = item.getBoundingClientRect().left;
          const viewportWidth = window.innerWidth;
          const offsetPercentage = itemOffset / viewportWidth;
          const isCenter = Math.abs(offsetPercentage - 0.5) < 0.1;
          const isLeft = offsetPercentage < 0.5;
          const endScale = isCenter ? 1.2 : 1.0;
          const xOffset = isLeft ? -150 : 150;

          gsap.set(image, { scale: 0.8, x: isCenter ? 0 : xOffset });

          gsap.to(image, {
            scale: endScale,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 bg-charcoal py-[120px] md:py-[240px]"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-[2.5vw]">
        <h2
          ref={headerRef}
          className="font-display text-[48px] md:text-[64px] text-off-white leading-[110%] mb-16 md:mb-24 opacity-0"
          style={{ letterSpacing: '-1.5px' }}
        >
          SELECTED WORK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="work-item group cursor-pointer"
              data-cursor-hover
            >
              <div className="overflow-hidden relative aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="work-image w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-600"
                  style={{ willChange: 'transform' }}
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-600" />
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <h3 className="text-[24px] text-off-white font-body group-hover:text-vermilion transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] text-dim font-body"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
