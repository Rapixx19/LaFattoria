'use client';

import { useState } from 'react';
import { HorseForm } from './horse-form';

interface AddHorseButtonProps {
  clients: { id: string; name: string }[];
}

export function AddHorseButton({ clients }: AddHorseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
      >
        + Aggiungi
      </button>

      {isOpen && (
        <HorseForm
          clients={clients}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
