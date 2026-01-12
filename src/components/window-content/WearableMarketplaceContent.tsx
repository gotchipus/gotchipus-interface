'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useWearableMarketplaceWrite } from "@/src/hooks/useContract"
import { useToast } from '@/hooks/use-toast'
import { ethers } from "ethers"
import { observer } from "mobx-react-lite"
import { useStores } from "@stores/context"
import useResponsive from "@/hooks/useResponsive"
import { TOKEN_ID_TO_IMAGE } from "@/components/gotchiSvg/config"
import { getWearableName, WearableType } from "@/src/utils/wearableMapping"
import {
  WearableItem,
  CartItem,
  RARITY_MULTIPLIER,
  EquipCard,
  EquipDetailModal,
  ShoppingCart,
  FilterSidebar
} from "@/components/equip"
import { Win98Loading } from "@/components/ui/win98-loading"

const generateItemMetadata = (index: number) => {
  const rarities: ('common' | 'rare' | 'epic' | 'legendary')[] = ['common', 'common', 'common', 'rare', 'rare', 'epic', 'legendary'];
  const rarity = rarities[index % rarities.length];
  const basePrice = 0.001;
  const price = basePrice * RARITY_MULTIPLIER[rarity];

  return {
    rarity,
    price: Number(basePrice.toFixed(4)),
    description: `A ${rarity} wearable NFT for your character customization.`
  };
};

const generateWearableItems = (): WearableItem[] => {
  const items: WearableItem[] = [];

  Object.entries(TOKEN_ID_TO_IMAGE).forEach(([tokenIdStr, imagePath]) => {
    const tokenId = parseInt(tokenIdStr);

    let category: 'head' | 'hand' | 'clothes' | 'face' | 'mouth' | null = null;
    let wearableType: WearableType | null = null;
    let index = 0;

    if (tokenId >= 46 && tokenId <= 62) {
      category = 'head';
      wearableType = 'heads';
      index = tokenId - 46;
    } else if (tokenId >= 32 && tokenId <= 45) {
      category = 'hand';
      wearableType = 'hands';
      index = tokenId - 32;
    } else if (tokenId >= 63 && tokenId <= 71) {
      category = 'clothes';
      wearableType = 'clothes';
      index = tokenId - 63;
    } else if (tokenId >= 72 && tokenId <= 78) {
      category = 'face';
      wearableType = 'faces';
      index = tokenId - 72;
    } else if (tokenId >= 79 && tokenId <= 84) {
      category = 'mouth';
      wearableType = 'mouths';
      index = tokenId - 79;
    }

    if (category && wearableType) {
      const name = getWearableName(wearableType, index);
      const metadata = generateItemMetadata(tokenId);

      items.push({
        id: tokenId,
        name,
        imagePath,
        category,
        ...metadata
      });
    }
  });

  return items.sort((a, b) => a.id - b.id);
};

