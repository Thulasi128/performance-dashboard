import { DataProvider } from '@/components/providers/DataProvider';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { DataTable } from '@/components/ui/DataTable';
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';

// Revalidate 0 forces dynamic rendering if we use real API, but for simulation we can keep it simple
export const dynamic = 'force-dynamic';

async function fetchInitialData() {
  // In a real app this would be an external API call
  // We can fetch from our own API route for the sake of the assignment structure
  // But during build time, absolute URLs are required. 
  // It's safer to just generate the initial dataset on the server directly.
  const { generateInitialDataset } = await import('@/lib/dataGenerator');
  return generateInitialDataset(10000);
}

export default async function DashboardPage() {
  const initialData = await fetchInitialData();

  return (
    <DataProvider initialData={initialData}>
      <main className="dashboard-content">
        <div className="main-column">
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Performance Overview</h2>
              <PerformanceMonitor />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass-panel">
              <h2>Real-Time Series (1000pts)</h2>
              <div className="chart-wrapper">
                <LineChart color="#3b82f6" />
              </div>
            </div>
            
            <div className="glass-panel">
              <h2>Category Distribution (100pts)</h2>
              <div className="chart-wrapper">
                <BarChart color="#10b981" />
              </div>
            </div>

            <div className="glass-panel">
              <h2>Value Distribution (2000pts)</h2>
              <div className="chart-wrapper">
                <ScatterPlot color="#f59e0b" />
              </div>
            </div>

            <div className="glass-panel">
              <h2>Density Map (5000pts)</h2>
              <div className="chart-wrapper">
                <Heatmap />
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h2>Raw Data Stream</h2>
            <DataTable />
          </div>
        </div>
        
        <div className="side-column">
          <div className="glass-panel">
            <FilterPanel />
          </div>
          
          <div className="glass-panel">
            <TimeRangeSelector />
          </div>
        </div>
      </main>
    </DataProvider>
  );
}
