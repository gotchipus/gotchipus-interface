import { memo } from 'react';
import { MarkdownContent } from './markdown';
import { cleanAIText } from '../utils';
import './marked-win98.css';

interface MarkedMarkdownProps {
  content: string;
}

const MarkedMarkdown = memo(({ content }: MarkedMarkdownProps) => {
  const cleanedContent = cleanAIText(content);

  return (
    <div className="marked-markdown">
      <MarkdownContent content={cleanedContent} />
    </div>
  );
});

MarkedMarkdown.displayName = 'MarkedMarkdown';

export default MarkedMarkdown;