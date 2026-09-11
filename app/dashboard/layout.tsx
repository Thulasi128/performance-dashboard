export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Nexus Performance Dashboard</h1>
      </header>
      {children}
    </div>
  );
}
