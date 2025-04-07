'use client';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  okxWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

export const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
        okxWallet,
        trustWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        injectedWallet,
      ],
    },
  ],
  {
    appName: 'Gotchipus', 
    projectId
  }
);