'use client'

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { PoolInfo } from './types';

function formatNumber(value: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
}

const PoolInfoComponent = ({ data }: { data: PoolInfo }) => {
  return (
    <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer rounded-sm p-3 max-w-xs text-xs font-sans select-none">
      <div className="flex items-center mb-2">
        <div className="font-bold text-base text-[#222]">
          {data.token0_symbol}-{data.token1_symbol}
        </div>
        <div className="flex-1" />
        <Link
          href={`https://testnet.pharosscan.xyz/address/${data.pool}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-800 underline hover:text-blue-500"
        >
          {data.pool.slice(0, 6)}...{data.pool.slice(-4)}
        </Link>
      </div>
      <div className="border-t-2 border-[#808080] my-2" />
      <div className="flex justify-between mb-1">
        <span className="text-[#222]">{data.token0_symbol} Reserve</span>
        <span className="font-mono text-[#222]">{formatNumber(data.token0_reserve)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-[#222]">{data.token1_symbol} Reserve</span>
        <span className="font-mono text-[#222]">{formatNumber(data.token1_reserve)}</span>
      </div>
      <div className="flex justify-between mt-2 gap-2">
        <Link
          href={`https://testnet.pharosscan.xyz/address/${data.token0}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-800 underline hover:text-blue-500"
        >
          {data.token0_symbol}
        </Link>
        <Link
          href={`https://testnet.pharosscan.xyz/address/${data.token1}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-800 underline hover:text-blue-500"
        >
          {data.token1_symbol}
        </Link>
      </div>
    </div>
  );
};

export default PoolInfoComponent; 