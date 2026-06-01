import { useEffect, useRef } from 'react';

const customCursorQuery = '(hover: hover) and (pointer: fine) and (min-width: 768px)';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !window.matchMedia(customCursorQuery).matches) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const onMouseEnterLink = () => {
      isHoveringRef.current = true;
    };

    const onMouseLeaveLink = () => {
      isHoveringRef.current = false;
    };

    const animate = () => {
      const lerp = 0.15;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      const size = isHoveringRef.current ? 24 : 8;
      const borderRadius = isHoveringRef.current ? 0 : 50;
      const bg = isHoveringRef.current ? 'transparent' : '#FF3B30';
      const border = isHoveringRef.current ? '1px solid #FF3B30' : 'none';

      cursor.style.transform = `translate(${posRef.current.x - size / 2}px, ${posRef.current.y - size / 2}px)`;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;
      cursor.style.background = bg;
      cursor.style.border = border;
      cursor.style.borderRadius = `${borderRadius}%`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);

    const links = document.querySelectorAll('a, button, [data-cursor-hover]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', onMouseEnterLink);
      link.addEventListener('mouseleave', onMouseLeaveLink);
    });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onMouseEnterLink);
        link.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return cursorRef;
}
