import { NextResponse } from 'next/server';
import { generateInitialDataset } from '@/lib/dataGenerator';

export async function GET() {
  // Simulating an initial fetch of 10,000 records
  const initialData = generateInitialDataset(10000);
  
  return NextResponse.json({
    data: initialData
  });
}
