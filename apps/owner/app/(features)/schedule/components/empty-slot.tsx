import { getBlockPosition } from '../lib/types';

interface EmptySlotProps {
  timeFrom: string;
  timeTo: string;
}

export function EmptySlot({ timeFrom, timeTo }: EmptySlotProps) {
  const startHour = parseInt(timeFrom.split(':')[0], 10);
  const endHour = parseInt(timeTo.split(':')[0], 10);
  const durationMin = (endHour - startHour) * 60;

  const { top, height } = getBlockPosition(timeFrom, durationMin);

  return (
    <div
      className="absolute left-1 right-1 rounded-sm border border-dashed border-paid bg-paid-bg/30 px-2 py-1"
      style={{ top, height }}
    >
      <div className="text-xs text-paid">
        {timeFrom.slice(0, 5)} - {timeTo.slice(0, 5)}
      </div>
    </div>
  );
}
