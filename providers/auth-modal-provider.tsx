"use client";

import React, { createContext, useContext, useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";

type AuthView = "signin" | "signup";

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthView;
  openSignIn: () => void;
  openSignUp: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("signin");

  const openSignIn = () => {
    setView("signin");
    setIsOpen(true);
  };

  const openSignUp = () => {
    setView("signup");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, view, openSignIn, openSignUp, closeModal }}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
