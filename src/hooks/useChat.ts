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
              callbacks?.onText?.(ev.data);
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