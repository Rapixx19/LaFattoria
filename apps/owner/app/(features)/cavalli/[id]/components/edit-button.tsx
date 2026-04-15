'use client';

import { useState } from 'react';
import { HorseForm } from '../../components/horse-form';
import type { HorseWithClient } from '../../lib/types';

interface EditButtonProps {
  horse: HorseWithClient;
  clients: { id: string; name: string }[];
}

export function EditButton({ horse, clients }: EditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-white/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/20"
      >
        Modifica
      </button>

      {isOpen && (
        <HorseForm
          horse={horse}
          clients={clients}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
