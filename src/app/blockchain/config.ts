import { defineChain } from "viem";

export const pharos = defineChain({
  id: 688688, 
  name: 'Pharos Testnet',
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
    default: { name: 'PharosScan', url: 'https://testnet.pharosscan.xyz' }, 
  },
  contracts: {
    multicall3: undefined,
  },
});