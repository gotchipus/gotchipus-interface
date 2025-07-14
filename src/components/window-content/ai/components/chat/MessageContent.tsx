import { memo } from 'react';
import { Message } from '../../types';
import { getAgentConfig } from '../../config';
import { MarkedMarkdown } from '../../markdown';
import { LoadingIndicator, StreamingText } from '../ui';

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
    
    const hasMarkdown = /[#*_`\[\]!]/.test(message.content);
    
    if (hasMarkdown) {
      return (
        <div className="markdown-streaming">
          <MarkedMarkdown content={message.content} />
          {message.isStreaming && (
            <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
          )}
        </div>
      );
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
      if (!message.content && message.isStreaming) {
        return (
          <div className="flex items-center space-x-2">
            <LoadingIndicator />
          </div>
        );
      }
      
      if (!message.content) return null;
      
      const hasMarkdown0 = /[#*_`\[\]!]/.test(message.content);
      if (hasMarkdown0) {
        return (
          <div className="markdown-streaming">
            <MarkedMarkdown content={message.content} />
            {message.isStreaming && (
              <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
            )}
          </div>
        );
      }
      
      return (
        <StreamingText 
          text={message.content} 
          isStreaming={message.isStreaming}
          className="whitespace-pre-wrap"
        />
      );
    case 1:
      if (!message.content && message.isStreaming) {
        return (
          <div className="flex items-center space-x-2">
            <LoadingIndicator />
          </div>
        );
      }
      
      const hasMarkdown1 = /[#*_`\[\]!]/.test(message.content);
      if (hasMarkdown1) {
        return (
          <div className="markdown-streaming">
            <MarkedMarkdown content={message.content} />
            {message.isStreaming && (
              <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
            )}
          </div>
        );
      }
      
      return (
        <StreamingText 
          text={message.content} 
          isStreaming={message.isStreaming}
          className="whitespace-pre-wrap"
        />
      );
    case 2:
      if (message.data?.petSuccess && message.content) {
        const hasMarkdown2 = /[#*_`\[\]!]/.test(message.content);
        if (hasMarkdown2) {
          return (
            <div className="markdown-streaming">
              <MarkedMarkdown content={message.content} />
              {message.isStreaming && (
                <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
              )}
            </div>
          );
        }
        return (
          <StreamingText 
            text={message.content} 
            isStreaming={message.isStreaming}
            className="whitespace-pre-wrap"
          />
        );
      }
      
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
              if (hasMarkdown2) {
                return (
                  <div className="markdown-streaming">
                    <MarkedMarkdown content={message.content} />
                    {message.isStreaming && (
                      <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
                    )}
                  </div>
                );
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
    case 3:
      if (message.data?.mintSuccess && message.content) {
        const hasMarkdown3 = /[#*_`\[\]!]/.test(message.content);
        if (hasMarkdown3) {
          return (
            <div className="markdown-streaming">
              <MarkedMarkdown content={message.content} />
              {message.isStreaming && (
                <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
              )}
            </div>
          );
        }
        return (
          <StreamingText 
            text={message.content} 
            isStreaming={message.isStreaming}
            className="whitespace-pre-wrap"
          />
        );
      }
      
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
              const hasMarkdown3 = /[#*_`\[\]!]/.test(message.content);
              if (hasMarkdown3) {
                return (
                  <div className="markdown-streaming">
                    <MarkedMarkdown content={message.content} />
                    {message.isStreaming && (
                      <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
                    )}
                  </div>
                );
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
    case 4:
      if (message.data?.summonSuccess && message.content) {
        const hasMarkdown4 = /[#*_`\[\]!]/.test(message.content);
        if (hasMarkdown4) {
          return (
            <div className="markdown-streaming">
              <MarkedMarkdown content={message.content} />
              {message.isStreaming && (
                <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
              )}
            </div>
          );
        }
        return (
          <StreamingText 
            text={message.content} 
            isStreaming={message.isStreaming}
            className="whitespace-pre-wrap"
          />
        );
      }
      
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
              const hasMarkdown4 = /[#*_`\[\]!]/.test(message.content);
              if (hasMarkdown4) {
                return (
                  <div className="markdown-streaming">
                    <MarkedMarkdown content={message.content} />
                    {message.isStreaming && (
                      <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
                    )}
                  </div>
                );
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
              if (hasMarkdownDefault) {
                return (
                  <div className="markdown-streaming">
                    <MarkedMarkdown content={message.content} />
                    {message.isStreaming && (
                      <span className="animate-pulse ml-1 text-blue-500 inline-block">|</span>
                    )}
                  </div>
                );
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