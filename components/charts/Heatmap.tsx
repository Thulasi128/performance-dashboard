'use client';

import React, { useCallback } from 'react';
import { useChartRenderer } from '@/hooks/useChartRenderer';
import { drawGrid, drawAxes } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

export function Heatmap() {
  const padding = 40;
  const categories = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  const render = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: DataPoint[],
    zoom: number,
    panOffset: number
  ) => {
    // For heatmap, we bucket data into time columns.
    const displayData = data.slice(-5000); // More data for heatmap density
    if (displayData.length === 0) return;

    drawGrid(ctx, width, height, padding);
    drawAxes(ctx, width, height, padding);

    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const minTime = displayData[0].timestamp;
    const maxTime = displayData[displayData.length - 1].timestamp;
    const timeRange = maxTime - minTime || 1;

    const numCols = 50; // 50 time buckets
    const numRows = categories.length;
    
    // Scale column width by zoom
    const cellWidth = (chartWidth / numCols) * zoom;
    const cellHeight = chartHeight / numRows;

    // Aggregate data into grid cells
    // grid[col][row] contains array of values
    const grid: number[][][] = Array(numCols).fill(0).map(() => Array(numRows).fill(0).map(() => []));

    for (let i = 0; i < displayData.length; i++) {
      const point = displayData[i];
      const colIndex = Math.min(
        numCols - 1, 
        Math.floor(((point.timestamp - minTime) / timeRange) * numCols)
      );
      const rowIndex = categories.indexOf(point.category);
      
      if (rowIndex !== -1 && colIndex >= 0) {
        grid[colIndex][rowIndex].push(point.value);
      }
    }

    // Draw cells
    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < numRows; r++) {
        const values = grid[c][r];
        if (values.length > 0) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          
          const hue = 240 - (avg / 100) * 240;
          ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.8)`;
          
          const rawX = c * (chartWidth / numCols);
          const x = padding + (rawX + panOffset) * zoom;
          const y = padding + r * cellHeight;
          
          if (x + cellWidth >= padding && x <= width - padding) {
            ctx.fillRect(x, y, cellWidth, cellHeight);
          }
        }
      }
    }

    // Draw category labels
    ctx.fillStyle = '#94a3b8'; // dark mode friendly text
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < numRows; r++) {
      const y = padding + r * cellHeight + cellHeight / 2;
      ctx.fillText(categories[r], padding - 10, y);
    }

  }, [categories]);

  const canvasRef = useChartRenderer(render);

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