const WearableMarketplaceContent = observer(() => {
  const { t } = useTranslation();
  const { toast } = useToast()
  const { walletStore } = useStores()
  const isMobile = useResponsive()

  const {
    purchaseWearables,
    isConfirmed,
    error,
    isPending,
    isConfirming
  } = useWearableMarketplaceWrite();

  const [wearableItems] = useState<WearableItem[]>(generateWearableItems());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<WearableItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (isPending || isConfirming) {
      setIsPurchasing(true);
    }
  }, [isPending, isConfirming]);

  const addToCart = (item: WearableItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to cart before purchasing",
        variant: "destructive"
      });
      return;
    }

    setIsPurchasing(true);

    try {
      const itemIds = cart.map(item => item.id);
      const quantities = cart.map(item => item.quantity);
      const prices = cart.map(item => ethers.parseEther(item.price.toString()));
      console.log(itemIds, quantities, prices);
      
      await purchaseWearables(itemIds, quantities, prices);

      toast({
        title: "Transaction Submitted",
        description: "Your purchase request has been submitted",
      });
    } catch (error: any) {
      setIsPurchasing(false);
      toast({
        title: "Purchase Failed",
        description: error?.message || "Failed to submit purchase request",
        variant: "destructive"
      });
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsPurchasing(false);

      toast({
        title: "Purchase Successful",
        description: "You have successfully purchased your wearables!",
      });

      clearCart();
    }
  }, [isConfirmed, toast]);

  useEffect(() => {
    if (error) {
      setIsPurchasing(false);
      toast({
        title: "Purchase Failed",
        description: "Your purchase request was cancelled or failed",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const filteredItems = wearableItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || item.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedRarity('all');
  };

  return (
    <div className={`bg-[#c0c0c0] min-h-screen pb-24 ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-30 bg-[#000080] text-white font-bold mb-4 ${isMobile ? 'p-3' : 'p-4'} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={isMobile ? 'text-lg' : 'text-2xl'}>Wearable Marketplace</h1>
            <p className={`font-normal ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Browse and purchase exclusive wearables for your GOTCHIs
            </p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className={`relative border-2 border-white bg-[#000060] hover:bg-[#000040] font-bold transition-all
              ${isMobile ? 'px-3 py-2' : 'px-4 py-2'}`}
          >
            <Image src="/icons/marketplace.png" alt="Cart" width={24} height={24} />
            {cart.length > 0 && (
              <span className={`absolute -top-2 -right-2 bg-red-600 text-white rounded-full
                ${isMobile ? 'w-5 h-5 text-xs' : 'w-6 h-6 text-sm'} flex items-center justify-center animate-pulse`}>
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className={`flex gap-4 ${isMobile ? 'flex-col gap-3' : ''}`}>
        <FilterSidebar
          selectedCategory={selectedCategory}
          selectedRarity={selectedRarity}
          resultCount={filteredItems.length}
          onCategoryChange={setSelectedCategory}
          onRarityChange={setSelectedRarity}
          onResetFilters={handleResetFilters}
        />

        <div className="flex-1">
          {filteredItems.length === 0 ? (
            <div className={`text-center border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] ${isMobile ? 'py-8' : 'py-16'}`}>
              <p className={`font-bold text-[#808080] ${isMobile ? 'text-base' : 'text-lg'}`}>
                No items found matching your filters
              </p>
              <p className={`text-[#808080] mt-2 ${isMobile ? 'text-sm' : ''}`}>
                Try adjusting your filter settings
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {filteredItems.map((item) => (
                <EquipCard
                  key={item.id}
                  item={item}
                  isInCart={cart.some(cartItem => cartItem.id === item.id)}
                  onItemClick={setSelectedItem}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}

          {filteredItems.length > 0 && (
            <div className={`mt-6 text-center border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] ${isMobile ? 'p-3 text-xs' : 'p-4 text-sm'}`}>
              <p className="mb-2">
                These wearables can be used to customize your GOTCHIs in the game.
              </p>
              <p className="text-[#000080] font-bold">
                All NFTs are unique and stored on the blockchain!
              </p>
            </div>
          )}
        </div>
      </div>

      <EquipDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={addToCart}
      />

      {cart.length > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#d4d0c8] border-t-4 border-[#808080] 
          shadow-[0_-4px_12px_rgba(0,0,0,0.3)] ${isMobile ? 'px-2 py-2' : 'px-6 py-3'}`}>
          <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4 ${isMobile ? 'flex-col' : ''}`}>
            <div className={`flex items-center gap-4 ${isMobile ? 'w-full justify-between' : ''}`}>
              <button
                onClick={() => setShowCart(true)}
                className={`flex items-center gap-2 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] 
                  hover:bg-[#b0b0b0] active:shadow-win98-inner font-bold transition-all
                  ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
              >
                <Image src="/icons/marketplace.png" alt="Cart" width={20} height={20} />
                <span>View Cart</span>
                <span className="bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {getTotalItems()}
                </span>
              </button>
              
              <div className={`flex items-center gap-2 ${isMobile ? 'flex-col items-start' : ''}`}>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-[#808080]`}>
                  <span className="font-bold">{getTotalItems()}</span> item{getTotalItems() !== 1 ? 's' : ''} in cart
                </div>
                <div className={`font-bold text-[#000080] ${isMobile ? 'text-base' : 'text-xl'}`}>
                  {getTotalPrice().toFixed(4)} PHRS
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}>
              <button
                onClick={clearCart}
                disabled={isPurchasing}
                className={`border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold
                  hover:bg-[#b0b0b0] active:shadow-win98-inner disabled:opacity-50 disabled:cursor-not-allowed
                  ${isMobile ? 'px-3 py-1.5 text-xs flex-1' : 'px-4 py-2 text-sm'}`}
              >
                Clear
              </button>
              {walletStore.isConnected ? (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing || cart.length === 0}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white font-bold
                    hover:bg-[#006000] active:shadow-win98-inner disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all ${isMobile ? 'px-4 py-2 text-sm flex-1' : 'px-6 py-2 text-base'}`}
                >
                  {isPurchasing ? (
                    <Win98Loading className="w-full" text="Processing..." />
                  ) : (
                    `Buy Now (${getTotalPrice().toFixed(4)} PHRS)`
                  )}
                </button>
              ) : (
                <div className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] 
                  ${isMobile ? 'flex-1' : ''}`}>
                  <button
                    className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#000080] text-white font-bold
                      hover:bg-[#000060] active:shadow-win98-inner
                      ${isMobile ? 'px-4 py-2 text-xs' : 'px-6 py-2 text-sm'}`}
                    onClick={() => {
                      toast({
                        title: "Connect Wallet",
                        description: "Please connect your wallet to purchase items",
                        variant: "destructive"
                      });
                    }}
                  >
                    Connect Wallet to Buy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <ShoppingCart
          cart={cart}
          isConnected={walletStore.isConnected}
          isPurchasing={isPurchasing}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onPurchase={handlePurchase}
          getTotalPrice={getTotalPrice}
          getTotalItems={getTotalItems}
        />
      )}
    </div>
  )
})

export default WearableMarketplaceContent;
