'use client'

import { useState, useEffect } from "react"
import useResponsive from "@/hooks/useResponsive"

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface CustomDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  showColorIndicator?: boolean;
}

export const CustomDropdown = ({
  label,
  options,
  selectedValue,
  onChange,
  showColorIndicator = false
}: CustomDropdownProps) => {
  const isMobile = useResponsive();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="mb-4 relative">
      <label className={`font-bold block mb-2 text-[#000000] ${isMobile ? 'text-sm' : 'text-sm'}`}>
        {label}:
      </label>
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`w-full border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] px-3 flex items-center justify-between hover:bg-[#b0b0b0] active:shadow-win98-inner
            ${isMobile ? 'py-1.5 text-sm' : 'py-2 text-base'}`}
        >
          <span className="flex items-center gap-2">
            {selectedOption.icon && <span>{selectedOption.icon}</span>}
            {showColorIndicator && selectedOption.color && (
              <span
                className="w-4 h-4 border border-[#808080] inline-block"
                style={{ backgroundColor: selectedOption.color }}
              ></span>
            )}
            <span>{selectedOption.label}</span>
          </span>
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] z-10 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-[#000080] hover:text-white
                  ${selectedValue === option.value ? 'bg-[#000080] text-white' : ''}
                  ${isMobile ? 'text-sm' : 'text-base'}`}
              >
                {option.icon && <span>{option.icon}</span>}
                {showColorIndicator && option.color && (
                  <span
                    className="w-4 h-4 border border-[#808080] inline-block"
                    style={{ backgroundColor: option.color }}
                  ></span>
                )}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
