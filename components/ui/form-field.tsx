import type { ReactNode } from "react";
import { Label } from "./label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  errorId?: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, errorId, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
