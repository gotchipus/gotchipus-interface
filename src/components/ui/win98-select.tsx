"use client";

import React, { useState, useRef, useEffect } from "react";

interface Win98SelectOption {
  value: string;
  label: string;
}

interface Win98SelectProps {
  options: Win98SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Win98Select: React.FC<Win98SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs text-left flex items-center justify-between"
      >
        <span className={selectedOption ? "text-black" : "text-[#808080]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-[#808080] ml-2">▼</span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-[#808080] shadow-win98-outer max-h-48 overflow-y-auto scrollbar-thin">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-2 py-1 text-xs cursor-pointer hover:bg-[#000080] hover:text-white ${
                option.value === value ? "bg-[#000080] text-white" : "text-black"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
