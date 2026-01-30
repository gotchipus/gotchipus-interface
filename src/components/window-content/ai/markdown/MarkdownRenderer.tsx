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

function fixIncompleteCodeBlocks(content: string, isStreaming: boolean): string {
  if (!isStreaming) return content;

  const codeBlockCount = (content.match(/```/g) || []).length;

  if (codeBlockCount % 2 !== 0) {
    return content + '\n```';
  }

  return content;
}

function normalizeListItems(content: string): string {
  const lines = content.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^\*[A-Z]/)) {
      if (i > 0 && !result[result.length - 1].endsWith('\n')) {
        result.push('');
      }
      result.push(trimmedLine);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

export const MarkdownRenderer = memo(({
  content,
  isStreaming = false,
  className = ''
}: MarkdownRendererProps) => {
  const processedContent = useMemo(() => {
    if (!content) return '';

    let cleaned = cleanAIText(content);

    cleaned = normalizeListItems(cleaned);

    cleaned = fixIncompleteCodeBlocks(cleaned, isStreaming);

    return cleaned;
  }, [content, isStreaming]);

  const hasMarkdown = useMemo(() => {
    return hasMarkdownSyntax(processedContent);
  }, [processedContent]);

  if (hasMarkdown) {
    return (
      <div className={`markdown-streaming ${className}`}>
        <MarkdownContent content={processedContent} />
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
      text={processedContent}
      isStreaming={isStreaming}
      className={`whitespace-pre-wrap ${className}`}
    />
  );
}, (prevProps, nextProps) => {
  if (prevProps.isStreaming !== nextProps.isStreaming) return false;

  if (nextProps.isStreaming) {
    return false;
  }

  return prevProps.content === nextProps.content &&
         prevProps.className === nextProps.className;
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

