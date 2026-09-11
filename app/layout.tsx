import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Performance Dashboard',
  description: 'High-performance real-time data visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-layout">
          <header className="dashboard-header">
            <h1>Nexus Performance Dashboard</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
