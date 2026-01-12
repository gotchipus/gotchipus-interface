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
import { Menu, X } from 'lucide-react';

interface TaskbarProps {
  onOpenWindow: (id: string, title: string, content: JSX.Element, icon?: string) => void
  openWindows: WindowType[]
  activeWindow: string | null
  onActivateWindow: (id: string) => void
  onRestoreWindow: (id: string) => void
  isMobile?: boolean
}

const Taskbar = observer(({
  onOpenWindow,
  openWindows,
  activeWindow,
  onActivateWindow,
  onRestoreWindow,
  isMobile = false,
}: TaskbarProps) => {
  const { i18n } = useTranslation()
  const [isStartPressed, setIsStartPressed] = useState(false)
  const [pressedButton, setPressedButton] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { walletStore } = useStores();

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: 688689,
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

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }

  if (isMobile) {
    return (
      <>
        <div className="absolute bottom-0 left-0 w-full bg-[#c0c0c0] border-t-2 border-[#dfdfdf] shadow-win98-outer flex items-center justify-between px-2 z-50 h-12">
          <button
            className={`px-3 h-8 font-bold text-sm flex items-center justify-center text-white border border-[#808080] min-w-[50px] ${
              isStartPressed
                ? "bg-uni-bg-01 shadow-win98-inner"
                : "bg-uni-bg-01 shadow-win98-outer"
            }`}
            onClick={toggleMobileMenu}
            onMouseDown={() => setIsStartPressed(true)}
            onMouseUp={() => setIsStartPressed(false)}
            onMouseLeave={() => setIsStartPressed(false)}
          >
            <Menu size={16} className="mr-1" />
            <span className="text-xs">Menu</span>
          </button>

          <div className="flex-1 mx-2 overflow-hidden">
            {activeWindow && (
              <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner px-2 py-1 h-8 flex items-center gap-1">
                {openWindows.find(w => w.id === activeWindow)?.icon && (
                  <Image
                    src={openWindows.find(w => w.id === activeWindow)!.icon!}
                    alt=""
                    width={12}
                    height={12}
                    className="flex-shrink-0"
                  />
                )}
                <span className="text-xs truncate">
                  {openWindows.find(w => w.id === activeWindow)?.title || activeWindow}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Connect Wallet */}
            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-outer h-8 px-2 flex items-center">
              <CustomConnectButton />
            </div>

            <div className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner h-8 px-2 flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#008000] mr-1"></div>
              <span className="text-xs text-[#000080]">
                {blockNumber?.toString()}
              </span>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleMobileMenu}>
            <div className="absolute bottom-12 left-2 right-2 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer max-h-[60vh] overflow-hidden">
              <div className="bg-[#000080] text-white px-3 py-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/windows98.svg" alt="Start" width={16} height={16} className="mr-2" />
                  <span className="text-sm font-bold">Gotchipus Menu</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="p-2 space-y-1 max-h-[50vh] overflow-y-auto">
                {/* About */}
                <button
                  onClick={() => {
                    handleOpenAboutWindow();
                    toggleMobileMenu();
                  }}
                  className="w-full text-left px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] flex items-center"
                >
                  <div className="w-4 h-4 bg-[#000080] mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <span className="text-sm">About Gotchipus</span>
                </button>

                {openWindows.length > 0 && (
                  <div className="border-t border-[#808080] pt-1">
                    <div className="text-xs font-bold text-[#000080] px-3 py-1">Open Windows</div>
                    {openWindows.map((window) => (
                      <button
                        key={window.id}
                        onClick={() => {
                          if (window.minimized) {
                            onRestoreWindow(window.id);
                          } else {
                            onActivateWindow(window.id);
                          }
                          toggleMobileMenu();
                        }}
                        className={`w-full text-left px-3 py-2 border border-[#808080] flex items-center ${
                          activeWindow === window.id
                            ? "bg-[#000080] text-white shadow-win98-inner"
                            : "bg-[#c0c0c0] shadow-win98-outer hover:bg-[#d4d0c8]"
                        }`}
                      >
                        {window.icon ? (
                          <Image
                            src={window.icon}
                            alt=""
                            width={16}
                            height={16}
                            className="flex-shrink-0 mr-2"
                          />
                        ) : (
                          <div className="w-3 h-3 bg-[#c0c0c0] border border-[#808080] mr-2 flex items-center justify-center">
                            {activeWindow === window.id && <div className="w-1.5 h-1.5 bg-[#000080]"></div>}
                          </div>
                        )}
                        <span className="text-sm truncate">{window.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t border-[#808080] pt-1">
                  <div className="text-xs font-bold text-[#000080] px-3 py-1">Language</div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        handleLanguageChange(Locale.EnglishUnitedStates);
                      }}
                      className={`px-3 py-2 border border-[#808080] flex items-center justify-center ${
                        i18n.language === Locale.EnglishUnitedStates
                          ? "bg-[#000080] text-white shadow-win98-inner"
                          : "bg-[#c0c0c0] shadow-win98-outer hover:bg-[#d4d0c8]"
                      }`}
                    >
                      <span className="text-xs">English</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLanguageChange(Locale.ChineseSimplified);
                      }}
                      className={`px-3 py-2 border border-[#808080] flex items-center justify-center ${
                        i18n.language === Locale.ChineseSimplified
                          ? "bg-[#000080] text-white shadow-win98-inner"
                          : "bg-[#c0c0c0] shadow-win98-outer hover:bg-[#d4d0c8]"
                      }`}
                    >
                      <span className="text-xs">中文</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#808080] pt-1">
                  <div className="text-xs font-bold text-[#000080] px-3 py-1">Community</div>
                  <div className="grid grid-cols-2 gap-1">
                    <Link 
                      href="https://x.com/gotchipus" 
                      target="_blank"
                      className="px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] flex items-center justify-center"
                    >
                      <Image src="/x.svg" alt="X" width={16} height={16} className="mr-1" />
                      <span className="text-xs">X (Twitter)</span>
                    </Link>
                    <Link 
                      href="https://discord.gg/gotchilabs" 
                      target="_blank"
                      className="px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] flex items-center justify-center"
                    >
                      <Image src="/discord.svg" alt="Discord" width={16} height={16} className="mr-1" />
                      <span className="text-xs">Discord</span>
                    </Link>
                    <Link 
                      href="https://github.com/gotchipus" 
                      target="_blank"
                      className="px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] flex items-center justify-center"
                    >
                      <Image src="/github.svg" alt="GitHub" width={16} height={16} className="mr-1" />
                      <span className="text-xs">GitHub</span>
                    </Link>
                    <Link 
                      href="https://docs.gotchipus.com" 
                      target="_blank"
                      className="px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer hover:bg-[#d4d0c8] flex items-center justify-center"
                    >
                      <Image src="/gitbook.svg" alt="GitBook" width={16} height={16} className="mr-1" />
                      <span className="text-xs">GitBook</span>
                    </Link>
                  </div>
                </div>

                {walletStore.isWalletConnectConnected && (
                  <div className="border-t border-[#808080] pt-1">
                    <div className="text-xs font-bold text-[#000080] px-3 py-1">Connected dApp</div>
                    <div className="px-3 py-2 bg-[#c0c0c0] border border-[#808080] shadow-win98-inner">
                      <div className="flex items-center">
                        <Image src="/icons/walletconnect-logo.png" alt="WalletConnect" width={16} height={16} className="mr-2" />
                        <span className="text-xs">{walletStore.walletConnectDappMetadata?.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#c0c0c0] border-t-2 border-[#dfdfdf] shadow-win98-outer flex items-center justify-between px-1 z-50 h-14">
      <div className="flex items-center flex-1 overflow-hidden h-10">
        <button
          className={`px-3 mr-1 font-bold text-sm flex items-center justify-center text-white border border-[#808080] h-10 min-w-[80px] ${
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
          <span className="ml-1 text-sm">Gotchipus</span>
        </button>

        <div
          className="text-sm flex items-center justify-center bg-[#c0c0c0] border border-[#808080] shadow-win98-outer active:shadow-inner h-10 min-w-[100px]"
        >
          <CustomConnectButton />
        </div>

        <div className="flex items-center overflow-x-auto scrollbar-none ml-1">
          {openWindows.map((window) => (
            <button
              key={window.id}
              className={`min-w-[120px] px-2 ml-1 text-sm flex items-center justify-start truncate border border-[#808080] bg-[#c0c0c0] h-10 gap-1.5 ${
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
              {window.icon && (
                <Image
                  src={window.icon}
                  alt=""
                  width={16}
                  height={16}
                  className="flex-shrink-0"
                />
              )}
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center h-10 gap-2">
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
          <SelectTrigger className="bg-[#c0c0c0] border border-[#808080] shadow-win98-inner cursor-pointer rounded-none w-[80px] h-10">
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

        <div className="flex flex-row gap-2 items-center bg-[#c0c0c0] px-2 border border-[#808080] cursor-pointer shadow-win98-inner h-10">
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
            <div className="w-2 h-2 mr-2 rounded-full bg-[#008000]"></div>
            <div className="absolute top-0 left-0 w-2 h-2 mr-2 rounded-full animate-ping bg-[#008000]"></div>
          </div>
          <a 
            href={`https://atlantic.pharosscan.xyz/block/${blockNumber?.toString()}`} 
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
