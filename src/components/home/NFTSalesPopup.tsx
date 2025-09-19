"use client"

import React, { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NFTSalesData {
  totalSupply: number
  currentMinted: number
  price: number
  phase: string
}

export default function NFTSalesPopup() {
  const [isVisible, setIsVisible] = useState(true)
  const [salesData, setSalesData] = useState<NFTSalesData>({
    totalSupply: 20000,
    currentMinted: 0,
    price: 0.025,
    phase: "Public Sale"
  })

  const percentage = (salesData.currentMinted / salesData.totalSupply) * 100

  if (!isVisible) return null

  return (
    <div
      className="fixed top-4 right-4 z-[9999] w-80 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer animate-in slide-in-from-top-2 duration-300"
      style={{ fontFamily: "MS Sans Serif, sans-serif" }}
    >
      <div className="flex items-center justify-between px-1 py-0.5 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white text-[11px] font-bold h-[18px]">
        <div className="flex items-center gap-1">
          <span className="text-[10px]"></span>
          <span>Gotchi Minted</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex items-center justify-center border border-[#808080] bg-[#c0c0c0] shadow-win98-outer w-4 h-4 hover:bg-[#d4d0c8] active:shadow-win98-inner"
        >
          <X className="text-black w-3 h-3" />
        </button>
      </div>

      <div className="p-3 text-[11px]">
        <div className="inline-block px-2 py-0.5 mb-3 bg-[#008080] text-white text-[10px] font-bold border border-black">
          {salesData.phase}
        </div>

        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-black">Minted:</span>
            <span className="font-bold text-[#000080]">
              {salesData.currentMinted.toLocaleString()} / {salesData.totalSupply.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-black">Price:</span>
            <span className="font-bold text-[#008000]">
              {salesData.price} PHRS
            </span>
          </div>
        </div>

        <div className="mb-2">
          <div className="bg-black border border-[#808080] shadow-win98-inner p-0.5">
            <div className="relative h-4 bg-white">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  background: "repeating-linear-gradient(90deg, #000080 0px, #000080 2px, #1084d0 2px, #1084d0 4px)"
                }}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                  percentage > 50 ? "text-white" : "text-black"
                }`}
                style={{
                  textShadow: percentage > 50 ? "1px 1px 0px #000080" : "none"
                }}
              >
                {percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 mb-2 bg-[#ffffcc] border border-[#808080] shadow-win98-inner text-[10px] text-black">
          <div className="flex items-start gap-1">
            <span>💡</span>
            <span>
              {percentage < 25 && "Early bird special! Get yours now!"}
              {percentage >= 25 && percentage < 50 && "Sales are heating up! Don't miss out!"}
              {percentage >= 50 && percentage < 75 && "Over halfway sold! Limited supply remaining!"}
              {percentage >= 75 && percentage < 90 && "Almost sold out! Final chance!"}
              {percentage >= 90 && "FINAL UNITS! Selling out soon!"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 px-2 py-1 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer text-[11px] font-bold text-black hover:bg-[#d4d0c8] active:shadow-win98-inner transition-transform active:translate-y-px"
          >
            Mint Now
          </button>
          <button
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer text-[11px] text-black hover:bg-[#d4d0c8] active:shadow-win98-inner transition-transform active:translate-y-px"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}