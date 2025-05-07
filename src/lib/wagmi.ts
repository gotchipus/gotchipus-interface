'use client';

import { http, createConfig } from 'wagmi'
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'
// import { injected } from '@wagmi/connectors'
import { connectors } from './walletConfig'


// const supportedChains: Chain[] = [mainnet, sepolia, base, optimism]

const pharosDevnetCustomChain = {
  id: 50002,
  name: 'Pharos Devnet',
  iconUrl: '',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Pharos', symbol: 'PTT', decimals: 18 },
  rpcUrls: {
    default: { http: ['/api/devnet'] },
  },
  blockExplorers: {
    default: { name: 'Pharosscan', url: 'https://pharosscan.xyz/' },
  },
} as const satisfies Chain;


export const config = createConfig({
  chains: [pharosDevnetCustomChain],
  multiInjectedProviderDiscovery: true,
  connectors,
  transports: {
    [pharosDevnetCustomChain.id]: http(),
  },
  ssr: true 
})