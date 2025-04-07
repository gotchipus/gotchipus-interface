import { useEffect } from "react";
import { useStores } from "@stores/context";
import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const useWalletStore = () => {
  const { walletStore } = useStores();
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ 
    address,
    query: {
      refetchInterval: 10000,
      enabled: isConnected && !!address
    }
  });
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (isConnected && address) {
      walletStore.setWalletState({
        address,
        isConnected,
        isConnecting,
        balance: balance?.value.toString(),
        symbol: balance?.symbol,
        chainId,
      });
    } else {
      walletStore.reset();
    }
  }, [
    address,
    isConnected,
    isConnecting,
    balance,
    chainId,
    walletStore,
  ]);

  useEffect(() => {
    const checkConnection = () => {
      if (!isConnected) {
        walletStore.reset();
      }
    };

    document.addEventListener('visibilitychange', checkConnection);
    window.addEventListener('focus', checkConnection);

    return () => {
      document.removeEventListener('visibilitychange', checkConnection);
      window.removeEventListener('focus', checkConnection);
    };
  }, [isConnected, walletStore]);

  return {
    walletStore,
    disconnect,
    isConnected,
    isConnecting,
    isBalanceLoading,
    openConnectModal
  };
};