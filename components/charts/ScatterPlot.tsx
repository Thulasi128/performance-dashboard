'use client';

import React, { useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

interface ScatterPlotProps {
  color?: string;
}

export function ScatterPlot({ color = '#f59e0b' }: ScatterPlotProps) {
  const padding = 40;

  const render = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: DataPoint[],
    zoom: number,
    panOffset: number
  ) => {
    // Scatter plots can handle more points, let's render up to 2000
    const displayData = data.slice(-2000);
    if (displayData.length === 0) return;

    drawGrid(ctx, width, height, padding);
    drawAxes(ctx, width, height, padding);

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minTime = displayData[0].timestamp;
    const maxTime = displayData[displayData.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1;

    const minY = 0;
    const maxY = 100;
    const valueRange = maxY - minY;

    ctx.fillStyle = color + '80'; // Add transparency to the color (hex + alpha)
    // Fallback if color doesn't support simple hex appending
    if (!color.startsWith('#')) {
       ctx.fillStyle = 'rgba(245, 158, 11, 0.5)';
    }

    const radius = 3;

    for (let i = 0; i < displayData.length; i++) {
      const point = displayData[i];
      const rawX = ((point.timestamp - minTime) / timeRange) * chartWidth;
      const x = padding + (rawX + panOffset) * zoom;
      const y = height - padding - ((point.value - minY) / valueRange) * chartHeight;

      if (x >= padding && x <= width - padding) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [color]);

  const canvasRef = useChartRenderer(render);

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
