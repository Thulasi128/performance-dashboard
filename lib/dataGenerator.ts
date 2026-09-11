import { DataPoint } from './types';

const CATEGORIES = ['Alpha', 'Beta', 'Gamma', 'Delta'];

let lastId = 0;

export function generateDataPoint(timestamp?: number): DataPoint {
  lastId++;
  const time = timestamp || Date.now();
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  
  // Create realistic looking noisy data using sine waves and random noise
  const baseValue = Math.sin(time / 10000) * 50 + 50;
  const noise = (Math.random() - 0.5) * 20;
  const value = Math.max(0, Math.min(100, baseValue + noise));

  return {
    id: `point-${lastId}`,
    timestamp: time,
    value: value,
    category,
  };
}

export function generateInitialDataset(count: number = 10000): DataPoint[] {
  const data: DataPoint[] = [];
  const now = Date.now();
  
  // Generate points backwards in time
  // If count is 10000, and we want intervals of 100ms
  // The oldest point is 10000 * 100ms = 1000 seconds ago (~16.6 mins)
  for (let i = count; i > 0; i--) {
    data.push(generateDataPoint(now - (i * 100)));
  }
  
  return data;
}
