"use client";

import React, { useState } from "react";

interface Win98AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const Win98Accordion: React.FC<Win98AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-[#c0c0c0] border-2 border-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] active:border-l-[#808080] active:border-t-[#808080] text-left flex items-center gap-2"
      >
        {/* Expand/Collapse Icon */}
        <span className="text-xs font-bold text-[#000080] w-3">
          {isExpanded ? "−" : "+"}
        </span>
        <span className="text-xs font-bold text-[#000080]">{title}</span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 border-t-2 border-[#808080]">
          {children}
        </div>
      )}
    </div>
  );
};
