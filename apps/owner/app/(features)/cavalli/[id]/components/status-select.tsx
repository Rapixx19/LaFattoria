'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateHorseStatus } from '../../lib/actions';
import {
  STATUS_STYLES,
  STATUS_LABELS,
  type HorseWithClient,
  type HorseStatus,
} from '../../lib/types';

interface StatusSelectProps {
  horse: HorseWithClient;
}

export function StatusSelect({ horse }: StatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: HorseStatus) => {
    startTransition(async () => {
      await updateHorseStatus(horse.id, newStatus);
      router.refresh();
    });
  };

  const currentStatus = horse.status as HorseStatus;

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={(e) => handleChange(e.target.value as HorseStatus)}
        disabled={isPending}
        className={`appearance-none rounded-full px-3 py-1 pr-7 text-xs font-medium ${STATUS_STYLES[currentStatus]} cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {(Object.entries(STATUS_LABELS) as [HorseStatus, string][]).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          )
        )}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
