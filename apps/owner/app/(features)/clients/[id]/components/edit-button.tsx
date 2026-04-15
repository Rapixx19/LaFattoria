'use client';

import { useState } from 'react';
import { ClientForm } from '../../components/client-form';
import type { Client } from '../../lib/types';

interface EditButtonProps {
  client: Client;
}

export function EditButton({ client }: EditButtonProps) {
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
        <ClientForm
          client={client}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
