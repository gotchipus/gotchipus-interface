import { useMemo } from 'react';
import { useEstimateGas } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain'; 

interface UseAppEstimatedGasOptions {
  enabled?: boolean;
}

export const useEstimatedGas = (
  args: any[] | undefined,
  value: bigint | undefined,
  options?: UseAppEstimatedGasOptions
) => {
  const { enabled = true } = options || {};

  const calldata = useMemo(() => {
    if (!args) {
      return undefined;
    }
    try {
      return encodeFunctionData({
        abi: PUS_ABI,
        functionName: "executeAccount",
        args: args,
      });
    } catch (error) {
        console.error("Failed to encode function data:", error);
        return undefined;
    }
  }, [args]);

  const result = useEstimateGas({
    to: PUS_ADDRESS as `0x${string}`,
    data: calldata,
    value: value,
    query: {
      enabled: enabled && !!calldata,
    }
  });

  return result;
}