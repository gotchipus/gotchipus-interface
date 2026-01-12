"use client";

import React from "react";

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
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L4 8L9 2"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-xs select-none">{label}</span>
    </label>
  );
};
