import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    const tl = gsap.timeline();

    tl.to(textRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
      .to(
        containerRef.current,
        {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete,
        },
        '-=0.2'
      );
  }, [onComplete]);

  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (circleRef.current) {
        const circumference = 2 * Math.PI * 48;
        const offset = circumference - p * circumference;
        circleRef.current.style.strokeDashoffset = String(offset);
      }

      if (p >= 1) {
        clearInterval(interval);
        handleComplete();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [handleComplete]);

  const circumference = 2 * Math.PI * 48;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-charcoal flex items-center justify-center"
    >
      <div ref={textRef} className="relative flex flex-col items-center gap-8">
        <span
          className="font-display text-off-white text-[96px] leading-none tracking-[-1.5px]"
          style={{ letterSpacing: '-1.5px' }}
        >
          読路
        </span>

        <div className="relative w-[100px] h-[100px]">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#6B6B6B"
              strokeWidth="1"
            />
            <circle
              ref={circleRef}
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#FF3B30"
              strokeWidth="1"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
            />
          </svg>
        </div>

        <span className="text-[12px] uppercase tracking-[0.2em] text-dim font-body">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
