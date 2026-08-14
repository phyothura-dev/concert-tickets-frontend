"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";

export type SearchableOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  id: string;
  options: SearchableOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function SearchableSelect({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Search and select",
  "aria-invalid": invalid,
  "aria-describedby": describedBy,
}: SearchableSelectProps) {
  const listId = useId();
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";
  const [query, setQuery] = useState(selectedLabel);

  return (
    <>
      <Input
        id={id}
        list={listId}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => {
          const nextQuery = event.target.value;
          const match = options.find(
            (option) => option.label.toLocaleLowerCase() === nextQuery.toLocaleLowerCase(),
          );
          setQuery(nextQuery);
          onValueChange(match?.value ?? "");
        }}
        onBlur={() => setQuery(options.find((option) => option.value === value)?.label ?? "")}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.label} />
        ))}
      </datalist>
    </>
  );
}
