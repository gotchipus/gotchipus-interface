'use client'

import { useState, useEffect } from 'react';
import GotchiGrid from "./GotchiGrid";
import Image from "next/image";
import { useEquippedItems } from "@/hooks/useEquippedItems";
import { useContractRead } from "@/hooks/useContract";
import { useStores } from "@stores/context";
import { observer } from "mobx-react-lite";
import SvgIcon from "@/components/gotchiSvg/SvgIcon";
import EquipSelectWindow from "@/components/window-content/equip/EquipSelectWindow";
import { BG_BYTES32, BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32 } from "@/lib/constant";
import { useSvgLayers } from "@/hooks/useSvgLayers";
import { SvgComposer } from "@/components/gotchiSvg/SvgComposer";
import { ArrowLeft } from "lucide-react";
import { GotchiItem } from '@/lib/types';

interface WearableComponentProps {
  onEquipSuccess?: (tokenId: string, txHash: string) => void;
}

const WearableComponent = observer(({ onEquipSuccess }: WearableComponentProps) => {
  const [gotchiList, setGotchiList] = useState<GotchiItem[]>([]);
  const [loadingGotchis, setLoadingGotchis] = useState(true);
  const [selectedGotchi, setSelectedGotchi] = useState<GotchiItem | null>(null);
  const [showWearableInterface, setShowWearableInterface] = useState(false);
  const [selectedEquipSlot, setSelectedEquipSlot] = useState<number | null>(null);
  const [showEquipWindow, setShowEquipWindow] = useState(false);
  const [wearableBalances, setWearableBalances] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const { walletStore } = useStores();

  const { layers, backgroundSvg, isLoading: svgLoading } = useSvgLayers(selectedGotchi?.id || "");

  const { equippedItems, isLoading: isLoadingEquipped } = useEquippedItems(
    selectedGotchi ? parseInt(selectedGotchi.id) : 0
  );

  const owners = new Array(54).fill(walletStore.address);
  const tokenIds = Array.from({ length: 54 }, (_, i) => i);
  const { data: balances } = useContractRead("wearableBalanceOfBatch", [owners, tokenIds]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (balances) {
      setWearableBalances(balances as string[]);
    }
  }, [balances]);

  useEffect(() => {
    if (!walletStore.isConnected || !walletStore.address) {
      setGotchiList([]);
      setLoadingGotchis(false);
      return;
    }

    const fetchGotchis = async () => {
      try {
        setLoadingGotchis(true);
        const response = await fetch(`/api/tokens/gotchipus?owner=${walletStore.address}`);
        if (response.ok) {
          const data = await response.json();
          console.log('data', data);

          const gotchis = data.ids.map((id: string, index: number) => ({
            id,
            info: data.gotchipusInfo[index]
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
  }, [walletStore.address, walletStore.isConnected]);

  const handleGotchiSelect = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
  };

  const handleSelectedGotchiChange = (gotchi: GotchiItem | null) => {
    if (gotchi) {
      setSelectedGotchi(gotchi);
    }
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

  const handleEquipWearable = (gotchi: GotchiItem) => {
    setSelectedGotchi(gotchi);
    setShowWearableInterface(true);
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


  if (loadingGotchis) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">Loading your Gotchis...</p>
      </div>
    );
  }

  if (gotchiList.length === 0) {
    return (
      <div 
        className={`bg-[#c0c0c0] border-2 shadow-win98-innerp-6 text-center transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <p className="text-sm text-[#404040]">You don't have any Gotchis yet!</p>
        <p className="text-xs text-[#808080] mt-2">Mint some Gotchis first to equip them with wearables.</p>
      </div>
    );
  }

  if (showWearableInterface && selectedGotchi) {
    return (
      <div 
        className={`w-full transition-all duration-800 ease-out origin-top-left ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0'
        }`}
        style={{
          clipPath: isVisible 
            ? 'circle(150% at 0% 0%)' 
            : 'circle(0% at 0% 0%)',
          transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="px-4 py-2 border-2 font-bold text-sm bg-[#c0c0c0] border-[#dfdfdf] text-black shadow-win98-outer hover:bg-[#d0d0d0] active:shadow-win98-inner flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-4">
              <div className="flex items-center justify-center h-64 bg-[#d4d0c8] border-2 border-[#808080] shadow-win98-inner"
                   style={backgroundSvg ? { 
                     backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${backgroundSvg}</svg>`)}")`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                   } : {}}>
                <div className="text-center">
                  {svgLoading ? (
                    <div className="text-sm">Loading...</div>
                  ) : selectedGotchi ? (
                    <div className="relative flex items-center justify-center w-48 h-48">
                      <SvgComposer layers={layers} />
                    </div>
                  ) : (
                    <Image 
                      src="/not-any.png" 
                      alt="No Gotchi selected"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  )}
                  <p className="text-sm font-bold mt-2 text-white">{selectedGotchi.info?.name || `Gotchi #${selectedGotchi.id}`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] p-4">
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
                        className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0e0]" : "border-[#808080] bg-[#c0c0c0]"} shadow-win98-inner flex items-center justify-center p-3`}
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
                        className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#e0e0e0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-win98-inner text-center font-medium p-2`}
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
            onSuccess={onEquipSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`transition-all duration-800 ease-out origin-top-left ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-0'
      }`}
      style={{
        clipPath: isVisible 
          ? 'circle(150% at 0% 0%)' 
          : 'circle(0% at 0% 0%)',
        transition: 'clip-path 800ms ease-out, opacity 800ms ease-out, transform 800ms ease-out'
      }}
    >
      <GotchiGrid
        gotchiList={gotchiList}
        onGotchiAction={handleEquipWearable}
        onGotchiSelect={handleGotchiSelect}
        onSelectedGotchiChange={handleSelectedGotchiChange}
        selectedGotchiId={selectedGotchi?.id || null}
        getButtonText={() => "Equip"}
        isLoading={loadingGotchis}
        emptyMessage="No Gotchis available for equipment"
        emptySubMessage="Mint some Gotchis first to manage their equipment."
      />
    </div>
  );
});

export default WearableComponent;