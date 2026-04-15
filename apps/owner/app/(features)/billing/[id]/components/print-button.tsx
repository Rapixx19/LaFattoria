'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full rounded border border-border bg-white px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream active:scale-[0.97]"
    >
      Stampa
    </button>
  );
}
