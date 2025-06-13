'use client'

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"
import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import { ALL_WEARABLE_SVG } from "@/components/gotchiSvg/svgs"
import { HEAD_BYTES32, HAND_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant"

interface WearableItem {
  id: number;
  name: string;
  svg: string;
  category: 'head' | 'hands' | 'clothes';
}

const CATEGORIES = [
  { id: 'head', name: 'Head Wearables', type: HEAD_BYTES32 },
  { id: 'hands', name: 'Hands Wearables', type: HAND_BYTES32 },
  { id: 'clothes', name: 'Clothes Wearables', type: CLOTHES_BYTES32 }
];

const ClaimWearableContent = observer(() => {
  const { t } = useTranslation();
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast()
  const { walletStore } = useStores()

  const {contractWrite, isConfirmed, isConfirming, isPending, error, receipt} = useContractWrite();

  const generateWearableItems = (): WearableItem[] => {
    const items: WearableItem[] = [];
    let id = 1;
    
    CATEGORIES.forEach(category => {
      const categoryItems = ALL_WEARABLE_SVG[category.type as keyof typeof ALL_WEARABLE_SVG] || [];
      
      categoryItems.forEach((item, index) => {
        if (item && item.svg) {
          items.push({
            id: id++,
            name: item.name,
            svg: item.svg,
            category: category.id as 'head' | 'hands' | 'clothes'
          });
        }
      });
    });
    
    return items;
  };

  const [wearableItems, setWearableItems] = useState<WearableItem[]>(generateWearableItems());

  const handleClaimAll = () => {
    setIsClaiming(true);
    
    contractWrite("claimWearable", []);
    
    toast({
      title: "Transaction Submitted",
      description: "Your claim request has been submitted",
    });
  };
  
  useEffect(() => {
    if (isConfirmed) {
      setIsClaiming(false);
      
      toast({
        title: "Claim Successful",
        description: "You have successfully claimed all wearables",
      });
    }
  }, [isConfirmed, toast]);

  useEffect(() => {
    if (error) {
      setIsClaiming(false);
      toast({
        title: "Claim Failed",
        description: "Your claim request was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const headItems = wearableItems.filter(item => item.category === 'head');
  const handsItems = wearableItems.filter(item => item.category === 'hands');
  const clothesItems = wearableItems.filter(item => item.category === 'clothes');

  const renderCategorySection = (title: string, items: WearableItem[]) => {
    return (
      <div className="mb-6">
        <h3 className="text-center font-bold text-[#000080] mb-2 border-b border-[#808080] pb-1">{title}</h3>
        <div className="grid grid-cols-9 gap-2">
          {items.map((item) => (
            <div 
              key={item.id}
              className="border border-[#808080] p-1 shadow-win98-inner"
            >
              <div className="aspect-square bg-[#d4d0c8] flex items-center justify-center mb-1">
                <SvgIcon
                  svgString={item.svg}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <p className="shadow-win98-outer text-center text-xs font-bold truncate" title={item.name}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-[#c0c0c0]">      
      <div className="bg-[#c0c0c0] p-4">
        <div className="flex flex-col items-center">
          <div className="mb-4 border-2 border-[#dfdfdf] border-t-black border-l-black border-r-[#808080] border-b-[#808080] p-2 w-full">
            <h2 className="text-center font-bold text-[#000080] mb-2">Claim Your Free Wearables</h2>
            <p className="text-center text-sm mb-4">You can claim all {wearableItems.length} free wearable NFTs at once</p>
            
            {/* Head Items */}
            {renderCategorySection(CATEGORIES[0].name, headItems)}
            
            {/* Hands Items */}
            {renderCategorySection(CATEGORIES[1].name, handsItems)}
            
            {/* Clothes Items */}
            {renderCategorySection(CATEGORIES[2].name, clothesItems)}
            
            <div className="flex justify-center mt-4">
              {walletStore.isConnected ? (
                <button 
                  onClick={handleClaimAll}
                  disabled={isClaiming}
                  className={`py-2 px-8 border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold 
                    ${isClaiming ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c0c0c0]'} 
                    flex items-center justify-center`}
                >
                  {isClaiming ? (
                    <Win98Loading text="Claiming in progress..." />
                  ) : (
                    <>
                      <span className="mr-2">🎮</span> 
                      Claim All Wearables
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full max-w-xs border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm font-bold hover:bg-[#c0c0c0] flex items-center justify-center">
                  <CustomConnectButton />
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-sm">
            <p>
              These wearables can be used to customize your character in the game.
            </p>
            <p className="text-[#000080] font-bold mt-1">
              Limited time offer - Claim yours today!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ClaimWearableContent;
