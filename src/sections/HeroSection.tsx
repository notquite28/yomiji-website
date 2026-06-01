import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroVideoSrc = `${import.meta.env.BASE_URL}videos/hero-sequence.mp4`;

export default function HeroSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    const uiOverlay = uiRef.current;
    const blackout = blackoutRef.current;

    if (!wrap || !video || !uiOverlay || !blackout) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches) {
      gsap.set(blackout, { opacity: 0 });
      gsap.set(uiOverlay, { opacity: 1 });
      video.pause();
      video.currentTime = 0;
      return undefined;
    }

    video.pause();
    video.currentTime = 0;

    let disposed = false;
    let isSetup = false;
    let st: ScrollTrigger | null = null;
    const setupScrollScrub = () => {
      if (disposed || isSetup) return;
      isSetup = true;

      const videoDuration = video.duration || 4;

      // Force initial states
      gsap.set(blackout, { opacity: 0 });
      gsap.set(uiOverlay, { opacity: 1 });

      st = ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: wrap.querySelector('.hero-pinned-content'),
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // --- VIDEO SCRUB (0% to 85%) ---
          // Cap video at 85% progress so it doesn't show final lush frames
          const videoProgress = Math.min(progress / 0.85, 1);
          const targetTime = videoProgress * videoDuration * 0.95; // stay 5% shy of end frame
          try {
            if (Math.abs(video.currentTime - targetTime) > 0.005) {
              video.currentTime = targetTime;
            }
          } catch { /* noop */ }

          // --- BLACKOUT (75% to 90%) — DIRECT, zero scrub lag ---
          // Drive opacity directly from progress, not from GSAP timeline
          // so there's no smoothing delay hiding the video
          let blackoutOpacity = 0;
          if (progress > 0.75) {
            blackoutOpacity = Math.min(1, (progress - 0.75) / 0.15);
          }
          blackout.style.opacity = String(blackoutOpacity);

          // --- UI FADE (0% to 50%) ---
          let uiOpacity = 1;
          if (progress > 0.35) {
            uiOpacity = Math.max(0, 1 - (progress - 0.35) / 0.15);
          }
          uiOverlay.style.opacity = String(uiOpacity);
        },
        onLeave: () => {
          // Hard-force everything to final state
          blackout.style.opacity = '1';
          uiOverlay.style.opacity = '0';
          try { video.currentTime = 0; } catch { /* noop */ }
        },
        onEnterBack: () => {
          gsap.set(blackout, { opacity: 0 });
          gsap.set(uiOverlay, { opacity: 1 });
        },
      });
    };

    const handleLoadedData = () => {
      if (!isSetup) setupScrollScrub();
    };

    if (video.readyState >= 4) {
      setupScrollScrub();
    } else {
      video.addEventListener('canplaythrough', setupScrollScrub, { once: true });
      video.addEventListener('loadeddata', handleLoadedData, { once: true });
    }

    return () => {
      disposed = true;
      video.removeEventListener('canplaythrough', setupScrollScrub);
      video.removeEventListener('loadeddata', handleLoadedData);
      if (st) st.kill();
      isSetup = false;
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="hero-scroll-sequence relative w-full h-screen bg-charcoal motion-safe:h-[400vh]"
    >
      <div className="hero-pinned-content w-full h-screen overflow-hidden bg-charcoal relative">
        {/* Permanent charcoal backing */}
        <div className="absolute inset-0 bg-charcoal z-[5]" />

        <video
          ref={videoRef}
          className="hero-background-video absolute inset-0 w-full h-full object-cover z-[6]"
          src={heroVideoSrc}
          muted
          playsInline
          preload="auto"
          style={{ pointerEvents: 'none' }}
        />

        {/* Blackout overlay — opacity driven directly in onUpdate, zero GSAP lag */}
        <div
          ref={blackoutRef}
          className="absolute inset-0 bg-charcoal z-[15] pointer-events-none"
          style={{ opacity: 0 }}
        />


        {/* UI overlay — opacity driven directly in onUpdate */}
        <div
          ref={uiRef}
          className="hero-ui-overlay absolute inset-0 z-[20] flex flex-col justify-between p-4 md:p-10"
        >
          <div />
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-off-white font-body">
                読路 / YOMIJI
              </span>
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-dim font-body">
                Offline WaniKani study
              </span>
            </div>
            <div className="flex flex-col gap-1 text-left sm:text-right">
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-off-white font-body">
                Local-first / open source
              </span>
              <span className="text-[10px] md:text-[12px] uppercase tracking-[0.18em] md:tracking-[0.2em] text-dim font-body">
                Reviews. Lessons. Practice.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
