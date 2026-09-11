'use client';

import React from 'react';
import { TimeAggregation } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';

export function TimeRangeSelector() {
  const { timeAggregation, setTimeAggregation } = useDataStream();

  return (
    <div className="control-panel">
      <h3>Aggregation</h3>
      <div className="controls-group">
        <select 
          value={timeAggregation} 
          onChange={(e) => setTimeAggregation(e.target.value as TimeAggregation)}
          className="select-input"
        >
          <option value="raw">Raw (Real-time)</option>
          <option value="1min">1 Minute</option>
          <option value="5min">5 Minutes</option>
          <option value="1hour">1 Hour</option>
        </select>
      </div>
      <p className="text-small text-muted">Note: Real-time handles 50k+ raw points. Aggregations average data dynamically.</p>
    </div>
  );
}
