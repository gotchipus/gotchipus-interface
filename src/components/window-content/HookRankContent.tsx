'use client'

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Hook, HookCategory, ViewMode, HookFilters } from '@src/types/hook';
import { hookApi } from '@src/services/hookApi';
import { HookCard } from '@src/components/hook-marketplace/HookCard';
import { HookDetail } from '@src/components/hook-marketplace/HookDetail';
import { HookSubmitForm } from '@src/components/hook-marketplace/HookSubmitForm';
import { useWindowMode } from '@/hooks/useWindowMode';
import { Win98Select } from '@src/components/ui/Win98Select';
import AddIcon from '@assets/icons/AddIcon';
import SearchIcon from '@assets/icons/SearchIcon';

const HOOK_REFRESH_INTERVAL = 30000;

const HookRankContent = () => {
  const { mode: windowMode, width: windowWidth } = useWindowMode();
  const isMobileMode = windowMode === 'mobile' || (windowWidth !== null && windowWidth <= 640);

  const getHookRankGridCols = (width: number | null): number => {
    if (!width) return 2;
    if (width <= 800) return 1;
    if (width <= 1100) return 2;
    if (width <= 1400) return 3;
    return 4;
  };

  const gridCols = getHookRankGridCols(windowWidth);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HookFilters>({
    category: 'all',
    searchQuery: '',
    sortBy: 'rating',
    onlyVerified: false,
    onlyAudited: false
  });

  useEffect(() => {
    if (!isMobileMode && showMobileFilters) {
      setShowMobileFilters(false);
    }
  }, [isMobileMode, showMobileFilters]);

  const loadHooks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await hookApi.loadAllHooks();
      setHooks(data);
    } catch (err) {
      console.error('Failed to load hooks:', err);
      if (showLoading) {
        setError('Failed to load hooks. Please try again later.');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadHooks(true);

    const refreshInterval = setInterval(() => {
      loadHooks(false);
    }, HOOK_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [loadHooks]);

  const categories: { value: HookCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'reward', label: 'Reward' },
    { value: 'social', label: 'Social' },
    { value: 'defi', label: 'Defi' },
    { value: 'rwa', label: 'RWA' },
    { value: 'automation', label: 'Automation' },
    { value: 'security', label: 'Security' }
  ];

  const filteredAndSortedHooks = useMemo(() => {
    let filtered = hooks.filter(hook => {
      if (filters.category !== 'all' && hook.category !== filters.category) {
        return false;
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = hook.name.toLowerCase().includes(query);
        const matchesDescription = hook.description.toLowerCase().includes(query);
        const matchesTags = hook.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      if (filters.onlyVerified && !hook.isVerified) {
        return false;
      }

      if (filters.onlyAudited && !hook.isAudited) {
        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [hooks, filters]);

  const handleHookClick = (hook: Hook) => {
    setSelectedHook(hook);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setSelectedHook(null);
    setViewMode('grid');
  };

  const handleHookSubmitted = async () => {
    try {
      await loadHooks(false);
      setShowSubmitForm(false);
    } catch (err) {
      console.error('Failed to refresh hooks:', err);
    }
  };

  if (viewMode === 'detail' && selectedHook) {
    return <HookDetail hook={selectedHook} onBack={handleBackToGrid} />;
  }

  return (
    <div className="bg-[#c0c0c0] h-full flex flex-col relative">
      {isMobileMode && (
        <div className="px-2 pt-4 pb-0">
          <div className="win98-group-box">
            <div className="win98-group-title text-xs font-bold text-[#000080]">
              HookRank
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[#808080] text-xs mt-1">
                Browse, rank, and discover programmable hooks for your Gotchipus
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="relative w-full border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] hover:bg-[#b0b0b0] active:shadow-win98-inner font-bold transition-all flex items-center gap-1.5 justify-center py-2 text-sm"
                >
                  <SearchIcon width={16} height={16} color="#000080" />
                  <span>Filters & Search</span>
                  {(filters.category !== 'all' || filters.searchQuery !== '' || filters.onlyVerified || filters.onlyAudited) && (
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
          <label className="text-xs font-bold block mb-2 text-[#000080]">Search Hooks</label>
          <div className="flex items-center border-2 border-[#808080] shadow-win98-inner bg-white">
            <div className="px-2">
              <SearchIcon width={14} height={14} color="#808080" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by name or tag..."
              className="flex-1 px-2 py-2 text-xs outline-none"
            />
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <label className="text-xs font-bold block mb-2 text-[#000080]">Category</label>
          <Win98Select
            options={categories}
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value as HookCategory | 'all' })}
          />
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <h3 className="text-xs font-bold mb-2 text-[#000080]">Filters</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyVerified}
                onChange={(e) => setFilters({ ...filters, onlyVerified: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="text-xs">Verified Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyAudited}
                onChange={(e) => setFilters({ ...filters, onlyAudited: e.target.checked })}
                className="w-3 h-3"
              />
              <span className="text-xs">Audited Only</span>
            </label>
          </div>
        </div>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
          <label className="text-xs font-bold block mb-2 text-[#000080]">Sort By</label>
          <Win98Select
            options={[
              { value: 'usage', label: 'Most Popular' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'recent', label: 'Recently Added' }
            ]}
            value={filters.sortBy}
            onChange={(value) => setFilters({ ...filters, sortBy: value as any })}
          />
        </div>

        <button
          onClick={() => setShowSubmitForm(true)}
          className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white hover:bg-[#006000] active:shadow-win98-inner px-4 py-2 text-xs font-bold flex items-center gap-2 justify-center rounded-none"
        >
          <AddIcon width={16} height={16} color="white" />
          <span>Submit Your Hook</span>
        </button>

        <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-inner p-2">
          <div className="text-xs text-[#808080] text-center">
            {filteredAndSortedHooks.length} hook{filteredAndSortedHooks.length !== 1 ? 's' : ''} found
          </div>
        </div>
          </div>
        )}

      <div className={`flex-1 bg-[#c0c0c0] overflow-auto scrollbar-none ${isMobileMode ? '' : ''}`}>
        <div className={isMobileMode ? 'p-2' : 'p-4'}>
          {!isMobileMode && (
            <div className="mb-4 px-1">
              <div className="win98-group-box bg-[#c0c0c0]">
                <div className="win98-group-title text-xs font-bold text-[#000080]">HookRank</div>
                <div className="text-xs text-[#808080] mt-1">
                  Browse, rank, and discover programmable hooks for your Gotchipus
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-[#808080] mb-2">Loading hooks...</p>
              <p className="text-xs text-[#808080]">Please wait while we fetch available hooks</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-[#ff0000] mb-2">Error</p>
              <p className="text-xs text-[#808080] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] hover:bg-[#c0c0c0] active:shadow-win98-inner px-4 py-2 text-xs font-bold rounded-none"
              >
                Retry
              </button>
            </div>
          ) : filteredAndSortedHooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-[#808080] mb-2">No hooks found</p>
              <p className="text-xs text-[#808080]">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${isMobileMode ? '' : 'px-1'}`}
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
              {filteredAndSortedHooks.map((hook) => (
                <HookCard key={hook.id} hook={hook} onClick={() => handleHookClick(hook)} />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {showSubmitForm && (
        <HookSubmitForm
          onClose={() => setShowSubmitForm(false)}
          onSuccess={handleHookSubmitted}
        />
      )}

      {showMobileFilters && (
        <>
          <div
            className="absolute inset-0 bg-black/50 z-[100] transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 z-[101] bg-[#c0c0c0] border-t-4 border-[#808080] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#000080] text-white px-4 py-3 flex items-center justify-between z-10">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <SearchIcon width={20} height={20} color="white" />
                <span>Filters & Search</span>
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="border-2 border-white bg-[#000060] hover:bg-[#000040] px-3 py-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="border-2 border-[#808080] shadow-win98-inner bg-white p-3 text-center">
                <span className="font-bold text-sm">Results: </span>
                <span className="text-[#000080] font-bold text-xl">{filteredAndSortedHooks.length}</span>
                <span className="font-bold text-sm"> hook{filteredAndSortedHooks.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
                <label className="text-xs font-bold block mb-2 text-[#000080]">Search Hooks</label>
                <div className="flex items-center border-2 border-[#808080] shadow-win98-inner bg-white">
                  <div className="px-2">
                    <SearchIcon width={14} height={14} color="#808080" />
                  </div>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="Search by name or tag..."
                    className="flex-1 px-2 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
                <label className="text-xs font-bold block mb-2 text-[#000080]">Category</label>
                <Win98Select
                  options={categories}
                  value={filters.category}
                  onChange={(value) => setFilters({ ...filters, category: value as HookCategory | 'all' })}
                />
              </div>

              <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
                <h3 className="text-xs font-bold mb-2 text-[#000080]">Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onlyVerified}
                      onChange={(e) => setFilters({ ...filters, onlyVerified: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <span className="text-xs">Verified Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onlyAudited}
                      onChange={(e) => setFilters({ ...filters, onlyAudited: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <span className="text-xs">Audited Only</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-win98-outer p-3">
                <label className="text-xs font-bold block mb-2 text-[#000080]">Sort By</label>
                <Win98Select
                  options={[
                    { value: 'usage', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'recent', label: 'Recently Added' }
                  ]}
                  value={filters.sortBy}
                  onChange={(value) => setFilters({ ...filters, sortBy: value as any })}
                />
              </div>

              <button
                onClick={() => {
                  setShowMobileFilters(false);
                  setShowSubmitForm(true);
                }}
                className="w-full border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white hover:bg-[#006000] active:shadow-win98-inner px-4 py-2 text-xs font-bold flex items-center gap-2 justify-center rounded-none"
              >
                <AddIcon width={16} height={16} color="white" />
                <span>Submit Your Hook</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      searchQuery: '',
                      sortBy: 'rating',
                      onlyVerified: false,
                      onlyAudited: false
                    });
                  }}
                  className="border-2 border-[#808080] shadow-win98-outer bg-[#c0c0c0] font-bold py-3 text-sm hover:bg-[#b0b0b0] active:shadow-win98-inner"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="border-2 border-[#808080] shadow-win98-outer bg-[#008000] text-white font-bold py-3 text-sm hover:bg-[#006000] active:shadow-win98-inner"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </>
      )}
    </div>
  );
};

export default HookRankContent;
