import { memo } from 'react';
import { Message } from '../../types';
import { getAgentConfig } from '../../config';
import { MarkdownRenderer } from '../../markdown';
import { LoadingIndicator } from '../ui';

interface Props { message: Message }

export const MessageContent = memo(({ message }: Props) => {  
  if (message.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingIndicator />
      </div>
    );
  }
  
  if (!message.isCallTools) {
    if (!message.content && message.isStreaming) {
      return (
        <div className="flex items-center space-x-2">
          <LoadingIndicator />
        </div>
      );
    }
    
    return (
      <MarkdownRenderer 
        content={message.content || ''} 
        isStreaming={message.isStreaming}
      />
    );
  }

  const cfg = getAgentConfig(message.agentIndex ?? 0);

  if (!message.data && message.agentIndex !== 1) return null;

  switch (message.agentIndex) {
    case 0:
    case 1:
      if (!message.content && message.isStreaming) {
        return (
          <div className="flex items-center space-x-2">
            <LoadingIndicator />
          </div>
        );
      }
      
      if (!message.content) return null;
      
      return (
        <MarkdownRenderer 
          content={message.content} 
          isStreaming={message.isStreaming}
        />
      );
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      if (
        (message.data?.petSuccess || 
         message.data?.mintSuccess || 
         message.data?.summonSuccess || 
         message.data?.wearableSuccess ||
         message.data?.callSuccess) && 
        message.content
      ) {
        return (
          <MarkdownRenderer 
            content={message.content} 
            isStreaming={message.isStreaming}
          />
        );
      }
      
      return (
        <div className="space-y-4">
          <section className="bg-white dark:bg-neutral-800 border-2 border-[#808080] rounded-sm p-4 shadow-win98-inner">
            <h3 className="font-semibold mb-2 text-[#000080]">{cfg?.name ?? 'Tool Result'}</h3>
            <pre className="text-sm overflow-x-auto bg-[#f0f0f0] p-2 border border-[#c0c0c0] rounded">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </section>
          {message.content && (
            <MarkdownRenderer 
              content={message.content} 
              isStreaming={message.isStreaming}
            />
          )}
        </div>
      );
    
    default:
      return (
        <div className="space-y-4">
          <section className="bg-white dark:bg-neutral-800 border-2 border-[#808080] rounded-sm p-4 shadow-win98-inner">
            <h3 className="font-semibold mb-2 text-[#000080]">{cfg?.name ?? 'Tool Result'}</h3>
            <pre className="text-sm overflow-x-auto bg-[#f0f0f0] p-2 border border-[#c0c0c0] rounded">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </section>
          {message.content && (
            <MarkdownRenderer 
              content={message.content} 
              isStreaming={message.isStreaming}
            />
          )}
        </div>
      );
  }
}, (prevProps, nextProps) => {
  const prev = prevProps.message;
  const next = nextProps.message;

  if (prev.id !== next.id) return false;

  if (next.isStreaming) {
    return false;
  }

  return prev.content === next.content &&
         prev.isCallTools === next.isCallTools &&
         prev.agentIndex === next.agentIndex &&
         prev.isLoading === next.isLoading &&
         prev.isStreaming === next.isStreaming &&
         JSON.stringify(prev.data) === JSON.stringify(next.data);
});

MessageContent.displayName = 'MessageContent';