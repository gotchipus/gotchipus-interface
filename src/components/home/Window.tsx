"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Minus } from "lucide-react"
import type { WindowType } from "@/lib/types"
import { WINDOW_BG_COLOR } from "@/lib/constant"

interface WindowProps {
  window: WindowType
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  onMove: (position: { x: number; y: number }) => void
}

export default function Window({ window, isActive, onClose, onMinimize, onActivate, onMove }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAppearing, setIsAppearing] = useState(true)
  const windowRef = useRef<HTMLDivElement>(null)
  const titleBarRef = useRef<HTMLDivElement>(null)
  const hasInitializedRef = useRef(false) // 记录是否已经执行过初始化

  // 只在组件首次挂载时计算屏幕中心位置
  useEffect(() => {
    // 确保这段代码只执行一次
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      
      const screenWidth = globalThis.window.innerWidth || document.documentElement.clientWidth
      const screenHeight = globalThis.window.innerHeight || document.documentElement.clientHeight
      
      const centerX = Math.max(0, (screenWidth - window.size.width) / 2)
      const centerY = Math.max(0, (screenHeight - window.size.height) / 2)
      
      // 设置窗口位置
      onMove({ x: centerX, y: centerY })
      
      // 动画完成后设置 isAppearing 为 false
      const timeout = setTimeout(() => {
        setIsAppearing(false)
      }, 300)
      
      return () => clearTimeout(timeout)
    }
  }, []) // 空依赖数组，只在挂载时执行一次

  // 处理标题栏鼠标按下事件
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
  
  // 处理拖拽过程中的鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault() // 防止选择文本
        onMove({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    // 只有在拖拽状态下才添加事件监听
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      // 添加样式表明正在拖动
      if (windowRef.current) {
        windowRef.current.style.userSelect = 'none'
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      
      // 移除拖动样式
      if (windowRef.current) {
        windowRef.current.style.userSelect = ''
      }
    }
  }, [isDragging, dragOffset, onMove])

  return (
    <div
      ref={windowRef}
      className={`absolute border-2 border-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] bg-[#c0c0c0] overflow-hidden ${
        isAppearing ? "animate-window-appear origin-center" : ""
      }`}
      style={{
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex,
      }}
      onClick={onActivate}
    >
      {/* Title bar */}
      <div
        ref={titleBarRef}
        className={`h-5 flex items-center justify-between px-1 cursor-move ${
          isActive ? "bg-uni-bg-02 text-white" : "bg-[#808080] text-[#c0c0c0]"
        }`}
        onMouseDown={(e) => {
          // 检查是否点击了标题栏而非按钮
          const target = e.target as HTMLElement;
          const clickedOnButton = 
            target.tagName === 'BUTTON' || 
            target.closest('button') !== null;
          
          if (!clickedOnButton) {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
          }
        }}
      >
        <div className="text-sm font-bold truncate">{window.title}</div>
        <div className="flex">
          <button
            className="w-4 h-4 mr-1 flex items-center justify-center border border-[#808080] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff]"
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              onMinimize();
            }}
          >
            <Minus className="w-3 h-3 text-black" />
          </button>
          <button
            className="w-4 h-4 flex items-center justify-center border border-[#808080] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff]"
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              onClose();
            }}
          >
            <X className="w-3 h-3 text-black" />
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className={`bg-[${WINDOW_BG_COLOR[window.id as keyof typeof WINDOW_BG_COLOR]}] h-[calc(100%-20px)] overflow-auto p-2`}>{window.content}</div>
    </div>
  )
}