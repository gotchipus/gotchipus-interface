'use client';

import { useWalletStore } from "@/hooks/useWalletStore";
import { useEffect } from "react";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { isConnected, walletStore } = useWalletStore();
  
  useEffect(() => {
    const handleError = () => {
      if (!isConnected) {
        walletStore.reset();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [isConnected, walletStore]);

  return <>{children}</>;
};