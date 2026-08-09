import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-success-muted text-success-foreground",
        danger: "bg-danger-muted text-danger-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function StatusBadge({
  children,
  className,
  tone,
}: { children: ReactNode; className?: string } & VariantProps<
  typeof statusBadgeVariants
>) {
  return <span className={cn(statusBadgeVariants({ tone }), className)}>{children}</span>;
}
