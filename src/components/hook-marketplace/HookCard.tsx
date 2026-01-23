'use client'

import { Hook } from '@src/types/hook';
import { useState } from 'react';
import LikeIcon from '@assets/icons/LikeIcon';

interface HookCardProps {
  hook: Hook;
  onClick: () => void;
}

export const HookCard = ({ hook, onClick }: HookCardProps) => {
  const [isAddressHovered, setIsAddressHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'reward': '#c00000',
      'social': '#008080',
      'defi': '#c08000',
      'rwa': '#800080',
      'automation': '#008000',
      'security': '#000080'
    };
    return colors[category] || '#808080';
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://atlantic.pharosscan.xyz/address/${hook.address}`, '_blank');
  };

  return (
    <article
      className={`bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer cursor-pointer transition-all p-3 ${
        !isAddressHovered ? 'hover:border-dashed hover:border-[#000080]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <span
          onClick={handleAddressClick}
          onMouseEnter={() => setIsAddressHovered(true)}
          onMouseLeave={() => setIsAddressHovered(false)}
          className="text-xs font-mono text-white bg-[#000080] px-2 py-1 border border-black/20 hover:bg-[#0000a0] hover:underline cursor-pointer"
        >
          {shortenAddress(hook.address)}
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-bold px-2 py-1 text-white border border-black/20"
            style={{ backgroundColor: getCategoryColor(hook.category) }}
          >
            {hook.category.toUpperCase()}
          </span>
          <span className="text-xs font-bold px-2 py-1 bg-[#c00000] text-white border border-black/20 flex items-center gap-1">
            <LikeIcon width={14} height={14} color="white" />
            <span>{hook.reviewCount}</span>
          </span>
        </div>
      </div>

      <div className="bg-white/30 border-2 border-[#808080] shadow-win98-inner px-4 py-3 mb-3 h-[110px]">
        <h2 className="text-base font-bold text-[#000080] mb-2 truncate">
          {hook.name}
        </h2>
        <p className="text-sm text-black line-clamp-2 break-all leading-relaxed">
          {hook.description}
        </p>
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="font-mono text-black">
          {shortenAddress(hook.address)}
        </span>
        <span className="text-[#808080]">
          {formatTimeAgo(hook.createdAt)}
        </span>
      </div>
    </article>
  );
};
