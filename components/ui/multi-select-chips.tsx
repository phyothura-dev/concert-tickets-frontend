'use client';

import { X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';

export type MultiSelectOption = {
  id: string;
  label: string;
  description?: string;
};

interface MultiSelectChipsProps {
  id?: string;
  options: MultiSelectOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  className?: string;
}

export function MultiSelectChips({
  options,
  selectedIds,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  emptyText = 'No options available',
  className,
}: MultiSelectChipsProps) {
  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id));

  const toggleOption = (id: string) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <div
          role="combobox"
          aria-expanded={false}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm cursor-pointer shadow-xs transition-colors hover:border-zinc-300',
            'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
            disabled && 'cursor-not-allowed opacity-50 bg-muted/40',
            className,
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground hover:bg-muted/80"
              >
                <span className="truncate max-w-[12rem]">{opt.label}</span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${opt.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt.id);
                  }}
                  className="cursor-pointer rounded-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
        {options.length === 0 ? (
          <div className="px-3 py-2 text-center text-xs text-muted-foreground">{emptyText}</div>
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={selectedIds.includes(option.id)}
              onSelect={(e) => {
                e.preventDefault(); // Keep dropdown open for multi-select
                toggleOption(option.id);
              }}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span>{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-muted-foreground">({option.description})</span>
                ) : null}
              </div>
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
