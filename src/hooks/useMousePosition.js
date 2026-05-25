import { useState, useEffect, useCallback, useRef } from 'react';

export function useMousePosition(elementRef = null) {
  const [position, setPosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      let x, y, normalizedX, normalizedY;

      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        normalizedX = (x / rect.width - 0.5) * 2;
        normalizedY = (y / rect.height - 0.5) * 2;
      } else {
        x = e.clientX;
        y = e.clientY;
        normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
        normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      }

      setPosition({ x, y, normalizedX, normalizedY });
    });
  }, [elementRef]);

  useEffect(() => {
    const target = elementRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, elementRef]);

  return position;
}
