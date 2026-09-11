'use client';

import React, { useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

interface LineChartProps {
  color?: string;
}

export function LineChart({ color = '#0070f3' }: LineChartProps) {
  const padding = 40;

  const render = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: DataPoint[],
    zoom: number,
    panOffset: number
  ) => {
    // Only render the last 1000 points to keep line chart readable
    const displayData = data.slice(-1000);
    if (displayData.length === 0) return;

    drawGrid(ctx, width, height, padding);
    drawAxes(ctx, width, height, padding);

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minTime = displayData[0].timestamp;
    const maxTime = displayData[displayData.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1;

    // Fixed Y scale from 0 to 100 for simplicity based on our data generator
    const minY = 0;
    const maxY = 100;
    const valueRange = maxY - minY;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    for (let i = 0; i < displayData.length; i++) {
      const point = displayData[i];
      // Apply zoom and pan
      const rawX = ((point.timestamp - minTime) / timeRange) * chartWidth;
      const x = padding + (rawX + panOffset) * zoom;
      
      const y = height - padding - ((point.value - minY) / valueRange) * chartHeight;

      // Only draw if within bounds (roughly)
      if (x >= padding && x <= width - padding) {
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      } else {
        ctx.moveTo(x, y); // maintain path continuity
      }
    }

    ctx.stroke();
  }, [color]);

  const canvasRef = useChartRenderer(render);

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
