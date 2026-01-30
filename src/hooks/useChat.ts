import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useCallback } from 'react';

interface ChatCallbacks {
  onData?: (data: any) => void;
  onText?: (text: string) => void;
  onThinking?: (text: string) => void;
  onAction?: (action: any) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
}

interface ChatState {
  buffer: string;
  inThinkBlock: boolean;
}

const useChat = () => {
  const send = useCallback(
    async (
      payload: { msg: string },
      callbacks?: ChatCallbacks
    ) => {
      let hasError = false;
      const ctrl = new AbortController();
      let chatState: ChatState = { buffer: '', inThinkBlock: false };

      const processContent = (content: string): string => {
        chatState.buffer += content;

        let result = '';
        let tempBuffer = chatState.buffer;

        while (tempBuffer.length > 0) {
          if (!chatState.inThinkBlock) {
            const thinkStart = tempBuffer.indexOf('<think>');
            if (thinkStart === -1) {
              result += tempBuffer;
              tempBuffer = '';
              break;
            } else {
              result += tempBuffer.substring(0, thinkStart);
              tempBuffer = tempBuffer.substring(thinkStart);
              chatState.inThinkBlock = true;
            }
          }

          if (chatState.inThinkBlock) {
            const thinkEnd = tempBuffer.indexOf('</think>');
            if (thinkEnd === -1) {
              tempBuffer = '';
              break;
            } else {
              tempBuffer = tempBuffer.substring(thinkEnd + 8);
              chatState.inThinkBlock = false;
            }
          }
        }

        chatState.buffer = tempBuffer;
        return result;
      };

      try {
        await fetchEventSource('/api/chat/stream', {
          signal: ctrl.signal,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),

          onopen: async (res) => {
            if (!res.ok || !res.headers.get('content-type')?.includes('text/event-stream')) {
              hasError = true;
              throw new Error(`Unexpected response ${res.status}`);
            }
          },

          onmessage: async (ev) => {
            if (hasError) return;

            try {
              const eventData = JSON.parse(ev.data);

              switch (eventData.type) {
                case 'message_start':
                  break;

                case 'thinking':
                  if (eventData.message) {
                    callbacks?.onThinking?.(eventData.message);
                  }
                  break;

                case 'text_delta':
                  if (eventData.text) {
                    const filteredContent = processContent(eventData.text);
                    if (filteredContent.trim()) {
                      callbacks?.onText?.(filteredContent);
                    }
                  }
                  break;

                case 'action':
                  if (eventData.action) {
                    callbacks?.onAction?.(eventData);
                  }
                  break;

                case 'message_stop':
                  break;

                default:
                  console.warn('Unknown event type:', eventData.type);
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError, ev.data);
            }
          },

          onerror(err) {
            hasError = true;
            callbacks?.onError?.(err);
          }
        });
      } catch (error) {
        hasError = true;
        callbacks?.onError?.(error);
      } finally {
        if (!hasError) {
          callbacks?.onComplete?.();
        }
        ctrl.abort();
      }
    },
    [],
  );

  return { send };
};

export default useChat;