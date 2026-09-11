# Performance-Critical Data Visualization Dashboard

A high-performance real-time data visualization dashboard built with **Next.js 14+ (App Router)**, **TypeScript**, and **Canvas API**. Capable of handling and rendering 10,000+ data points simultaneously while maintaining a smooth 60 FPS target.

## Setup Instructions

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Performance Testing Instructions

1. Load the dashboard - it will automatically generate and fetch an initial dataset of 10,000 points.
2. The dashboard will simulate a real-time data stream, adding a new point every 100ms.
3. Observe the **Performance Monitor** at the top right of the dashboard to view real-time FPS, Memory usage, and total active data points.
4. Try using the "Pause Data Stream" control to verify reactivity.
5. Use the browser's DevTools Performance profiler to record a trace and verify there are no long tasks blocking the main thread during rendering.

## Browser Compatibility Notes
- Developed and optimized for modern browsers (Chrome, Edge, Firefox, Safari).
- Requires support for `ResizeObserver`, `requestAnimationFrame`, and `HTMLCanvasElement`.
- The memory reporting feature relies on the non-standard `performance.memory` API, which is primarily supported in Chromium-based browsers (Chrome/Edge). For other browsers, memory will display as "N/A".

## Feature Overview

- **Real-time Data Stream:** Simulates high-frequency data ingestion (100ms intervals).
- **Multiple Visualizations:**
  - **Line Chart:** Time-series trends of recent data.
  - **Bar Chart:** Granular distribution across recent entries.
  - **Scatter Plot:** Value correlation and outliers over a larger dataset window.
  - **Density Heatmap:** High-density time and category aggregation.
- **Virtual Scrolling Data Table:** Custom-built virtualization renders only the visible rows out of thousands, ensuring instantaneous scroll performance.
- **Premium UI:** Glassmorphic layout with deep dark mode gradients.

## Next.js Specific Optimizations Used
- **App Router & Server Components:** The main dashboard entrypoint (`page.tsx`) acts as a Server Component that could fetch the initial 10k dataset securely on the server, significantly reducing Time To Interactive (TTI).
- **Client Component Isolation:** Interactive portions (Canvas renderers, Data Table) are pushed down the tree as `'use client'` components, minimizing the JS bundle payload sent to the browser.
- **Next Font (`next/font`):** Could be utilized for zero layout shift (though global CSS standard imports were preferred here for vanilla flexibility).
