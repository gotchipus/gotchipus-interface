import { memo, useEffect, useState } from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

export const StreamingText = memo(({ text, isStreaming = false, className = '' }: StreamingTextProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isStreaming && text) {
      setAnimationKey(prev => prev + 1);
    }
  }, [text, isStreaming]);

  if (!isStreaming || !text) {
    return <span className={className} style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;
  }

  return (
    <span className={`relative ${className}`} style={{ whiteSpace: 'pre-wrap' }}>
      <span className="opacity-30 text-gray-400">{text}</span>
      <span 
        key={animationKey}
        className="absolute inset-0 overflow-hidden animate-fill-text"
        style={{
          clipPath: 'inset(0 100% 0 0)',
          animation: 'fillText 1.2s ease-out forwards',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </span>
      <style jsx>{`
        @keyframes fillText {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0% 0 0);
          }
        }
      `}</style>
    </span>
  );
});

StreamingText.displayName = 'StreamingText';