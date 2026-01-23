'use client'

import { useState, useRef, useEffect } from 'react';

interface Win98SelectOption {
  value: string;
  label: string;
}

interface Win98SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Win98SelectOption[];
  placeholder?: string;
}

export const Win98Select = ({ value, onChange, options, placeholder }: Win98SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border-2 border-[#808080] shadow-win98-outer bg-white px-2 py-1 text-sm text-left flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-black' : 'text-[#808080]'}>
          {selectedOption ? selectedOption.label : (placeholder || 'Select...')}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 border-2 border-[#808080] shadow-win98-outer bg-white z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-2 py-1.5 text-sm text-left hover:bg-[#000080] hover:text-white ${
                value === option.value ? 'bg-[#000080] text-white' : 'text-black'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
