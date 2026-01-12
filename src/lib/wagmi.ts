'use client';

import { http, createConfig } from 'wagmi'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'
// import { injected } from '@wagmi/connectors'
import { connectors } from './walletConfig'


// const supportedChains: Chain[] = [mainnet, sepolia, base, optimism]

const pharosTestnetCustomChain = {
  id: 688689,
  name: 'Pharos Atlantic Testnet',
  iconUrl: '',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Pharos', symbol: 'PHRS', decimals: 18 },
  rpcUrls: {
    default: { 
      http: typeof window !== 'undefined' && window.location?.origin 
        ? [`${window.location.origin}/api/testnet`]
        : ['https://atlantic.dplabs-internal.com'] 
    },
  },
  blockExplorers: {
    default: { name: 'Pharosscan', url: 'https://atlantic.pharosscan.xyz/' },
  },
} as const satisfies Chain;


export const config = createConfig({
  chains: [pharosTestnetCustomChain],
  multiInjectedProviderDiscovery: true,
  connectors,
  transports: {
    [pharosTestnetCustomChain.id]: http(),
  },
  ssr: true 
})