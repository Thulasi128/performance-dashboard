'use client';

import { useData } from '@/components/providers/DataProvider';

export function useDataStream() {
  const { 
    dataRef, 
    subscribe, 
    isPausedRef, 
    togglePause,
    activeCategories,
    toggleCategory,
    timeAggregation,
    setTimeAggregation 
  } = useData();

  return {
    dataRef,
    subscribe,
    isPausedRef,
    togglePause,
    activeCategories,
    toggleCategory,
    timeAggregation,
    setTimeAggregation
  };
}
