'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PdfDropZone } from './pdf-drop-zone';
import { ImportPreviewRow } from './import-preview-row';
import { parsePdfFiles, importParsedInvoices } from '../lib/pdf-actions';
import type { ExtractedInvoice } from '../lib/types';

interface PdfImportModalProps {
  onClose: () => void;
}

type Step = 'upload' | 'preview';

export function PdfImportModal({ onClose }: PdfImportModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [invoices, setInvoices] = useState<ExtractedInvoice[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    if (files.length === 0) return;
    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        const results = await parsePdfFiles(formData);
        setInvoices(results);
        setSelected(new Set(results.map((_, i) => i).filter((i) =>
          results[i].status !== 'error')));
        setStep('preview');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore di parsing');
      }
    });
  };

  const handleImport = () => {
    const toImport = invoices.filter((_, i) => selected.has(i));
    if (toImport.length === 0) return;

    startTransition(async () => {
      try {
        const result = await importParsedInvoices(toImport);
        if (result.errors.length > 0) {
          setError(`Importati ${result.imported}, errori: ${result.errors.join(', ')}`);
        }
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore importazione');
      }
    });
  };

  const toggleSelect = (index: number) => {
    const next = new Set(selected);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setSelected(next);
  };

  const readyCount = invoices.filter((_, i) => selected.has(i)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-bold text-primary">
            Importa fatture PDF
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {error && (
            <div className="mb-4 rounded-sm bg-overdue-bg px-3 py-2 text-sm text-overdue">
              {error}
            </div>
          )}

          {step === 'upload' && (
            <PdfDropZone
              files={files}
              onFilesChange={setFiles}
              disabled={isPending}
            />
          )}

          {step === 'preview' && invoices.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted">Anteprima:</p>
              <div className="space-y-2">
                {invoices.map((inv, i) => (
                  <ImportPreviewRow
                    key={i}
                    invoice={inv}
                    selected={selected.has(i)}
                    onToggle={() => toggleSelect(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={step === 'preview' ? () => setStep('upload') : onClose}
            disabled={isPending}
            className="flex-1 rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream disabled:opacity-50"
          >
            {step === 'preview' ? 'Indietro' : 'Annulla'}
          </button>
          <button
            type="button"
            onClick={step === 'upload' ? handleParse : handleImport}
            disabled={isPending || (step === 'upload' && files.length === 0)}
            className="flex-1 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {isPending ? 'Elaborazione...' :
             step === 'upload' ? 'Analizza PDF' : `Importa ${readyCount} fatture`}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PdfImportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
      >
        + Importa PDF
      </button>

      {isOpen && <PdfImportModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
