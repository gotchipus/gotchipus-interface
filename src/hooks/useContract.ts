import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PUS_ABI, SIMPLE_ERC20_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";

export const useContractWrite = () => {
  const {
    data: hash,
    writeContract,
    error: writeError,
    isPending,
    reset: resetWrite
  } = useWriteContract();
  
  const {
    data: receipt,
    isLoading: isConfirming,
    error: confirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  const error = writeError || confirmError;

  const contractWrite = useCallback(async (
    functionName: string,
    args: any[] = []
  ) => {
    try {
      writeContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: functionName,
        args: args,
        gas: BigInt(1000000)
      });
    } catch (error) {
      resetWrite();
      throw error;
    }
  }, [writeContract, resetWrite]);

  return {
    contractWrite,
    hash,
    isConfirmed,
    isConfirming,
    isPending,
    error,
    confirmError,
    receipt
  };
};

export const useContractRead = (
  functionName: string, 
  args: any[] = [],
  options?: {
    enabled?: boolean
  }
) => {
  const { data: result } = useReadContract({
    address: PUS_ADDRESS,
    abi: PUS_ABI,
    functionName: functionName,
    args: args,
    query: {
      enabled: options?.enabled
    }
  });

  return result;
};
