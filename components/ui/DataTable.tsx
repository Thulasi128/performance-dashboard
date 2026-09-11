'use client';

import React, { useState, useEffect } from 'react';
import { useDataStream } from '@/hooks/useDataStream';
import { useVirtualization } from '@/hooks/useVirtualization';
import { DataPoint } from '@/lib/types';

export function DataTable() {
  const { dataRef, subscribe } = useDataStream();
  // Force update to react to data stream
  const [, setTick] = useState(0);

  useEffect(() => {
    // Throttle the table updates to once every 500ms to save CPU,
    // the charts are handling the real-time visual part.
    let lastUpdate = 0;
    const unsubscribe = subscribe(() => {
      const now = Date.now();
      if (now - lastUpdate > 500) {
        lastUpdate = now;
        setTick(t => t + 1);
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const data = dataRef.current;
  const itemHeight = 35;
  const containerHeight = 400;

  const { scrollContainerRef, startIndex, endIndex, totalHeight, offsetY } = useVirtualization({
    itemCount: data.length,
    itemHeight,
    containerHeight,
  });

  const visibleData = data.slice(startIndex, endIndex + 1);

  return (
    <div className="data-table-container">
      <div className="table-header">
        <div className="col">ID</div>
        <div className="col">Time</div>
        <div className="col">Category</div>
        <div className="col">Value</div>
      </div>
      <div 
        className="table-body-scroll" 
        ref={scrollContainerRef}
        style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${offsetY}px)` }}>
            {visibleData.map((item: DataPoint) => (
              <div key={item.id} className="table-row" style={{ height: itemHeight }}>
                <div className="col">{item.id}</div>
                <div className="col">{new Date(item.timestamp).toLocaleTimeString()}</div>
                <div className="col">{item.category}</div>
                <div className="col">{item.value.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
