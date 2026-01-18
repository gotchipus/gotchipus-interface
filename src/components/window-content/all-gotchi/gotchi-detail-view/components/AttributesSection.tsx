"use client";

import React from "react";
import Image from "next/image";

interface Attribute {
  name: string;
  value: number;
  icon: string;
}

interface AttributesSectionProps {
  attributes: Attribute[];
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({ attributes }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src="/icons/attribute.png" alt="Attributes" width={18} height={18} />
        <h5 className="text-sm font-bold text-[#000080] uppercase">Attributes</h5>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {attributes.map((attr, index) => (
          <div key={index} className="bg-[#d4d0c8] border border-[#808080] shadow-win98-inner rounded-sm p-2">
            <div className="flex items-center gap-1 mb-1">
              <Image src={`/icons/${attr.icon}.png`} alt={attr.name} width={14} height={14} />
              <span className="text-xs text-[#808080] uppercase">{attr.name}</span>
            </div>
            <div className="text-lg font-bold text-[#000080]">{attr.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
