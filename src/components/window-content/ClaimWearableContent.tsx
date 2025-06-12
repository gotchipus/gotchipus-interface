'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useContractWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"

interface WearableItem {
  id: number;
  name: string;
  image: string;
  category: 'head' | 'hands' | 'clothes';
}

const CATEGORIES = [
  { id: 'head', name: 'Head Wearables', path: '/gotchi/Head' },
  { id: 'hands', name: 'Hands Wearables', path: '/gotchi/Hands' },
  { id: 'clothes', name: 'Clothes Wearables', path: '/gotchi/Clothes' }
];

const WEARABLE_ITEMS = {
  head: [
    { name: "Brain Dome", image: "Transparent Brain Dome Mini Lighthouse.png" },
    { name: "Shark Hoodie", image: "Shark Hoodie.png" },
    { name: "Space Helmet", image: "Space Helmet.png" },
    { name: "Lighthouse Hat", image: "Lightthouse Hat Pharos Network.png" },
    { name: "Logo Hat", image: "Logo Hat.png" },
    { name: "Pirate Hat", image: "Pirate Hat.png" },
    { name: "Rocket Helmet", image: "Rocket Booster Helmet.png" },
    { name: "Royal Crown", image: "Royal Crown Gem Encrusted.png" },
    { name: "Diver Helmet", image: "Diver Helmet.png" }
  ],
  hands: [
    { name: "Starfish Gloves", image: "Starfish Gloves.png" },
    { name: "Water Bubbles", image: "Water Bubbles.png" },
    { name: "Fire Fist", image: "Fire Fist.png" },
    { name: "Harpoon Trident", image: "Harpoon Trident.png" },
    { name: "Ice Shards", image: "Ice Shards.png" },
    { name: "Crystal Magic", image: "Crystal Magic Hands.png" },
    { name: "Electric Claws", image: "Electric Claws.png" },
    { name: "Crab Claws", image: "Crab Claws.png" },
    { name: "Boxing Gloves", image: "Boxing Gloves.png" }
  ],
  clothes: [
    { name: "Seaweed Scarf", image: "Seaweed Scarf.png" },
    { name: "Swimmer Outfit", image: "Swimmer Outfit.png" },
    { name: "Traveller", image: "Traveller.png" },
    { name: "Explorer Harness", image: "Explorer Harness.png" },
    { name: "Futuristic Armor", image: "Futuristic Chest Armor.png" },
    { name: "Jellyfish Cape", image: "Jellyfish Cape.png" },
    { name: "Lighthouse Backpack", image: "Lighthouse Mini Backpack.png" },
    { name: "Sailor Uniform", image: "Sailor Uniform.png" },
    { name: "Energy Backpack", image: "Energy Backpack.png" }
  ]
};

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
      const categoryItems = WEARABLE_ITEMS[category.id as keyof typeof WEARABLE_ITEMS];
      
      categoryItems.forEach(item => {
        items.push({
          id: id++,
          name: item.name,
          image: `${category.path}/${item.image}`,
          category: category.id as 'head' | 'hands' | 'clothes'
        });
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
                <Image 
                src={item.image} 
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
