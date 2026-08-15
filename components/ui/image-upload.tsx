'use client';

import { ImageIcon, UploadCloud, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const MAX_IMAGE_BYTES = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type ImageUploadProps = {
  id: string;
  value: File | null;
  onChange: (file: File | null) => void;
  onError: (message: string) => void;
  existingImageUrl?: string | null;
  label: string;
  className?: string;
  disabled?: boolean;
};

export function ImageUpload({ id, value, onChange, onError, existingImageUrl, label, className, disabled }: ImageUploadProps) {
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : existingImageUrl), [existingImageUrl, value]);

  useEffect(
    () => () => {
      if (value && previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl, value],
  );

  function selectFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onError('Only JPEG, PNG, or WebP images are allowed');
      return;
    }
    if (file.size < 1 || file.size > MAX_IMAGE_BYTES) {
      onError('Image must be 1 MB or smaller');
      return;
    }
    onChange(file);
  }

  if (!previewUrl) {
    return (
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand/25 bg-brand/[0.025] px-5 py-6 text-center transition hover:border-brand/50 hover:bg-brand/5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <UploadCloud className="h-6 w-6 text-brand" aria-hidden="true" />
        <span className="mt-2 text-sm font-semibold">{label}</span>
        <span className="mt-1 text-xs text-muted-foreground">JPEG, PNG or WebP · Max 1 MB</span>
        <input
          id={id}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={disabled}
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            event.currentTarget.value = '';
          }}
        />
      </label>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center', className)}>
      <div className="h-28 w-full shrink-0 rounded-lg bg-muted bg-cover bg-center sm:w-36" style={{ backgroundImage: `url(${previewUrl})` }} role="img" aria-label="Selected image preview" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ImageIcon className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="truncate">{value?.name ?? 'Current image'}</span>
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <label htmlFor={id} className="cursor-pointer">
              Change image
              <input
                id={id}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={disabled}
                onChange={(event) => {
                  selectFile(event.target.files?.[0]);
                  event.currentTarget.value = '';
                }}
              />
            </label>
          </Button>
          {value ? (
            <Button type="button" size="icon" variant="ghost" aria-label="Remove selected image" disabled={disabled} onClick={() => onChange(null)}>
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
