"use client";

import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import FramePet from "./FramePet";

interface DesktopPetProps {
  initialX?: number;
  initialY?: number;
}

export default function DesktopPet({ initialX = 100, initialY = 100 }: DesktopPetProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const petRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = petRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        if (petRef.current) {
          const petWidth = petRef.current.offsetWidth;
          const petHeight = petRef.current.offsetHeight;
          newX = Math.max(0, Math.min(windowSize.width - petWidth, newX));
          newY = Math.max(0, Math.min(windowSize.height - petHeight - 28, newY));
        }

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, windowSize]);

  return (
    <div
      ref={petRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <FramePet initialX={0} initialY={0} />
    </div>
  );
}