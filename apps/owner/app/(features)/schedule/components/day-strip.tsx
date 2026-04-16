'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { DAYS_SHORT_IT } from '@lafattoria/utils';

interface DayStripProps {
  selectedDate: string;
}

function getWeekDays(centerDate: string): string[] {
  const center = new Date(centerDate);
  const days: string[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center);
    d.setDate(center.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDayLabel(isoDate: string): { short: string; num: number } {
  const d = new Date(isoDate);
  return {
    short: DAYS_SHORT_IT[d.getDay()],
    num: d.getDate(),
  };
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function DayStrip({ selectedDate }: DayStripProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = getTodayISO();
  const weekDays = getWeekDays(selectedDate);

  const navigateToDate = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', date);
    router.push(`/schedule?${params.toString()}`);
  };

  const goBack = () => {
    const first = new Date(weekDays[0]);
    first.setDate(first.getDate() - 7);
    navigateToDate(first.toISOString().split('T')[0]);
  };

  const goForward = () => {
    const last = new Date(weekDays[6]);
    last.setDate(last.getDate() + 1);
    navigateToDate(last.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center border-b bg-white px-2 py-3">
      <button
        onClick={goBack}
        className="rounded-sm p-2 text-muted hover:bg-cream"
        aria-label="Settimana precedente"
      >
        <ChevronLeft />
      </button>

      <div className="flex flex-1 justify-center gap-1">
        {weekDays.map((date) => {
          const { short, num } = formatDayLabel(date);
          const isSelected = date === selectedDate;
          const isToday = date === today;

          return (
            <button
              key={date}
              onClick={() => navigateToDate(date)}
              className={`flex min-w-[44px] flex-col items-center rounded-sm px-2 py-1 text-sm transition-colors ${
                isSelected
                  ? 'bg-primary text-white'
                  : isToday
                    ? 'bg-primary-light/20 text-primary'
                    : 'hover:bg-cream'
              }`}
            >
              <span className="text-xs">{short}</span>
              <span className="font-medium">{num}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={goForward}
        className="rounded-sm p-2 text-muted hover:bg-cream"
        aria-label="Settimana successiva"
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
