'use client';

import React, { useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

interface BarChartProps {
  color?: string;
}

export function BarChart({ color = '#10b981' }: BarChartProps) {
  const padding = 40;

  const render = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: DataPoint[],
    zoom: number,
    panOffset: number
  ) => {
    // Only render the last 100 points for a bar chart
    const displayData = data.slice(-100);
    if (displayData.length === 0) return;

    drawGrid(ctx, width, height, padding);
    drawAxes(ctx, width, height, padding);

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minY = 0;
    const maxY = 100;
    const valueRange = maxY - minY;

    const barWidth = (chartWidth / displayData.length) * 0.8 * zoom; // scale bar width
    const spacing = (chartWidth / displayData.length) * 0.2 * zoom;

    ctx.fillStyle = color;

    for (let i = 0; i < displayData.length; i++) {
      const point = displayData[i];
      const rawX = i * ((chartWidth / displayData.length) * 0.8 + (chartWidth / displayData.length) * 0.2);
      const x = padding + (rawX + panOffset) * zoom + spacing / 2;
      
      const normalizedValue = Math.max(0, Math.min(100, point.value));
      const barHeight = (normalizedValue / valueRange) * chartHeight;
      const y = height - padding - barHeight;

      if (x + barWidth >= padding && x <= width - padding) {
        ctx.fillRect(x, y, barWidth, barHeight);
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
