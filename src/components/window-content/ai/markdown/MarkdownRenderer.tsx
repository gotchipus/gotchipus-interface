import { memo, useMemo } from 'react';
import { MarkdownContent } from './markdown';
import { StreamingText } from '../components/ui';
import { cleanAIText } from '../utils';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

function hasMarkdownSyntax(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  
  const markdownPatterns = [
    /^#{1,6}\s+.+$/m,  
    /\*\*[^*]+\*\*/,   
    /\*[^*]+\*/,      
    /`[^`]+`/,        
    /```[\s\S]*?```/, 
    /^[-*+]\s+.+$/m,   
    /^\d+\.\s+.+$/m,   
    /\[.+\]\(.+\)/,    
    /!\[.+\]\(.+\)/,
    /^>\s+.+$/m,       
    /^---+$/m,         
    /\|.+\|/,          
    /^```[\w]*$/m,     
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
}

export const MarkdownRenderer = memo(({ 
  content, 
  isStreaming = false, 
  className = '' 
}: MarkdownRendererProps) => {
  const cleanedContent = useMemo(() => {
    if (!content) return '';
    return cleanAIText(content);
  }, [content]);

  const hasMarkdown = useMemo(() => {
    return hasMarkdownSyntax(cleanedContent);
  }, [cleanedContent]);

  if (hasMarkdown) {
    return (
      <div className={`markdown-streaming ${className}`}>
        <MarkdownContent content={cleanedContent} />
        {isStreaming && (
          <span 
            className="animate-pulse ml-1 text-[#0000ff] inline-block font-mono"
            style={{ animationDuration: '1s' }}
          >
            ▋
          </span>
        )}
      </div>
    );
  }

  return (
    <StreamingText 
      text={cleanedContent} 
      isStreaming={isStreaming}
      className={`whitespace-pre-wrap ${className}`}
    />
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

