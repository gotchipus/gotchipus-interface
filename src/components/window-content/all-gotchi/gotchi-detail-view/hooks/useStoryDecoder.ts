import { useMemo } from 'react';
import { ethers } from 'ethers';

export const useStoryDecoder = (story: string | undefined) => {
  const decodedStory = useMemo(() => {
    if (!story) return '';

    try {
      if (typeof story === 'string') {
        const storyTrimmed = story.trim();

        if (storyTrimmed.startsWith('\\x')) {
          const hexWithPrefix = '0x' + storyTrimmed.slice(2);
          const decoded = ethers.toUtf8String(hexWithPrefix);
          return decoded;
        }

        if (storyTrimmed.startsWith('0x')) {
          const decoded = ethers.toUtf8String(storyTrimmed);
          return decoded;
        }

        return storyTrimmed;
      }

      return '';
    } catch (error) {
      console.error('Failed to decode story:', error, 'Original:', story);
      return typeof story === 'string' ? story : '';
    }
  }, [story]);

  return decodedStory;
};
