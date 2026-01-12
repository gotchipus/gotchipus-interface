import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PUS_ABI, PUS_ADDRESS, ERC6551_REGISTRY_ADDRESS, ERC6551_ABI, ERC20_ABI, WEARABLE_MARKETPLACE_ADDRESS, WEARABLE_MARKETPLACE_ABI } from '@/src/app/blockchain';
import { useWriteContract, useReadContract, useReadContracts, useWaitForTransactionReceipt } from "wagmi";
import type { Abi } from 'viem';

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
    args: any[] = [],
    value?: bigint
  ) => {
    try {
      writeContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: functionName,
        args: args,
        value: value
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
  const { data, isLoading, error, isError, ...rest } = useReadContract({
    address: PUS_ADDRESS,
    abi: PUS_ABI,
    functionName: functionName,
    args: args,
    query: {
      enabled: options?.enabled
    }
  });

  return { data, isLoading, error, isError, ...rest };
};

export const useContractReads = (
  functionName: string,
  argsArray: any[][] = [],
  options?: {
    enabled?: boolean
  }
) => {

  const contracts = argsArray.map(args => ({
    address: PUS_ADDRESS as `0x${string}`,
    abi: PUS_ABI as Abi,
    functionName: functionName,
    args: args
  }));

  const { data: results } = useReadContracts({
    contracts,
    query: {
      enabled: options?.enabled !== false && contracts.length > 0
    }
  });

  return results;
}


export const useERC6551Read = (
  functionName: string,
  args: any[] = [],
  options?: {
    enabled?: boolean
  }
) => {
  const { data: result } = useReadContract({
    address: ERC6551_REGISTRY_ADDRESS,
    abi: ERC6551_ABI,
    functionName: functionName,
    args: args,
    query: {
      enabled: options?.enabled
    }
  });

  return result;
}


export const useERC20Read = (
  address: string,
  functionName: string,
  args: any[] = [],
  options?: {
    enabled?: boolean
  }
) => {
  const { data, isLoading, error, isError, ...rest } = useReadContract({
    address: address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: functionName,
    args: args,
    query: {
      enabled: options?.enabled
    }
  });

  return { data, isLoading, error, isError, ...rest };
}

export const useWearableMarketplaceWrite = () => {
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

  const purchaseWearables = useCallback(async (
    wearableTokenIds: number[],
    amounts: number[],
    prices: bigint[]
  ) => {
    if (wearableTokenIds.length !== amounts.length || wearableTokenIds.length !== prices.length) {
      throw new Error('wearableTokenIds, amounts, and prices arrays must have the same length');
    }

    try {
      console.log(ethers.parseEther('0.001') * BigInt(wearableTokenIds.length));
      
      writeContract({
        address: WEARABLE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: WEARABLE_MARKETPLACE_ABI as Abi,
        functionName: 'batchMintWearable',
        args: [wearableTokenIds, amounts],
        value: ethers.parseEther('0.001') * BigInt(wearableTokenIds.length)
      });

    } catch (error) {
      resetWrite();
      throw error;
    }
  }, [writeContract, resetWrite]);

  const purchaseSingleWearable = useCallback(async (
    wearableTokenId: number,
    amount: number,
    value: bigint
  ) => {
    try {
      writeContract({
        address: WEARABLE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: WEARABLE_MARKETPLACE_ABI as Abi,
        functionName: 'mintWearable',
        args: [BigInt(wearableTokenId), BigInt(amount)],
        value: value
      });
    } catch (error) {
      resetWrite();
      throw error;
    }
  }, [writeContract, resetWrite]);

  const wearableMarketplaceWrite = useCallback(async (
    functionName: string,
    args: any[] = [],
    value?: bigint
  ) => {
    try {
      writeContract({
        address: WEARABLE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: WEARABLE_MARKETPLACE_ABI as Abi,
        functionName: functionName,
        args: args,
        value: value
      });
    } catch (error) {
      resetWrite();
      throw error;
    }
  }, [writeContract, resetWrite]);

  return {
    purchaseWearables,
    purchaseSingleWearable,
    wearableMarketplaceWrite,
    hash,
    isConfirmed,
    isConfirming,
    isPending,
    error,
    confirmError,
    receipt
  };
};

export const useWearableMarketplaceRead = (
  functionName: string,
  args: any[] = [],
  options?: {
    enabled?: boolean
  }
) => {
  const { data, isLoading, error, isError, ...rest } = useReadContract({
    address: WEARABLE_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: WEARABLE_MARKETPLACE_ABI as Abi,
    functionName: functionName,
    args: args,
    query: {
      enabled: options?.enabled
    }
  });

  return { data, isLoading, error, isError, ...rest };
};

