import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useCallback } from 'react';

interface ChatCallbacks {
  onData?: (data: any) => void;
  onText?: (text: string) => void;
  onError?: (error: any) => void;
}

const useChat = () => {
  const send = useCallback(
    async (
      payload: { query: string; is_call_tools: boolean; agent_index: number; message: string },
      callbacks?: ChatCallbacks
    ) => {
      let hasError = false;
      const ctrl = new AbortController();
      let accumulated = '';

      try {
        await fetchEventSource('/api/chat/callIntent', {
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
            
            if (ev.event === 'data') {
              try {
                const json = JSON.parse(ev.data);
                callbacks?.onData?.(json);
              } catch (parseError) {
                console.error('Failed to parse data event:', parseError);
              }
            } else if (ev.event === 'text') {
              let cleanedText = ev.data
                .replace(/\*\s+\*/g, '**')
                .replace(/\*\s+\*\s+\*/g, '***')
                .replace(/\*\*\*\s+\*\*\*/g, '***')
                .replace(/\*\*\s+\*\*/g, '**')
                
                .replace(/\n\s*\*\s+\*/g, '\n* ')
                .replace(/\n\s*\*\s+\*\s+\*/g, '\n* ')
                .replace(/\n\s*\*\s+\*\s+\*\s+\*/g, '\n* ')
                
                .replace(/\*\*\*([^*]+):\s*\*\*\*/g, '**$1:**')
                .replace(/\*\*([^*]+):\s*\*\*/g, '**$1:**')
                .replace(/\*\*\*([^*]+):\s*\*\*/g, '**$1:**')
                
                .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.**')
                .replace(/\*\*([^*]+)\*\*\.\*\*/g, '**$1.**')
                
                .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*/g, '**$1.** **$2:**')
                .replace(/\*\*\*([^*]+)\*\*\*\.\*\*\*([^*]+)\*\*\*\.\*\*\*/g, '**$1.** **$2.**')
                
                .replace(/\*\*Key Features:\s*\*\*\s*\*\*/g, '**Key Features:**')
                
                .replace(/\n\s*\n\s*\n+/g, '\n\n')
                
                .replace(/\*\*([^*]+):\s*\*\*/g, '**$1:**')
                
                .trim();
              
              accumulated = cleanedText;
              callbacks?.onText?.(cleanedText);
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
        ctrl.abort();
      }
    },
    [],
  );

  return { send };
};

export default useChat;