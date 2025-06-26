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

    const checkUserInfo = async () => {
      if (!walletStore.address) return;

      const response = await fetch(`/api/tasks/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletStore.address }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    }

    checkUserInfo();

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [isConnected, walletStore]);

  return <>{children}</>;
};