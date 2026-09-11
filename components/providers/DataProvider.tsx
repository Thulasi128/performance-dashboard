'use client';

import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from 'react';
import { DataPoint, TimeAggregation } from '@/lib/types';
import { generateDataPoint } from '@/lib/dataGenerator';

interface DataContextType {
  dataRef: React.MutableRefObject<DataPoint[]>;
  subscribe: (callback: () => void) => () => void;
  // Controls
  isPausedRef: React.MutableRefObject<boolean>;
  togglePause: () => void;
  // Filtering & Aggregation
  activeCategories: Set<string>;
  toggleCategory: (category: string) => void;
  timeAggregation: TimeAggregation;
  setTimeAggregation: (agg: TimeAggregation) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ 
  children, 
  initialData = [] 
}: { 
  children: React.ReactNode;
  initialData: DataPoint[];
}) {
  const dataRef = useRef<DataPoint[]>(initialData);
  const subscribersRef = useRef<Set<() => void>>(new Set());
  const isPausedRef = useRef(false);

  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(['Alpha', 'Beta', 'Gamma', 'Delta']));
  const [timeAggregation, setTimeAggregation] = useState<TimeAggregation>('raw');

  const subscribe = useCallback((callback: () => void) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  const notifySubscribers = useCallback(() => {
    subscribersRef.current.forEach(callback => callback());
  }, []);

  const togglePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Simulate real-time data stream
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        // Add new point
        const newPoint = generateDataPoint();
        dataRef.current.push(newPoint);

        // Keep maximum 20,000 points to prevent memory blowing up indefinitely in the browser
        if (dataRef.current.length > 20000) {
          dataRef.current.shift();
        }

        notifySubscribers();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [notifySubscribers]);

  return (
    <DataContext.Provider value={{ 
      dataRef, 
      subscribe, 
      isPausedRef, 
      togglePause,
      activeCategories,
      toggleCategory,
      timeAggregation,
      setTimeAggregation
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
