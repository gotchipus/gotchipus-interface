import { defineChain } from "viem";

export const pharos = defineChain({
  id: 688689, 
  name: 'Pharos Atlantic Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Pharos',
    symbol: 'PHRS',      
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TESTNET_RPC!], 
    },
    public: {
      http: [process.env.NEXT_PUBLIC_TESTNET_RPC!], 
    },
  },
  blockExplorers: {
    default: { name: 'PharosScan', url: 'https://atlantic.pharosscan.xyz' }, 
  },
  contracts: {
    multicall3: undefined,
  },
});