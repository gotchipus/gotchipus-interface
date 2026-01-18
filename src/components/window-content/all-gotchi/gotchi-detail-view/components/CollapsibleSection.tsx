"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  defaultOpen = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 flex flex-col rounded-lg bg-[#d4d0c8]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full flex-row justify-between px-4 py-2 border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#d4d0c8] active:shadow-win98-inner"
      >
        <div className="flex items-center">
          {icon && (
            <Image src={icon} alt={title} width={18} height={18} className="mr-2" />
          )}
          <h5 className="text-sm font-bold text-[#000080] uppercase">{title}</h5>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#000080]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-2 border-t-0 border-[#808080] shadow-win98-inner bg-[#c0c0c0]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
