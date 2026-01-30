"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Win98Loading } from "@/components/ui/win98-loading";
import { Win98Select } from "@/components/ui/win98-select";
import { Win98Checkbox } from "@/components/ui/win98-checkbox";
import GotchiCard from "./all-gotchi/GotchiCard";
import GotchiDetailView from "./all-gotchi/gotchi-detail-view";
import { MobileFilterMenu } from "./all-gotchi/MobileFilterMenu";
import { GotchiMetadata } from "@/lib/types";
import useSWR from "swr";
import { useWindowMode, getGridColumns } from "@/hooks/useWindowMode";

interface AllGotchiContentProps {
  isMobile?: boolean;
}

const TOTAL_NFTS = 20000;
const ITEMS_PER_PAGE = 30;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AllGotchiContent = observer(({ isMobile }: AllGotchiContentProps) => {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [offset, setOffset] = useState(0);
  const [allMetadata, setAllMetadata] = useState<GotchiMetadata[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

  const { mode: windowMode, width: windowWidth } = useWindowMode()
  const isMobileMode = windowMode === 'mobile' || (windowWidth !== null && windowWidth <= 640)
  const gridCols = Math.min(getGridColumns(windowWidth), 5) // Max 5 columns for all-gotchi grid

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string>("");
  const [levelRange, setLevelRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [selectedCommunityFeatures, setSelectedCommunityFeatures] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>("token_id");

  const observerTarget = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevFiltersRef = useRef<string>("");

  const buildApiUrl = () => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: ITEMS_PER_PAGE.toString(),
    });

    if (selectedRarity) params.append('rarity', selectedRarity);
    if (levelRange.min) params.append('min_level', levelRange.min);
    if (levelRange.max) params.append('max_level', levelRange.max);
    if (sortBy) params.append('sort_by', sortBy);

    return `/api/gotchi-metadata?${params.toString()}`;
  };

  const { data, isLoading, error, mutate } = useSWR(
    buildApiUrl(),
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!isMobileMode && showMobileFilters) {
      setShowMobileFilters(false);
    }
  }, [isMobileMode, showMobileFilters]);

  useEffect(() => {
    const currentFilters = `${selectedRarity}-${levelRange.min}-${levelRange.max}-${Array.from(selectedCommunityFeatures).join(',')}-${sortBy}`;

    if (prevFiltersRef.current && prevFiltersRef.current !== currentFilters) {
      setAllMetadata([]);
      setOffset(0);
      setHasMore(true);
    }

    prevFiltersRef.current = currentFilters;
  }, [selectedRarity, levelRange, selectedCommunityFeatures, sortBy]);

  useEffect(() => {
    console.log('Data effect triggered', { hasData: !!data?.data, dataLength: data?.data?.length, offset });
    if (data?.data) {
      setAllMetadata((prev) => {
        if (offset === 0) {
          console.log('Replacing data (offset=0), received', data.data.length, 'items');
          if (data.data.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          return data.data;
        }

        const newItems = data.data.filter(
          (item: GotchiMetadata) => !prev.some((p) => p.id === item.id)
        );
        const updated = [...prev, ...newItems];
        console.log('Appending data, prev:', prev.length, 'new:', newItems.length, 'total:', updated.length);

        if (data.data.length < ITEMS_PER_PAGE || updated.length >= TOTAL_NFTS) {
          console.log('No more items, setting hasMore to false');
          setHasMore(false);
        }

        return updated;
      });
    }
  }, [data, offset]);

  const loadMoreItems = useCallback(() => {
    console.log('loadMoreItems called', { isLoading, hasMore });
    if (isLoading || !hasMore) return;
    setOffset((prev) => {
      console.log('Setting offset from', prev, 'to', prev + ITEMS_PER_PAGE);
      return prev + ITEMS_PER_PAGE;
    });
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    const currentTarget = observerTarget.current;

    if (!currentTarget || !scrollContainer) {
      console.log('Observer not ready', { hasTarget: !!currentTarget, hasContainer: !!scrollContainer });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('IntersectionObserver triggered', {
          isIntersecting: entries[0]?.isIntersecting,
          hasMore,
          isLoading,
        });
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    console.log('Observer attached to target');
    observer.observe(currentTarget);

    return () => {
      observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading, loadMoreItems, allMetadata.length]);

  const handleSearch = async () => {
    const tokenId = parseInt(searchId);
    if (!isNaN(tokenId) && tokenId >= 0 && tokenId < TOTAL_NFTS) {
      setIsSearching(true);
      const startTime = Date.now();
      try {
        const response = await fetch(`/api/gotchi-metadata?token_id=${tokenId}`);
        const result = await response.json();

        const endTime = Date.now();
        console.log(`Search took ${endTime - startTime}ms`);

        if (result.data && result.data.length > 0) {
          setAllMetadata(result.data);
          setOffset(0);
          setHasMore(false);
        } else {
          console.warn('No data returned for token ID:', tokenId);
          setAllMetadata([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setAllMetadata([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setIsSearching(false);
    setOffset(0);
    setHasMore(true);
    mutate();
  };

  const handleResetFilters = () => {
    setSelectedRarity("");
    setLevelRange({ min: "", max: "" });
    setSelectedCommunityFeatures(new Set());
    setSortBy("token_id");
    setSearchId("");
  };

  const toggleCommunityFeature = (feature: string) => {
    const newFeatures = new Set(selectedCommunityFeatures);
    if (newFeatures.has(feature)) {
      newFeatures.delete(feature);
    } else {
      newFeatures.add(feature);
    }
    setSelectedCommunityFeatures(newFeatures);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCardClick = (metadata: GotchiMetadata) => {
    setSelectedTokenId(metadata.token_id);
  };

  const handleCloseDetail = () => {
    setSelectedTokenId(null);
  };

  const handleNavigateDetail = (tokenId: number) => {
    setSelectedTokenId(tokenId);
  };

  const selectedMetadata = selectedTokenId !== null
    ? allMetadata.find(m => m.token_id === selectedTokenId)
    : null;

  return (
    <div className="bg-[#c0c0c0] h-full flex flex-col relative">
      {isMobileMode && (
        <div className="px-2 pt-4 pb-0">
          <div className="win98-group-box">
            <div className="win98-group-title text-xs font-bold text-[#000080]">
              🎮 All Gotchipus
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#808080] text-xs mt-1">
                Browse all 20,000 Gotchipus NFTs
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="relative w-full border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#b0b0b0] active:shadow-win98-inner font-bold transition-all flex items-center gap-1.5 justify-center py-2 text-sm"
                >
                  <span>🔍</span>
                  <span>Filters & Search</span>
                  {(selectedRarity !== '' || levelRange.min !== '' || levelRange.max !== '' || selectedCommunityFeatures.size > 0 || searchId !== '') && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex gap-4 flex-1 overflow-hidden ${isMobileMode ? 'flex-col' : 'p-4'}`}>
        {!isMobileMode && (
          <div className="w-64 flex-shrink-0 flex flex-col gap-3 overflow-y-auto scrollbar-none">
        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <label className="text-xs font-bold block mb-2 text-[#000080]">Search by ID</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Token ID (0-19999)"
            disabled={isSearching}
            className="w-full bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-2 text-xs outline-none disabled:opacity-50"
          />
          {isSearching && (
            <div className="mt-2 text-xs text-[#000080] text-center">
              Searching...
            </div>
          )}
          {searchId && !isSearching && (
            <button
              onClick={handleClearSearch}
              className="mt-2 w-full px-3 py-1 bg-[#c0c0c0] border-2 border-white border-r-[#808080] border-b-[#808080] active:border-r-white active:border-b-white active:border-l-[#808080] active:border-t-[#808080] text-xs"
            >
              Clear Search
            </button>
          )}
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#000080]">Filters</h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#808080] hover:text-[#000080] underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-2 text-[#000080]">Rarity</label>
              <Win98Select
                options={[
                  { value: "", label: "All Rarities" },
                  { value: "0", label: "Common" },
                  { value: "1", label: "Rare" },
                  { value: "2", label: "Epic" },
                  { value: "3", label: "Legendary" },
                ]}
                value={selectedRarity}
                onChange={setSelectedRarity}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-2 text-[#000080]">Level Range</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={levelRange.min}
                  onChange={(e) => setLevelRange({ ...levelRange, min: e.target.value })}
                  placeholder="Min"
                  min="1"
                  max="100"
                  className="flex-1 bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs"
                />
                <span className="text-xs text-[#808080]">-</span>
                <input
                  type="number"
                  value={levelRange.max}
                  onChange={(e) => setLevelRange({ ...levelRange, max: e.target.value })}
                  placeholder="Max"
                  min="1"
                  max="100"
                  className="flex-1 bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-2 text-[#000080]">Community Features</label>
              <div className="space-y-1">
                <Win98Checkbox
                  checked={selectedCommunityFeatures.has('pet')}
                  onChange={() => toggleCommunityFeature('pet')}
                  label="Public Pet Enabled"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <label className="text-xs font-bold block mb-2 text-[#000080]">Sort By</label>
          <Win98Select
            options={[
              { value: "token_id", label: "Token ID" },
              { value: "core_level", label: "Level (High to Low)" },
              { value: "leveling_total_exp", label: "Total EXP (High to Low)" },
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner p-2">
          <div className="text-xs text-[#808080] text-center">
            Showing {allMetadata.length} of {TOTAL_NFTS.toLocaleString()}
          </div>
        </div>
          </div>
        )}

      <div ref={scrollContainerRef} className={`flex-1 bg-[#c0c0c0] overflow-auto scrollbar-none ${isMobileMode ? '' : ''}`}>
        <div className={isMobileMode ? 'p-2' : 'p-4'}>
          {!isMobileMode && (
            <div className="mb-2 px-1 mt-2">
              <div className="win98-group-box">
                <div className="win98-group-title text-xs font-bold text-[#000080]">All Gotchipus Collection</div>
                <div className="text-xs text-[#808080] mt-1">
                  Browse all {TOTAL_NFTS.toLocaleString()} Gotchipus NFTs
                </div>
              </div>
            </div>
          )}

          {error ? (
            <div className="text-center border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] py-16">
              <p className="font-bold text-[#cc0000] text-lg mb-2">⚠️ Service Unavailable</p>
              <p className="text-[#808080] text-sm mb-1">Please ensure the service is running</p>
            </div>
          ) : isLoading && allMetadata.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Win98Loading text="Loading Gotchipus..." />
            </div>
          ) : allMetadata.length === 0 ? (
            <div className="text-center border-2 border-[#808080] shadow-win98-inner bg-[#d4d0c8] py-16">
              <p className="font-bold text-[#808080] text-lg mb-2">No NFTs found</p>
              <p className="text-[#808080] text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
              {allMetadata.map((metadata) => (
                <GotchiCard key={metadata.id} metadata={metadata} onClick={handleCardClick} />
              ))}
            </div>
          )}

          {hasMore && allMetadata.length > 0 && (
            <div
              ref={observerTarget}
              className="flex justify-center items-center p-4 mt-4"
            >
              {isLoading ? (
                <div className="text-center bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-4">
                  <Win98Loading text="Loading..." />
                  <p className="mt-2 text-xs">Loading more Gotchipus...</p>
                </div>
              ) : (
                <div className="h-8"></div>
              )}
            </div>
          )}

          {!hasMore && allMetadata.length >= TOTAL_NFTS && (
            <div className="text-center py-8 text-xs text-[#808080]">
              🎉 You've reached the end of the collection!
            </div>
          )}
        </div>
      </div>
      </div>

      {selectedMetadata && (
        <GotchiDetailView
          metadata={selectedMetadata}
          allMetadata={allMetadata}
          onClose={handleCloseDetail}
          onNavigate={handleNavigateDetail}
        />
      )}

      {/* Mobile Filter Menu */}
      <MobileFilterMenu
        isOpen={showMobileFilters}
        searchId={searchId}
        isSearching={isSearching}
        selectedRarity={selectedRarity}
        levelRange={levelRange}
        selectedCommunityFeatures={selectedCommunityFeatures}
        sortBy={sortBy}
        onSearchIdChange={setSearchId}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onRarityChange={setSelectedRarity}
        onLevelRangeChange={setLevelRange}
        onToggleCommunityFeature={toggleCommunityFeature}
        onSortByChange={setSortBy}
        onResetFilters={handleResetFilters}
        onClose={() => setShowMobileFilters(false)}
        resultCount={allMetadata.length}
      />
    </div>
  );
});

AllGotchiContent.displayName = "AllGotchiContent";

export default AllGotchiContent;
