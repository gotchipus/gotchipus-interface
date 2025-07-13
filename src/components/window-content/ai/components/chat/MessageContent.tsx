import { memo } from 'react';
import { Message } from '../../types';
import { getAgentConfig } from '../../config';
import { MarkedMarkdown } from '../../markdown';
import { LoadingIndicator, StreamingText } from '../ui';

interface Props { message: Message }

export const MessageContent = memo(({ message }: Props) => {
  console.log('MessageContent rendered!', message);
  
  if (message.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingIndicator />
        <span className="text-gray-600">Preparing response...</span>
      </div>
    );
  }
  
  if (!message.isCallTools) {
    const hasMarkdown = /[#*_`\[\]!]/.test(message.content);
    
    if (hasMarkdown && !message.isStreaming) {
      return <MarkedMarkdown content={message.content} />;
    }
    
    return (
      <StreamingText 
        text={message.content} 
        isStreaming={message.isStreaming}
        className="whitespace-pre-wrap"
      />
    );
  }

  const cfg = getAgentConfig(message.agentIndex ?? 0);

  if (!message.data && message.agentIndex !== 1) return null;

  switch (message.agentIndex) {
    case 0:
      if (!message.content) return null;
      
      const hasMarkdown0 = /[#*_`\[\]!]/.test(message.content);
      if (hasMarkdown0 && !message.isStreaming) {
        return <MarkedMarkdown content={message.content} />;
      }
      
      return (
        <StreamingText 
          text={message.content} 
          isStreaming={message.isStreaming}
          className="whitespace-pre-wrap"
        />
      );
    case 1:
      const hasMarkdown1 = /[#*_`\[\]!]/.test(message.content);
      if (hasMarkdown1 && !message.isStreaming) {
        return <MarkedMarkdown content={message.content} />;
      }
      
      return (
        <StreamingText 
          text={message.content} 
          isStreaming={message.isStreaming}
          className="whitespace-pre-wrap"
        />
      );
    case 2:
      return (
        <div className="space-y-4">
          <section className="bg-white dark:bg-neutral-800 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{cfg?.name ?? 'Chart Data'}</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </section>
          {message.content && (
            (() => {
              const hasMarkdown2 = /[#*_`\[\]!]/.test(message.content);
              if (hasMarkdown2 && !message.isStreaming) {
                return <MarkedMarkdown content={message.content} />;
              }
              return (
                <StreamingText 
                  text={message.content} 
                  isStreaming={message.isStreaming}
                  className="whitespace-pre-wrap"
                />
              );
            })()
          )}
        </div>
      );
    default:
      return (
        <div className="space-y-4">
          <section className="bg-white dark:bg-neutral-800 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{cfg?.name ?? 'Tool Result'}</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </section>
          {message.content && (
            (() => {
              const hasMarkdownDefault = /[#*_`\[\]!]/.test(message.content);
              if (hasMarkdownDefault && !message.isStreaming) {
                return <MarkedMarkdown content={message.content} />;
              }
              return (
                <StreamingText 
                  text={message.content} 
                  isStreaming={message.isStreaming}
                  className="whitespace-pre-wrap"
                />
              );
            })()
          )}
        </div>
      );
  }
});

MessageContent.displayName = 'MessageContent';