'use client';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="rounded-sm bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
    >
      Stampa
    </button>
  );
}
