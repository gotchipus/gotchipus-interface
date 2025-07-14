import { memo, useEffect, useState, useRef } from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
  speed?: number;
  onTextUpdate?: () => void;
}

export const StreamingText = memo(({ text, isStreaming = false, className = ''}: StreamingTextProps) => {
  return (
    <span className={`${className} inline-block`} style={{ whiteSpace: 'pre-wrap', minHeight: '1.5em' }}>
      {text}
      {isStreaming && (
        <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
      )}
    </span>
  );
});

StreamingText.displayName = 'StreamingText';