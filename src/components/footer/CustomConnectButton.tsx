'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CustomJazzicon } from './Jazzicon'
import { useToast } from '@/hooks/use-toast'

export const CustomConnectButton = () => {
  const { toast } = useToast()
  const prevConnectedRef = useRef<boolean | null>(null)
  const isInitialMountRef = useRef(true)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

          useEffect(() => {
            if (isInitialMountRef.current) {
              prevConnectedRef.current = connected ?? false
              isInitialMountRef.current = false
              return
            }
  
            if (prevConnectedRef.current !== connected) {
              if (connected) {
                toast({
                  title: "Wallet connected",
                  description: `Connected to wallet ${formatAddress(account.address)}`,
                })
              } else {
                toast({
                  title: "Disconnected Wallet",
                  description: "Disconnected",
                })
              }
              prevConnectedRef.current = connected ?? false
            }
          }, [connected, account, toast])

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal}
                    className="bg-cook-yellow text-black hover:bg-cook-yellow/80 py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <Image src="/connect.png" alt="Connect Wallet" width={24} height={24} />
                    <span className="text-base">Connect Wallet</span>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button 
                    onClick={openChainModal}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 w-full"
                  >
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex gap-3">
                  <button 
                    onClick={openAccountModal}
                    className="flex items-center gap-2 text-black text-base py-2 px-4 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-600">
                      {account.ensAvatar ? (
                        <img
                          src={account.ensAvatar}
                          alt="ENS Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CustomJazzicon 
                          address={account.address} 
                          diameter={24}
                          className="flex items-center justify-center"
                        />
                      )}
                    </div>
                    
                    <span>
                      {account.ensName || formatAddress(account.address)}
                    </span>

                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}