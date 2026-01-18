'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTranslation, Trans } from "react-i18next"
import { useContractWrite, useContractRead } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"
import { checkAndCompleteTask } from "@/src/utils/taskUtils"
import { useWindowMode } from "@/hooks/useWindowMode"

const MintContent = observer(() => {
  const { t } = useTranslation();
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [totalMintedSupply, setTotalMintedSupply] = useState(0);
  const { toast } = useToast()
  const { walletStore } = useStores()
  const { mode: windowMode, width: windowWidth } = useWindowMode()
  const isMobileMode = windowMode === 'mobile' || (windowWidth !== null && windowWidth <= 640)

  const {contractWrite, isConfirmed, error} = useContractWrite();
  const { data: totalSupply, refetch: refetchTotalSupply } = useContractRead("totalSupply", [], {
    enabled: false
  });

  useEffect(() => {
    if (totalSupply) {
      setTotalMintedSupply(totalSupply as number);
    }
  }, [totalSupply])

  useEffect(() => {
    const timer = setInterval(() => {
      refetchTotalSupply();
    }, 1000);
    return () => clearInterval(timer);
  }, [])

  const handleMint = () => {
    setIsMinting(true);
    const amount = mintAmount * 0.04 * 10 ** 18;
    contractWrite("mint", [mintAmount], BigInt(amount));
    
    toast({
      title: "Submited Transaction",
      description: "Transaction submitted successfully",
    });
  };
  
  useEffect(() => {
    if (isConfirmed) {
      setIsMinting(false);
      toast({
        title: "Transaction Confirmed",
        description: "Transaction confirmed successfully",
      })

      const upsertData = async () => {
        await checkAndCompleteTask(walletStore.address!, 4);
      }

      upsertData();
      walletStore.setIsTaskRefreshing(true);
    }
  }, [isConfirmed])

  useEffect(() => {
    if (error) {
      setIsMinting(false);
      toast({
        title: "Transaction Cancelled",
        description: "Transaction was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const incrementAmount = () => {
    if (mintAmount < 30) {
      setMintAmount(mintAmount + 1)
    }
  };
  
  const decrementAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  };

  const isSoldOut = totalMintedSupply >= 20000;

  return (
    <div className={`bg-[#c0c0c0] border-2 border-[#dfdfdf] border-t-black border-l-black border-r-[#808080] border-b-[#808080] ${isMobileMode ? 'p-2' : 'p-4'}`}>      
      <div className={`bg-[#c0c0c0] border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-black border-b-black ${isMobileMode ? 'p-2' : 'p-4'}`}>
        <div className="flex flex-col items-center">
          <div className={`mb-4 p-2 ${isMobileMode ? 'mb-2' : ''}`}>
            <Image 
              src="/pharos-summon.gif" 
              alt="Mint Preview" 
              width={isMobileMode ? 200 : 300} 
              height={isMobileMode ? 200 : 300} 
              className="border border-[#808080]"
              unoptimized={true}
            />
          </div>
          
          <div className={`w-full ${isMobileMode ? 'max-w-sm' : 'max-w-md'} mb-4`}>
            <div className={`bg-[#c0c0c0] border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-black border-b-black mb-2 ${isMobileMode ? 'p-1' : 'p-2'}`}>
              <p className={`text-center font-bold text-[#000080] ${isMobileMode ? 'text-sm' : ''}`}>
                <Trans i18nKey="mint.mint">{t("mint.mint")}</Trans>
              </p>
              <p className={`text-center ${isMobileMode ? 'text-xs' : 'text-sm'}`}>
                <Trans i18nKey="mint.noCost">{t("mint.noCost")}</Trans>
              </p>
            </div>
            
            <div className={`flex items-center justify-between mb-4 ${isMobileMode ? 'mb-2' : ''}`}>
              <button 
                onClick={decrementAmount}
                disabled={isSoldOut}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed ${isMobileMode ? 'w-6 h-6 text-sm' : 'w-8 h-8'}`}
              >
                -
              </button>

              <div className="flex items-center">
                <input
                  type="text"
                  value={mintAmount === 0 ? '' : mintAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '') {
                      setMintAmount(0);
                    } else {
                      const num = parseInt(value, 10);
                      if (num <= 30) {
                        setMintAmount(num);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 1) {
                      setMintAmount(1);
                    } else if (value > 30) {
                      setMintAmount(30);
                    }
                  }}
                  disabled={isSoldOut}
                  className={`text-center font-bold bg-transparent border-none outline-none w-16 disabled:opacity-50 ${isMobileMode ? 'text-lg' : 'text-xl'}`}
                />
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={incrementAmount}
                  disabled={isSoldOut}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed ${isMobileMode ? 'w-6 h-6 text-sm' : 'w-8 h-8'}`}
                >
                  +
                </button>
                <button
                  onClick={() => setMintAmount(30)}
                  disabled={isSoldOut}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed ${isMobileMode ? 'w-6 h-6 text-sm' : 'w-8 h-8'}`}
                >
                  Max
                </button> 
              </div>
            </div>
            
            {walletStore.isConnected ? (
              <button 
                onClick={handleMint}
                disabled={isMinting || isSoldOut}
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${isMobileMode ? 'py-1 text-sm' : 'py-2'}`}
              >
                {isMinting ? (
                  <Win98Loading text={isMobileMode ? "Minting..." : "Minting in progress..."} />
                ) : isSoldOut ? (
                  "Sold out"
                ) : (
                  <>
                    <span className={`mr-2 ${isMobileMode ? 'text-sm' : ''}`}>🐙</span> 
                    <Trans i18nKey="mint.button">{t("mint.button")}</Trans>
                  </>
                )}
              </button>
            ) : (
              <div 
                className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] flex items-center justify-center ${isMobileMode ? 'py-1' : 'py-2'}`}
              >
                <CustomConnectButton />
              </div>
            )}
          </div>
          
          <div className={`text-center ${isMobileMode ? 'text-xs' : 'text-sm'}`}>
            <p>
              <Trans i18nKey="mint.description">{t("mint.description")}</Trans>
            </p>
            <p className={`text-[#000080] font-bold mt-1 ${isMobileMode ? 'text-xs' : ''}`}>
              <span className="text-[#000080] font-bold">
                Minted: {totalMintedSupply.toString()} / 20,000
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default MintContent;
