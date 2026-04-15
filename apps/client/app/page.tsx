export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-primary px-4 pb-8 pt-12 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-light">Benvenuto</p>
            <h1 className="font-display text-xl font-bold">Mio La Fattoria</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display font-bold text-primary-dark">
            CF
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="-mt-4 px-4">
        <div className="rounded-xl border border-border bg-white p-6 shadow-md">
          <h2 className="font-display text-lg font-bold text-primary">
            Il tuo cavallo
          </h2>
          <p className="mt-2 text-muted">
            La Fattoria client app is ready for development.
          </p>
        </div>
      </div>
    </main>
  );
}
