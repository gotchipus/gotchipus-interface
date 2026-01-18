import { useMemo } from 'react';
import { GotchiMetadata } from '@/lib/types';

interface UseGotchiNavigationProps {
  metadata: GotchiMetadata;
  allMetadata: GotchiMetadata[];
  onNavigate?: (tokenId: number) => void;
}

export const useGotchiNavigation = ({ metadata, allMetadata, onNavigate }: UseGotchiNavigationProps) => {
  const currentIndex = useMemo(
    () => allMetadata.findIndex(m => m.token_id === metadata.token_id),
    [allMetadata, metadata.token_id]
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMetadata.length - 1;

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(allMetadata[currentIndex - 1].token_id);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(allMetadata[currentIndex + 1].token_id);
    }
  };

  const visibleThumbnails = useMemo(() => {
    const maxVisible = 8;
    const halfVisible = Math.floor(maxVisible / 2);

    let startIndex = Math.max(0, currentIndex - halfVisible);
    let endIndex = Math.min(allMetadata.length, startIndex + maxVisible);

    if (endIndex - startIndex < maxVisible) {
      startIndex = Math.max(0, endIndex - maxVisible);
    }

    return allMetadata.slice(startIndex, endIndex);
  }, [allMetadata, currentIndex]);

  return {
    currentIndex,
    hasPrev,
    hasNext,
    handlePrev,
    handleNext,
    visibleThumbnails,
  };
};
