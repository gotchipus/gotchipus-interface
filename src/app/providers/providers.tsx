'use client'

import * as React from 'react'
import {
  RainbowKitProvider,
  darkTheme,
  AvatarComponent,
  Theme,
  lightTheme
} from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SWRConfig } from 'swr'
import { config } from '@/lib/wagmi'
import { CustomJazzicon } from '@/components/footer/Jazzicon'
import { StoreProvider } from "@stores/context";
import { WalletProvider } from "@providers/WalletProvider";
import { ToastProvider } from "@/components/ui/toast"
import { I18nProvider } from "@providers/I18nProvider";

const queryClient = new QueryClient()

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {  
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {ensImage ? (
        <img
          src={ensImage}
          width={size}
          height={size}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          alt="ENS Avatar"
        />
      ) : (
        <CustomJazzicon                           
          address={address} 
          diameter={size}
          className="flex items-center justify-center"
        />
      )}
    </div>
  )
}

const windows98Theme: Theme = {
  ...lightTheme(),
  colors: {
    ...lightTheme().colors,
    accentColor: '#000080',
    accentColorForeground: '#FFFFFF',
    actionButtonBorder: '#000000',
    actionButtonBorderMobile: '#000000',
    actionButtonSecondaryBackground: '#C0C0C0',
    closeButton: '#000000',
    closeButtonBackground: '#C0C0C0',
    connectButtonBackground: '#C0C0C0',
    connectButtonText: '#000000',
    generalBorder: '#000000',
    menuItemBackground: '#C0C0C0',
    modalBackground: '#C0C0C0',
    modalBorder: '#000000',
    modalText: '#000000',
    profileAction: '#E0E0E0',
    profileForeground: '#C0C0C0',
    connectButtonBackgroundError: '#FF0000',
    connectButtonInnerBackground: '#C0C0C0',
    connectButtonTextError: '#FF0000',
    connectionIndicator: '#008000',
    downloadBottomCardBackground: '#C0C0C0',
    downloadTopCardBackground: '#C0C0C0',
    error: '#FF0000',
    modalTextSecondary: '#808080',
    profileActionHover: '#D0D0D0',
    standby: '#808080',
    modalTextDim: '#808080',
    generalBorderDim: '#808080',
    selectedOptionBorder: '#000080',
  },
  radii: {
    actionButton: '0px',
    connectButton: '0px',
    menuButton: '0px',
    modal: '0px',
    modalMobile: '0px',
  },
  shadows: {
    connectButton: '2px 2px 0px #808080, -2px -2px 0px #FFFFFF', 
    dialog: '2px 2px 0px #808080, -2px -2px 0px #FFFFFF',
    profileDetailsAction: 'none',
    selectedOption: 'none',
    selectedWallet: 'none',
    walletLogo: 'none',
  },
  fonts: {
    body: 'VT323, Arial, sans-serif',
  },
};

const swrConfig = {
  dedupingInterval: 60000,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SWRConfig value={swrConfig}>
          <RainbowKitProvider
            theme={windows98Theme}
            modalSize="compact"
            locale="en"
            avatar={CustomAvatar}
            appInfo={{
              appName: 'Gotchipus',
              learnMoreUrl: 'https://gotchipus.com',
            }}
          >
            <StoreProvider>
              <WalletProvider>
                <ToastProvider>
                  <I18nProvider>
                    {mounted ? children : null}
                  </I18nProvider>
                </ToastProvider>
              </WalletProvider>
            </StoreProvider>
          </RainbowKitProvider>
        </SWRConfig>
      </QueryClientProvider>
    </WagmiProvider>
  )
}