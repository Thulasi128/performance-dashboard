'use client';

import { useState, useEffect, useRef } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { useDataStream } from './useDataStream';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0
  });
  
  const { dataRef } = useDataStream();

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;

    const measureFPS = () => {
      frameCountRef.current++;
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    intervalId = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;
      const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
      
      frameCountRef.current = 0;
      lastTimeRef.current = now;

      // Type asserting for memory API which is non-standard but available in Chrome/Edge
      const memory = (performance as any).memory;
      const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : 0;

      setMetrics({
        fps: currentFps,
        memoryUsage,
        renderTime: 0, // Mocked or calculated elsewhere
        dataProcessingTime: 0 // Mocked or calculated elsewhere
      });
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);

  return { metrics, dataCount: dataRef.current.length };
}
