import { useEffect, useRef } from 'react';

export function useChartInteractivity(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const zoomRef = useRef(1);
  const panOffsetRef = useRef(0);
  
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Adjust zoom level
      const zoomSpeed = 0.001;
      let newZoom = zoomRef.current - e.deltaY * zoomSpeed;
      // Limit zoom between 0.1x and 10x
      newZoom = Math.max(0.1, Math.min(newZoom, 10));
      zoomRef.current = newZoom;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastXRef.current = e.clientX;
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      
      // Pan offset in arbitrary units (pixels scaled by zoom roughly)
      panOffsetRef.current += deltaX / zoomRef.current;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'default';
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'default';
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef]);

  return {
    zoomRef,
    panOffsetRef
  };
}
