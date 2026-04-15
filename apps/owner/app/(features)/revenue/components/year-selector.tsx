'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface YearSelectorProps {
  years: number[];
  currentYear: number;
}

export function YearSelector({ years, currentYear }: YearSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const canGoBack = currentYear > minYear;
  const canGoForward = currentYear < maxYear;

  const navigateToYear = (year: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', String(year));
    router.push(`/revenue?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigateToYear(currentYear - 1)}
        disabled={!canGoBack}
        className="rounded-sm p-1 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        aria-label="Anno precedente"
      >
        <ChevronLeft />
      </button>

      <span className="min-w-[4rem] text-center font-mono text-lg font-bold">
        {currentYear}
      </span>

      <button
        onClick={() => navigateToYear(currentYear + 1)}
        disabled={!canGoForward}
        className="rounded-sm p-1 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        aria-label="Anno successivo"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
    </svg>
  );
}
