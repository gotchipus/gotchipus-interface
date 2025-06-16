import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';

const domain = {
  name: 'Gotchipus',
  version: 'v0.1.0',
  chainId: 688688,
  verifyingContract: '0x0000000038f050528452D6Da1E7AACFA7B3Ec0a8',
} as const;

const types = {
  CheckIn: [
    { name: 'intent', type: 'string' },
    { name: 'user', type: 'address' },
    { name: 'timestamp', type: 'uint256' },
  ],
} as const;

interface UseCheckInProps {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useCheckIn = ({ onSuccess, onError }: UseCheckInProps = {}) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const checkIn = async () => {
    if (!isConnected || !address) {
      const connectError = new Error("Wallet not connected.");
      setError(connectError);
      onError?.(connectError);
      return;
    }

    setIsCheckingIn(true);
    setError(null);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const message = {
        intent: `Daily Check-In for Gotchipus`,
        user: address,
        timestamp: BigInt(timestamp),
      };

      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'CheckIn',
        message,
      });

      const payload = {
        "address": address,
        "signature": signature,
        "timestamp": timestamp
      };

      const verifyResponse = await fetch('/api/tasks/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'Check-in verification failed.');

      onSuccess?.(verifyData);
    } catch (err: any) {
      setError(err);
      onError?.(err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  return {
    checkIn,
    isCheckingIn,
    error,
  };
};