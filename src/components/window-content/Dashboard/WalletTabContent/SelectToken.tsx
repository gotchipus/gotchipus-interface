'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { cn } from "@/lib/utils";
import DrawTokenIcon from './DrawTokenIcon';
import Image from 'next/image';
import SearchInput from './SearchInput';
import { Token } from '@/lib/types';
import { X } from 'lucide-react';

interface SelectTokenProps {
  onAction: (token: Token | null) => void;
  tokens: Token[];
  popularTokens: string[];
  nativeBalance: string;
}

export const SelectToken: React.FC<SelectTokenProps> = observer(({ onAction, tokens, popularTokens, nativeBalance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const sortedTokens = useMemo(() => {
    return [...tokens]
      .filter(token => token.name.toString() !== "unknown")
      .sort((a, b) => {
        const balanceA = parseFloat(a.balance || '0');
        const balanceB = parseFloat(b.balance || '0');
        if (balanceA > 0 && balanceB === 0) return -1;
        if (balanceA === 0 && balanceB > 0) return 1;
        return balanceB - balanceA;
      });
  }, [tokens]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const debounceTimer = setTimeout(() => {
      const fetchSearchedTokens = async () => {
        try {
          const response = await fetch('/api/tokens/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: searchTerm }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          if (result.code === 0 && result.data) {
            setSearchResults(result.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Failed to fetch tokens:", error);
          setSearchResults([]); 
        } finally {
          setIsSearching(false);
        }
      };

      fetchSearchedTokens();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);


  const handleTokenSelect = (token: Token) => {
    onAction(token);
  };

  const renderTokenIcon = (token: Token) => {
    if (token.icon) {
      return (
        <div className="w-8 h-8 mr-3 border-2 border-[#808080] shadow-win98-inner bg-white flex items-center justify-center">
          <Image
            src={token.icon}
            alt={token.name}
            width={24}
            height={24}
            className="rounded-none"
            unoptimized
          />
        </div>
      );
    } else {
      return (
        <DrawTokenIcon tokenName={token.name} className="w-8 h-8 mr-3" />
      );
    }
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      // loadMoreAssets();
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  const renderTokenList = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center h-full pb-36">
          <p className="text-sm text-[#000080] font-medium">Searching...</p>
        </div>
      );
    }
    
    const tokensToRender = searchTerm.trim() !== '' ? searchResults : sortedTokens;

    if (tokensToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full pb-36">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-sm text-[#000080] font-medium">No tokens found</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {tokensToRender.map((token) => (
          <div
            key={`${token.symbol}-${token.contract}`}
            className="flex items-center justify-between p-2 hover:bg-[#000080] hover:text-white rounded-none cursor-pointer transition-colors duration-200"
            onClick={() => handleTokenSelect(token)}
          >
            <div className="flex items-center">
              {renderTokenIcon(token)}
              <div className="group hover:text-white">
                <div className='text-sm font-medium'>{token.name}</div>
                <div className="text-xs text-gray-600 group-hover:text-white">
                  {token.symbol || token.contract.slice(0, 10) + '...'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {token.contract === "0x0000000000000000000000000000000000000000" 
                    ? nativeBalance 
                    : token.balance && parseFloat(token.balance) > 0 ? parseFloat(token.balance).toFixed(4) : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full p-4 bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-[#000080]">Select a token</span>
        <button
          onClick={() => onAction(null)}
          className="w-8 h-8 border-2 border-[#808080] bg-[#d4d0c8] hover:bg-[#c0c0c0] shadow-win98-outer flex items-center justify-center text-[#000080] font-bold transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mb-4">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="flex flex-wrap gap-2 pb-4 border-b-2 border-[#808080] mb-4">
        {popularTokens.map((symbol) => {
          const token = tokens.find((t) => t.symbol === symbol);
          return (
            token && (
              <button
                key={symbol}
                className="bg-white hover:bg-[#000080] hover:text-white border-2 border-[#808080] shadow-win98-outer py-1 px-3 text-sm flex items-center justify-center transition-colors"
                onClick={() => handleTokenSelect(token)}
              >
                <div className="w-4 h-4 mr-2 border border-[#808080] bg-white flex items-center justify-center">
                  {token.icon ? (
                    <Image
                      src={token.icon}
                      alt={token.symbol}
                      width={12}
                      height={12}
                      unoptimized
                    />
                  ) : (
                    <DrawTokenIcon tokenName={token.name} className="w-4 h-4" />
                  )}
                </div>
                {token.symbol}
              </button>
            )
          );
        })}
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto pr-2 bg-white border-2 border-[#808080] shadow-win98-inner",
        "h-96"
      )}>
        {renderTokenList()}
      </div>
    </div>
  );
});