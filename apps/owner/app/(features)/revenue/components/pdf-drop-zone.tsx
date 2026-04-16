'use client';

import { useRef, useState, useCallback } from 'react';

interface PdfDropZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  disabled?: boolean;
}

export function PdfDropZone({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSizeMb = 10,
  disabled = false,
}: PdfDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndAddFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      setError(null);

      const validFiles: File[] = [];
      for (const file of Array.from(newFiles)) {
        if (!file.type.includes('pdf')) {
          setError('Solo file PDF sono accettati');
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          setError(`File troppo grande (max ${maxSizeMb}MB)`);
          continue;
        }
        validFiles.push(file);
      }

      const combined = [...files, ...validFiles].slice(0, maxFiles);
      onFilesChange(combined);
    },
    [files, onFilesChange, maxFiles, maxSizeMb]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndAddFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span className="text-2xl">📄</span>
        <p className="mt-2 text-sm font-medium text-foreground">
          Trascina qui i file PDF
        </p>
        <p className="text-xs text-muted">o clicca per selezionare (max {maxFiles} file)</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={(e) => validateAndAddFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="text-sm text-overdue">{error}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted">File caricati:</p>
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded bg-cream px-2 py-1">
              <span className="truncate text-sm">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                disabled={disabled}
                className="ml-2 text-muted hover:text-overdue disabled:opacity-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
