import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { GotchiCard } from "./GotchiCard";
import Image from "next/image";
import { useEquippedItems } from "@/hooks/useEquippedItems";
import { useContractRead } from "@/hooks/useContract";
import { useStores } from "@stores/context";
import { observer } from "mobx-react-lite";
import SvgIcon from "@/components/gotchiSvg/SvgIcon";
import EquipSelectWindow from "@/components/window-content/equip/EquipSelectWindow";
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant";

interface GotchiItem {
  id: string;
  image?: string;
}

interface WearableComponentProps {
  onEquipSuccess?: (tokenId: string, txHash: string) => void;
}

export const WearableComponent = observer(({ onEquipSuccess }: WearableComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showWearableInterface, setShowWearableInterface] = useState(false);
  const [selectedEquipSlot, setSelectedEquipSlot] = useState<number | null>(null);
  const [showEquipWindow, setShowEquipWindow] = useState(false);
  const [wearableBalances, setWearableBalances] = useState<string[]>([]);
  
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { walletStore } = useStores();

  const { equippedItems, isLoading: isLoadingEquipped } = useEquippedItems(
    selectedGotchi ? parseInt(selectedGotchi.id) : 0
  );

  const owners = new Array(54).fill(walletStore.address);
  const tokenIds = Array.from({ length: 54 }, (_, i) => i);
  const { data: balances } = useContractRead("wearableBalanceOfBatch", [owners, tokenIds]);

  useEffect(() => {
    if (balances) {
      setWearableBalances(balances as string[]);
    }
  }, [balances]);

  useEffect(() => {
    if (!isConnected || !address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${address}`);
        if (response.ok) {
          const data = await response.json();
          const gotchis = data.filteredIds.map((id: string) => ({
            id,
            image: `/pus.png`
          }));
          setGotchiList(gotchis);
        }
      } catch (error) {
        console.error('Failed to fetch gotchis:', error);
      } finally {
        setLoadingGotchis(false);
      }
    };

    fetchGotchis();
  }, [address, isConnected]);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowWearableInterface(true);
  };

  const handleBackToList = () => {
    setShowWearableInterface(false);
    setSelectedGotchi(null);
    setSelectedEquipSlot(null);
    setShowEquipWindow(false);
  };

  const handleEquipSlotClick = (index: number) => {
    if (equippedItems[index]?.canEquip) {
      setSelectedEquipSlot(index);
      setShowEquipWindow(true);
    }
  };

  const handleEquipWearable = (ids: string[]) => {
  };

  const handleCloseEquipWindow = () => {
    setShowEquipWindow(false);
    setSelectedEquipSlot(null);
  };

  const getSelectedEquipType = () => {
    if (selectedEquipSlot === null) return undefined;
    const EQUIPMENT_TYPES = [
      BG_BYTES32,     
      BODY_BYTES32,   
      EYE_BYTES32,    
      HAND_BYTES32,   
      HEAD_BYTES32,   
      CLOTHES_BYTES32 
    ];
    return EQUIPMENT_TYPES[selectedEquipSlot];
  };

  if (!isConnected) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <div className="bg-[#0078d4] text-white px-3 py-1 mb-4 flex items-center">
          <div className="mr-2 font-bold">⚠️</div>
          <div className="text-sm font-bold">Connect Required</div>
        </div>
        <p className="text-sm text-[#404040] mb-4">Please connect your wallet to view your Gotchis</p>
        <button
          className="px-6 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          onClick={() => openConnectModal?.()}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loadingGotchis) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div className="bg-[#c0c0c0] border-2 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] p-6 text-center">
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to equip them with wearables.</p>
      </div>
    );
  }

  if (showWearableInterface && selectedGotchi) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] hover:bg-[#d0d0d0] active:shadow-[inset_1px_1px_#0a0a0a,inset_-1px_-1px_#fff]"
          >
            ← Back to List
          </button>
          <h2 className="text-lg font-bold">Equip Gotchi #{selectedGotchi.id}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <div className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-[#d4d0c8] p-4">
              <div className="font-bold mb-3 flex items-center border-b border-[#808080] pb-2">
                <Image src="/icons/gotchi.png" alt="Gotchi" width={18} height={18} className="mr-2" />
                Gotchi Preview
              </div>
              <div className="flex items-center justify-center h-64 bg-[#c0c0c0] border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff]">
                <div className="text-center">
                  <Image 
                    src={selectedGotchi.image || '/pus.png'} 
                    alt={`Gotchi #${selectedGotchi.id}`}
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                  <p className="text-sm font-bold mt-2">Gotchi #{selectedGotchi.id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <div className="border-2 border-[#808080] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] bg-[#d4d0c8] p-4">
              <div className="font-bold mb-4 flex items-center border-b border-[#808080] pb-2">
                <Image src="/icons/equip.png" alt="Equip" width={18} height={18} className="mr-2" />
                Equipment Slots
              </div>

              {isLoadingEquipped ? (
                <div className="text-center p-4">Loading equipped items...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {equippedItems.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex flex-col ${slot.canEquip ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-60"} ${selectedEquipSlot === index ? "scale-105" : ""} transition-transform`}
                      onClick={() => slot.canEquip && handleEquipSlotClick(index)}
                    >
                      <div
                        className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0e0]" : "border-[#808080] bg-[#c0c0c0]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] flex items-center justify-center p-3`}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          {slot.svgString ? (
                            <SvgIcon
                              svgString={slot.svgString}
                              alt={slot.name}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          ) : (
                            <div className="text-xs text-[#808080] text-center">
                              {slot.canEquip ? "Click to equip" : "Cannot equip"}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0e0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff] text-center font-medium p-2`}
                      >
                        <div className="text-sm">{slot.name}</div>
                        {slot.canEquip && (
                          <div className="text-xs text-[#606060] mt-1">
                            {slot.svgString ? "Equipped" : "Empty"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showEquipWindow && (
          <EquipSelectWindow
            onClose={handleCloseEquipWindow}
            wearableBalances={wearableBalances}
            selectedType={getSelectedEquipType()}
            selectedTokenId={selectedGotchi.id}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Select a Gotchi to Equip</h2>
        <p className="text-sm text-[#404040]">Choose one of your Gotchis to manage their equipment.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {gotchiList.map((gotchi) => (
          <div
            key={gotchi.id}
            onClick={() => handleGotchiSelect(gotchi)}
            className="cursor-pointer"
          >
            <GotchiCard
              name={`Gotchi #${gotchi.id}`}
              image={gotchi.image || ''}
              className="hover:shadow-lg transition-shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
});