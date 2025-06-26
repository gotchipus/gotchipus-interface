"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { WindowType } from "@/lib/types"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import AboutContent from "@/components/window-content/AboutContent"
import { useTranslation } from 'react-i18next'
import { Locale } from '@i18n/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBlockNumber } from "wagmi"
import { useStores } from '@stores/context';
import { observer } from 'mobx-react-lite';


interface TaskbarProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element) => void
  openWindows: WindowType[]
  activeWindow: string | null
  onActivateWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
}

const Taskbar = observer(({
  onOpenWindow,
  openWindows,
  activeWindow,
  onActivateWindow,
  onRestoreWindow,
}: TaskbarProps) => {
  const { i18n } = useTranslation()
  const [isStartPressed, setIsStartPressed] = useState(false)
  const [pressedButton, setPressedButton] = useState<string | null>(null)
  const { walletStore } = useStores();

  const { data: blockNumber } = useBlockNumber({
    watch: true
  });

  const handleButtonMouseDown = (id: string) => {
    setPressedButton(id);
  };

  const handleButtonMouseUp = (id: string) => {
    setPressedButton(null);
    if (id === pressedButton) {
      if (openWindows.find(w => w.id === id)?.minimized) {
        onRestoreWindow(id);
      } else {
        onActivateWindow(id);
      }
    }
  };

  const handleButtonMouseLeave = () => {
    setPressedButton(null);
  };

  const handleOpenAboutWindow = () => {
    onOpenWindow("about", "About", <AboutContent />)
  }

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  return (
    <div className="absolute bottom-0 left-0 w-full h-14 bg-[#c0c0c0] border-t-2 border-[#dfdfdf] shadow-win98-outer flex items-center justify-between px-1 z-50">
      <div className="flex items-center h-10">
        <button
          className={`h-10 px-4 mr-2 font-bold text-sm flex items-center justify-center text-white border border-[#808080] ${
            isStartPressed
              ? "bg-uni-bg-01 shadow-win98-inner"
              : "bg-uni-bg-01 shadow-win98-outer"
          }`}
          onClick={handleOpenAboutWindow}
          onMouseDown={() => setIsStartPressed(true)}
          onMouseUp={() => setIsStartPressed(false)}
          onMouseLeave={() => setIsStartPressed(false)}
        >
          <Image src="/windows98.svg" alt="Start" width={24} height={24} />
          <span className="ml-2">
            Gotchipus
          </span>
        </button>

        <div
          className="h-10 text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner"
        >
          <CustomConnectButton />
        </div>

        {openWindows.map((window) => (
          <button
            key={window.id}
            className={`h-10 min-w-[120px] px-3 ml-1 text-sm flex items-center justify-start truncate border border-[#808080] bg-[#c0c0c0] ${
              pressedButton === window.id
                ? "shadow-win98-inner"
                : activeWindow === window.id
                ? "shadow-win98-inner"
                : "shadow-win98-outer"
            }`}
            onMouseDown={() => handleButtonMouseDown(window.id)}
            onMouseUp={() => handleButtonMouseUp(window.id)}
            onMouseLeave={handleButtonMouseLeave}
          >
            {window.title}
          </button>
        ))}
      </div>

      <div className="flex items-center h-10">
        {walletStore.isWalletConnectConnected && (
          <div 
            className="flex flex-row gap-2 items-center bg-[#c0c0c0] h-10 px-2 m-2 border border-[#808080] cursor-pointer shadow-win98-inner" 
            onClick={() => {
              window.open(walletStore.walletConnectDappMetadata?.url, '_blank');
            }}
          >
            <Image src="/icons/walletconnect-logo.png" alt="WalletConnect" width={24} height={24} />
            <span className="text-sm">{walletStore.walletConnectDappMetadata?.name}</span>
          </div>
        )}

        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[80px] h-10 bg-[#c0c0c0] border border-[#808080] shadow-win98-inner cursor-pointer rounded-none">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer rounded-none p-0">
            <SelectItem value={Locale.EnglishUnitedStates} className="hover:bg-[#000080] hover:text-white focus:bg-[#000080] focus:text-white cursor-pointer px-3 py-1 border-b border-[#808080] last:border-b-0">
              English
            </SelectItem>
            <SelectItem value={Locale.ChineseSimplified} className="hover:bg-[#000080] hover:text-white focus:bg-[#000080] focus:text-white cursor-pointer px-3 py-1 border-b border-[#808080] last:border-b-0">
              中文
            </SelectItem>
          </SelectContent>
        </Select>

        <div
          className="flex flex-row gap-2 items-center bg-[#c0c0c0] h-10 px-2 m-2 border border-[#808080] cursor-pointer shadow-win98-inner"
        >
          <Link href="https://x.com/gotchipus" target="_blank">
            <Image src="/x.svg" alt="X" width={24} height={24} />
          </Link>
          <Link href="https://discord.gg/gotchilabs" target="_blank">
            <Image src="/discord.svg" alt="Discord" width={24} height={24} />
          </Link>
          <Link href="https://github.com/gotchipus" target="_blank">
            <Image src="/github.svg" alt="GitHub" width={24} height={24} />
          </Link>
          <Link href="https://docs.gotchipus.com" target="_blank">
            <Image src="/gitbook.svg" alt="GitBook" width={24} height={24} />
          </Link>
        </div>

        <div className="flex items-center bg-[#c0c0c0] h-10 px-3 ml-2 border border-[#808080] cursor-pointer shadow-win98-inner justify-center">
          <div className="relative">
            <div className={`w-2 h-2 mr-2 rounded-full bg-[#008000]`}></div>
            <div className={`absolute top-0 left-0 w-2 h-2 mr-2  rounded-full animate-ping bg-[#008000]`}></div>
          </div>
          <a 
            href={`https://testnet.pharosscan.xyz/block/${blockNumber?.toString()}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base text-[#000080] hover:underline break-all"
          >
            {blockNumber?.toString()}
          </a>
        </div>
      </div>
    </div>
  )
})

export default Taskbar;
