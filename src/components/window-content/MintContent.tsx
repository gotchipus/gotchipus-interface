'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTranslation, Trans } from "react-i18next"
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"


const MintContent = observer(() => {
  const { t } = useTranslation();
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast()
  const { walletStore } = useStores()

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const handleMint = () => {
    setIsMinting(true);
    contractWrite("freeMint", []);
    
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
        const taskBody = {
          "address": walletStore.address,
          "task_id": 4 
        };

        const isCompleted = await fetch('/api/tasks/is_task_completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskBody),
        });

        const isCompletedData = await isCompleted.json();

        if (isCompletedData.data === true && isCompletedData.code === 0) {
          return;
        }

        const body = {
          "address": walletStore.address,
          "task_id": 4 
        };

        const response = await fetch('/api/tasks/complete-select-task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
      }

      upsertData();
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
    setMintAmount(1)
  };
  
  const decrementAmount = () => {
    setMintAmount(1)
  };
  
  return (
    <div className="p-4 bg-[#c0c0c0] border-2 border-[#dfdfdf] border-t-black border-l-black border-r-[#808080] border-b-[#808080]">      
      <div className="bg-[#c0c0c0] p-4 border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-black border-b-black">
        <div className="flex flex-col items-center">
          <div className="mb-4 border-2 border-[#dfdfdf] border-t-black border-l-black border-r-[#808080] border-b-[#808080] p-2">
            <Image 
              src="/pharos-mint.png" 
              alt="Mint Preview" 
              width={300} 
              height={300} 
              className="border border-[#808080]"
            />
          </div>
          
          <div className="w-full max-w-md mb-4">
            <div className="bg-[#c0c0c0] p-2 border-2 border-[#dfdfdf] border-t-[#808080] border-l-[#808080] border-r-black border-b-black mb-2">
              <p className="text-center font-bold text-[#000080]">
                <Trans i18nKey="mint.free">{t("mint.free")}</Trans>
              </p>
              <p className="text-center text-sm">
                <Trans i18nKey="mint.noCost">{t("mint.noCost")}</Trans>
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={decrementAmount}
                className="w-8 h-8 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0]"
              >
                -
              </button>
              
              <span className="text-xl font-bold">{mintAmount}</span>
              
              <button 
                onClick={incrementAmount}
                className="w-8 h-8 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm flex items-center justify-center font-bold hover:bg-[#c0c0c0]"
              >
                +
              </button>
            </div>
            
            {walletStore.isConnected ? (
              <button 
                onClick={handleMint}
                disabled={isMinting}
                className="w-full py-2 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] flex items-center justify-center"
              >
                {isMinting ? (
                  <Win98Loading text="Minting in progress..." />
                ) : (
                  <>
                    <span className="mr-2">🐙</span> 
                    <Trans i18nKey="mint.button">{t("mint.button")}</Trans>
                  </>
                )}
              </button>
            ) : (
              <div 
                className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] flex items-center justify-center"
              >
                <CustomConnectButton />
              </div>
            )}
          </div>
          
          <div className="text-center text-sm">
            <p>
              <Trans i18nKey="mint.description">{t("mint.description")}</Trans>
            </p>
            <p className="text-[#000080] font-bold mt-1">
              <Trans i18nKey="mint.limited">{t("mint.limited")}</Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default MintContent;
