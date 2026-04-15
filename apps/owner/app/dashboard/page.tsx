export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-primary px-4 py-4 text-white">
        <h1 className="font-display text-lg font-bold">La Fattoria</h1>
        <p className="text-sm text-primary-light">Owner Dashboard</p>
      </header>

      {/* Content */}
      <div className="p-4">
        <div className="rounded-lg border border-border bg-white p-6 shadow-md">
          <h2 className="font-display text-xl font-bold text-primary">
            Benvenuto
          </h2>
          <p className="mt-2 text-muted">
            La Fattoria owner app is ready for development.
          </p>
        </div>
      </div>
    </main>
  );
}
