'use client'

import React, { useEffect, useState } from 'react'

interface Win98LoadingProps {
  className?: string
  text?: string
}

export const Win98Loading = ({ className = '', text = 'Loading...' }: Win98LoadingProps) => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          return 95 + Math.random() * 2 
        }
        return prevProgress + Math.random() * 5 
      })
    }, 200)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full h-4 border border-[#808080] shadow-win98-outer bg-[#d4d0c8] overflow-hidden">
        <div 
          className="h-full bg-[#000080] transition-all duration-200 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      <p className="text-xs mt-1 text-black">{text}</p>
    </div>
  )
} 