import { useState, useEffect, useRef, useMemo } from 'react';

interface UseVirtualizationProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualizationProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setScrollTop(target.scrollTop);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = itemCount * itemHeight;
    
    // Calculate the range of visible items
    let startIndex = Math.floor(scrollTop / itemHeight);
    let endIndex = Math.min(itemCount - 1, Math.floor((scrollTop + containerHeight) / itemHeight));

    // Add overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(itemCount - 1, endIndex + overscan);

    const offsetY = startIndex * itemHeight;

    return { startIndex, endIndex, totalHeight, offsetY };
  }, [scrollTop, itemCount, itemHeight, containerHeight, overscan]);

  return {
    scrollContainerRef,
    startIndex,
    endIndex,
    totalHeight,
    offsetY
  };
}
