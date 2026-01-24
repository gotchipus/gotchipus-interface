"use client";

import React from "react";
import CheckmarkIcon from "@assets/icons/CheckmarkIcon";

interface Win98CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export const Win98Checkbox: React.FC<Win98CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = "",
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer hover:bg-white/30 p-1 ${className}`}>
      <div
        onClick={() => onChange(!checked)}
        className="w-4 h-4 bg-white border-2 border-[#808080] shadow-win98-inner flex items-center justify-center cursor-pointer"
      >
        {checked && (
          <CheckmarkIcon color="#000000" />
        )}
      </div>
      <span className="text-xs select-none">{label}</span>
    </label>
  );
};
