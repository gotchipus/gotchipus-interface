"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, Minus } from "lucide-react"
import type { WindowType } from "@/lib/types"
import { WINDOW_BG_COLOR, WINDOW_BREAKPOINTS, WINDOW_MAX_CONTENT_WIDTH } from "@/lib/constant"
import ResizeHandleIcon from "@assets/icons/ResizeHandleIcon"

interface WindowProps {
  window: WindowType
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  onMove: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }, position?: { x: number; y: number }) => void
  isMobile?: boolean
}

export default function Window({ window, isActive, onClose, onMinimize, onActivate, onMove, onResize, isMobile = false }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>("")
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 })
  const [isAppearing, setIsAppearing] = useState(true)
  const windowRef = useRef<HTMLDivElement>(null)
  const titleBarRef = useRef<HTMLDivElement>(null)

  const MIN_WIDTH = 300
  const MIN_HEIGHT = 200

  const isMobileMode = window.size.width <= WINDOW_BREAKPOINTS.MOBILE
  const maxContentWidth = WINDOW_MAX_CONTENT_WIDTH[window.id] || WINDOW_MAX_CONTENT_WIDTH.default
  const isWiderThanMax = window.size.width > maxContentWidth

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAppearing(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, []) 

  const startDrag = (clientX: number, clientY: number) => {
    if (windowRef.current) {
      onActivate()
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      })
      setIsDragging(true)
    }
  }
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault() 
        onMove({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && isMobile) {
        e.preventDefault()
        const touch = e.touches[0]
        onMove({
          x: touch.clientX - dragOffset.x,
          y: touch.clientY - dragOffset.y
        })
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      if (isMobile) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd)
      } else {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }
      
      if (windowRef.current) {
        windowRef.current.style.userSelect = 'none'
      }
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      } else {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      if (windowRef.current) {
        windowRef.current.style.userSelect = ''
      }
    }
  }, [isDragging, dragOffset, onMove, isMobile])

  const startResize = (direction: string, clientX: number, clientY: number) => {
    onActivate()
    setResizeDirection(direction)
    setResizeStart({
      x: clientX,
      y: clientY,
      width: window.size.width,
      height: window.size.height,
      windowX: window.position.x,
      windowY: window.position.y
    })
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        e.preventDefault()

        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        const maxWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth - 20 : 1600
        const maxHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight - 80 : 1200

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.windowX
        let newY = resizeStart.windowY

        if (resizeDirection.includes('right')) {
          const potentialWidth = resizeStart.width + deltaX
          newWidth = Math.min(Math.max(MIN_WIDTH, potentialWidth), maxWidth - newX)
        }
        if (resizeDirection.includes('left')) {
          const potentialWidth = resizeStart.width - deltaX
          newWidth = Math.max(MIN_WIDTH, Math.min(potentialWidth, resizeStart.windowX + resizeStart.width - 10))
          if (newWidth > MIN_WIDTH && potentialWidth >= MIN_WIDTH) {
            newX = Math.max(10, resizeStart.windowX + deltaX)
          }
        }
        if (resizeDirection.includes('bottom')) {
          const potentialHeight = resizeStart.height + deltaY
          newHeight = Math.min(Math.max(MIN_HEIGHT, potentialHeight), maxHeight - newY)
        }
        if (resizeDirection.includes('top')) {
          const potentialHeight = resizeStart.height - deltaY
          newHeight = Math.max(MIN_HEIGHT, Math.min(potentialHeight, resizeStart.windowY + resizeStart.height - 40))
          if (newHeight > MIN_HEIGHT && potentialHeight >= MIN_HEIGHT) {
            newY = Math.max(20, resizeStart.windowY + deltaY)
          }
        }

        if (newWidth !== window.size.width || newHeight !== window.size.height || newX !== window.position.x || newY !== window.position.y) {
          onResize(
            { width: newWidth, height: newHeight },
            (newX !== resizeStart.windowX || newY !== resizeStart.windowY)
              ? { x: newX, y: newY }
              : undefined
          )
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection("")
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isResizing && isMobile) {
        e.preventDefault()
        const touch = e.touches[0]

        const deltaX = touch.clientX - resizeStart.x
        const deltaY = touch.clientY - resizeStart.y

        const maxWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth - 20 : 1600
        const maxHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight - 80 : 1200

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.windowX
        let newY = resizeStart.windowY

        if (resizeDirection.includes('right')) {
          const potentialWidth = resizeStart.width + deltaX
          newWidth = Math.min(Math.max(MIN_WIDTH, potentialWidth), maxWidth - newX)
        }
        if (resizeDirection.includes('left')) {
          const potentialWidth = resizeStart.width - deltaX
          newWidth = Math.max(MIN_WIDTH, Math.min(potentialWidth, resizeStart.windowX + resizeStart.width - 10))
          if (newWidth > MIN_WIDTH && potentialWidth >= MIN_WIDTH) {
            newX = Math.max(10, resizeStart.windowX + deltaX)
          }
        }
        if (resizeDirection.includes('bottom')) {
          const potentialHeight = resizeStart.height + deltaY
          newHeight = Math.min(Math.max(MIN_HEIGHT, potentialHeight), maxHeight - newY)
        }
        if (resizeDirection.includes('top')) {
          const potentialHeight = resizeStart.height - deltaY
          newHeight = Math.max(MIN_HEIGHT, Math.min(potentialHeight, resizeStart.windowY + resizeStart.height - 40))
          if (newHeight > MIN_HEIGHT && potentialHeight >= MIN_HEIGHT) {
            newY = Math.max(20, resizeStart.windowY + deltaY)
          }
        }

        if (newWidth !== window.size.width || newHeight !== window.size.height || newX !== window.position.x || newY !== window.position.y) {
          onResize(
            { width: newWidth, height: newHeight },
            (newX !== resizeStart.windowX || newY !== resizeStart.windowY)
              ? { x: newX, y: newY }
              : undefined
          )
        }
      }
    }

    const handleTouchEnd = () => {
      setIsResizing(false)
      setResizeDirection("")
    }

    if (isResizing) {
      if (isMobile) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false })
        document.addEventListener('touchend', handleTouchEnd)
      } else {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      }

      if (windowRef.current) {
        windowRef.current.style.userSelect = 'none'
      }
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      } else {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      if (windowRef.current) {
        windowRef.current.style.userSelect = ''
      }
    }
  }, [isResizing, resizeDirection, resizeStart, onResize, isMobile, MIN_WIDTH, MIN_HEIGHT])

  const handleTitleBarInteraction = (clientX: number, clientY: number, event: React.MouseEvent | React.TouchEvent) => {
    const target = event.target as HTMLElement;
    const clickedOnButton =
      target?.tagName === 'BUTTON' ||
      target?.closest('button') !== null;

    if (!clickedOnButton) {
      event.preventDefault();
      startDrag(clientX, clientY);
    }
  }

  return (
    <div
      ref={windowRef}
      className={`absolute border-2 border-[#c0c0c0] shadow-win98-outer bg-[#c0c0c0] overflow-hidden ${
        isAppearing ? "animate-window-appear origin-center" : ""
      } ${isMobile ? 'touch-manipulation' : ''}`}
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex,
      }}
      onClick={onActivate}
    >
      <div
        ref={titleBarRef}
        className={`h-7 flex items-center justify-between pl-3 pr-1.5 cursor-move ${
          isActive ? "bg-uni-bg-02 text-white" : "bg-[#808080] text-[#c0c0c0]"
        }`}
        onMouseDown={(e) => handleTitleBarInteraction(e.clientX, e.clientY, e)}
        onTouchStart={(e) => {
          const touch = e.touches[0]
          handleTitleBarInteraction(touch.clientX, touch.clientY, e)
        }}
      >
        <div className="flex items-center gap-2 truncate">
          {window.icon && (
            <Image
              src={window.icon}
              alt=""
              width={20}
              height={20}
              className="flex-shrink-0"
            />
          )}
          <div className="text-base font-bold truncate">{window.title}</div>
        </div>
        <div className="flex gap-1.5">
          <button
            className="flex items-center justify-center border-2 border-[#dfdfdf] border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] hover:bg-[#d4d0c8] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:bg-[#b0b0b0] w-[18px] h-[18px] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
          >
            <Minus className="text-black w-2.5 h-2.5 stroke-[2.5]" />
          </button>
          <button
            className="flex items-center justify-center border-2 border-[#dfdfdf] border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] hover:bg-[#d4d0c8] active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white active:bg-[#b0b0b0] w-[18px] h-[18px] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="text-black w-2.5 h-2.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div
        className={`scrollbar-hide bg-[${WINDOW_BG_COLOR[window.id as keyof typeof WINDOW_BG_COLOR]}] h-[calc(100%-28px)] overflow-auto`}
        data-window-mode={isMobileMode ? 'mobile' : 'desktop'}
        data-window-width={window.size.width}
      >
        <div
          className={`h-full p-2 transition-all ${isWiderThanMax ? 'mx-auto' : ''}`}
          style={{
            maxWidth: isWiderThanMax ? `${maxContentWidth}px` : '100%',
            minWidth: isMobileMode ? '100%' : 'auto'
          }}
        >
          {window.content}
        </div>
      </div>

      {!isMobile && (
        <>
          {/* Top */}
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:h-1.5 hover:bg-blue-400/20 transition-all"
            style={{ top: '-2px', height: '6px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('top', e.clientX, e.clientY)
            }}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize hover:w-1.5 hover:bg-blue-400/20 transition-all"
            style={{ right: '-2px', width: '6px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('right', e.clientX, e.clientY)
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:h-1.5 hover:bg-blue-400/20 transition-all"
            style={{ bottom: '-2px', height: '6px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('bottom', e.clientX, e.clientY)
            }}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize hover:w-1.5 hover:bg-blue-400/20 transition-all"
            style={{ left: '-2px', width: '6px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('left', e.clientX, e.clientY)
            }}
          />
          <div
            className="absolute cursor-ew-resize hover:bg-blue-400/30 transition-all z-10 group"
            style={{ top: '-2px', left: '-2px', width: '12px', height: '12px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('left', e.clientX, e.clientY)
            }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-[#808080] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div
            className="absolute cursor-ew-resize hover:bg-blue-400/30 transition-all z-10 group"
            style={{ top: '-2px', right: '-2px', width: '12px', height: '12px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('right', e.clientX, e.clientY)
            }}
          >
            <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-[#808080] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div
            className="absolute cursor-nesw-resize hover:bg-blue-400/30 transition-all z-10 group"
            style={{ bottom: '-2px', left: '-2px', width: '12px', height: '12px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('bottom-left', e.clientX, e.clientY)
            }}
          >
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#808080] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div
            className="absolute cursor-nwse-resize hover:bg-blue-400/30 transition-all z-10 group"
            style={{ bottom: '-2px', right: '-2px', width: '12px', height: '12px' }}
            onMouseDown={(e) => {
              e.stopPropagation()
              startResize('bottom-right', e.clientX, e.clientY)
            }}
          >
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#808080] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </>
      )}

      {isMobile && (
        <div
          className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-10 flex items-end justify-end touch-manipulation"
          onTouchStart={(e) => {
            e.stopPropagation()
            const touch = e.touches[0]
            startResize('bottom-right', touch.clientX, touch.clientY)
          }}
        >
          <div className="w-5 h-5 flex items-end justify-end">
            <ResizeHandleIcon className="text-[#808080]" />
          </div>
        </div>
      )}
    </div>
  )
}