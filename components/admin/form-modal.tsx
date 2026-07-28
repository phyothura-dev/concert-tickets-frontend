"use client";

import { createContext, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModalContextType {
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a FormModal");
  }
  return context;
}

interface FormModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function FormModal({ trigger, title, children }: FormModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ModalContext.Provider value={{ setOpen }}>
          {children}
        </ModalContext.Provider>
      </DialogContent>
    </Dialog>
  );
}
