"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
  canRenderProducts: boolean;
  setCanRenderProducts: (value: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [canRenderProducts, setCanRenderProducts] = useState(false);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        setIsTransitioning,
        canRenderProducts,
        setCanRenderProducts,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
