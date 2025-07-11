import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useEffect, useRef } from 'react';
import './marked-win98.css';

interface MarkedMarkdownProps {
  content: string;
}

export default function MarkedMarkdown({ content }: MarkedMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const renderMarkdown = async () => {
      const htmlContent = await marked(content);
      
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = sanitizedHtml;
      }
    };

    renderMarkdown();
  }, [content]);

  return (
    <div 
      ref={containerRef}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#000000',
        backgroundColor: 'transparent',
        wordWrap: 'break-word'
      }}
      className="marked-markdown"
    />
  );
}