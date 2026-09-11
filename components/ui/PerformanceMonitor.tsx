'use client';

import React from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export function PerformanceMonitor() {
  const { metrics, dataCount } = usePerformanceMonitor();

  // Basic color coding for FPS
  const fpsColor = metrics.fps >= 55 ? '#10b981' : metrics.fps >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="perf-monitor">
      <div className="perf-stat">
        <span className="perf-label">FPS:</span>
        <span className="perf-value" style={{ color: fpsColor }}>{metrics.fps}</span>
      </div>
      <div className="perf-stat">
        <span className="perf-label">Memory:</span>
        <span className="perf-value">{metrics.memoryUsage > 0 ? `${metrics.memoryUsage} MB` : 'N/A'}</span>
      </div>
      <div className="perf-stat">
        <span className="perf-label">Data Points:</span>
        <span className="perf-value">{dataCount.toLocaleString()}</span>
      </div>
    </div>
  );
}
