'use client';

import { useEffect, useRef } from 'react';
import { setupCanvas } from '@/lib/canvasUtils';
import { useDataStream } from './useDataStream';
import { useChartInteractivity } from './useChartInteractivity';
import { DataPoint } from '@/lib/types';

export type RenderFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: DataPoint[],
  zoom: number,
  panOffset: number
) => void;

export function useChartRenderer(renderFn: RenderFunction) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dataRef, activeCategories, timeAggregation } = useDataStream();
  const { zoomRef, panOffsetRef } = useChartInteractivity(canvasRef);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true }); // Enable alpha for transparent background
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // We can observe resize via ResizeObserver to make it responsive without React re-renders
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === canvas) {
          const dims = setupCanvas(canvas, ctx);
          width = dims.width;
          height = dims.height;
        }
      }
    });

    resizeObserver.observe(canvas);

    // Initial setup if observe hasn't fired yet
    const initialDims = setupCanvas(canvas, ctx);
    width = initialDims.width;
    height = initialDims.height;

    const renderLoop = () => {
      if (width > 0 && height > 0) {
        // Clear background entirely (transparent)
        ctx.clearRect(0, 0, width, height);
        
        let processedData = dataRef.current;
        
        // Filter by category
        if (activeCategories.size < 4) {
          processedData = processedData.filter(d => activeCategories.has(d.category));
        }

        // Aggregate by time (simple bucket averaging)
        if (timeAggregation !== 'raw') {
          const bucketSize = timeAggregation === '1min' ? 60000 : timeAggregation === '5min' ? 300000 : 3600000;
          const aggregated = [];
          if (processedData.length > 0) {
            let currentBucket = Math.floor(processedData[0].timestamp / bucketSize) * bucketSize;
            let sum = 0;
            let count = 0;
            
            for (let i = 0; i < processedData.length; i++) {
              const pt = processedData[i];
              if (pt.timestamp < currentBucket + bucketSize) {
                sum += pt.value;
                count++;
              } else {
                aggregated.push({ ...pt, timestamp: currentBucket, value: sum / count });
                currentBucket = Math.floor(pt.timestamp / bucketSize) * bucketSize;
                sum = pt.value;
                count = 1;
              }
            }
            if (count > 0) {
              aggregated.push({ ...processedData[processedData.length - 1], timestamp: currentBucket, value: sum / count });
            }
          }
          processedData = aggregated;
        }

        renderFn(ctx, width, height, processedData, zoomRef.current, panOffsetRef.current);
      }
      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
    };
  }, [renderFn, dataRef]);

  return canvasRef;
}
