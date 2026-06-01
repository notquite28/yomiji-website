import { useCustomCursor } from '@/hooks/useCustomCursor';

export default function CustomCursor() {
  const cursorRef = useCustomCursor();

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:block"
      style={{
        width: '8px',
        height: '8px',
        background: '#FF3B30',
        borderRadius: '50%',
        transition: 'width 0.3s, height 0.3s, background 0.3s, border 0.3s, border-radius 0.3s',
        willChange: 'transform',
      }}
    />
  );
}
