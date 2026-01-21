'use client'

import Image from "next/image"
import SvgIcon from "@/components/gotchiSvg/SvgIcon"
import useResponsive from "@/hooks/useResponsive"
import { CustomConnectButton } from "@/components/footer/CustomConnectButton"
import { Win98Loading } from "@/components/ui/win98-loading"
import { CartItem } from "./types"
import { X } from "lucide-react"

interface ShoppingCartProps {
  cart: CartItem[];
  isConnected: boolean;
  isPurchasing: boolean;
  onClose: () => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
  onPurchase: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const ShoppingCart = ({
  cart,
  isConnected,
  isPurchasing,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPurchase,
  getTotalPrice,
  getTotalItems
}: ShoppingCartProps) => {
  const isMobile = useResponsive();

  return (
    <>
      <div
        className="absolute inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      <div
        className={`absolute bg-[#c0c0c0] border-4 border-[#dfdfdf] border-t-white border-l-white border-r-[#808080] border-b-[#808080]
          shadow-2xl z-50 flex flex-col ${isMobile ? 'inset-4' : 'top-4 right-4 bottom-4 w-96'}`}
      >
        <div className="bg-[#000080] text-white font-bold flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <span className={isMobile ? 'text-sm' : 'text-base'}>Cart</span>
            {cart.length > 0 && (
              <span className="bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-[#c0c0c0] border border-[#808080] shadow-win98-outer flex items-center justify-center hover:bg-[#d4d0c8]"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-2' : 'p-4'}`}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Image src="/icons/marketplace.png" alt="Cart" width={24} height={24} />
              <p className={`font-bold text-[#808080] ${isMobile ? 'text-sm' : 'text-base'}`}>Your cart is empty</p>
              <p className={`text-xs text-[#808080] mt-2`}>Add items to get started!</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] mb-3 ${isMobile ? 'p-2' : 'p-3'}`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-white border-2 border-[#808080] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <SvgIcon
                        imagePath={item.imagePath}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${isMobile ? 'text-xs' : 'text-sm'}`} title={item.name}>
                        {item.name}
                      </p>
                      <p className={`text-[#808080] text-xs mb-1`}>#{item.id}</p>
                      <p className={`text-[#000080] font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {item.price} PHRS
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#808080]">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] px-3 py-1 text-sm font-bold hover:bg-[#b0b0b0] active:shadow-win98-inner"
                    >
                      -
                    </button>
                    <span className={`font-bold flex-shrink-0 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] px-3 py-1 text-sm font-bold hover:bg-[#b0b0b0] active:shadow-win98-inner"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-auto border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] px-3 py-1 text-sm font-bold hover:bg-red-200 active:shadow-win98-inner"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className={`border-t-4 border-[#808080] bg-[#d4d0c8] ${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="border-2 border-[#808080] shadow-win98-inner bg-white p-3 mb-3">
              <div className="flex justify-between items-center">
                <span className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>Total:</span>
                <span className={`font-bold text-[#000080] ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {getTotalPrice().toFixed(4)} PHRS
                </span>
              </div>
              <div className="text-xs text-[#808080] mt-1 text-right">
                {getTotalItems()} item(s)
              </div>
            </div>

            {isConnected ? (
              <div className="space-y-2">
                <button
                  onClick={onPurchase}
                  disabled={isPurchasing || cart.length === 0}
                  className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white font-bold
                    ${isPurchasing || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#006000] active:shadow-win98-inner'}
                    ${isMobile ? 'py-2 text-sm' : 'py-3 text-base'}`}
                >
                  {isPurchasing ? (
                    <Win98Loading className="w-full p-2" text="Processing..." />
                  ) : (
                    'Buy Now'
                  )}
                </button>
                <button
                  onClick={onClearCart}
                  disabled={isPurchasing}
                  className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold
                    hover:bg-[#b0b0b0] active:shadow-win98-inner ${isMobile ? 'py-1.5 text-xs' : 'py-2 text-sm'}`}
                >
                  🗑 Clear Cart
                </button>
              </div>
            ) : (
              <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] font-bold hover:bg-[#c0c0c0]">
                <CustomConnectButton />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
