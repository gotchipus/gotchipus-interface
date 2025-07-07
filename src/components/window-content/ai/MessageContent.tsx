import { memo } from 'react';
import { Message } from './types';
import { getAgentConfig } from './agentConfig';
import Markdown from './markdown';

interface Props { message: Message }

export const MessageContent = memo(({ message }: Props) => {
  if (!message.isCallTools) {
    return <Markdown content={message.content} />;
  }

  const cfg = getAgentConfig(message.agentIndex ?? 0);

  if (!message.data) return null;

  switch (message.agentIndex) {
    case 0:
      return message.content ? <Markdown content={message.content} /> : null;
    case 2:
      return (
        <div className="space-y-4">
          <section className="bg-white dark:bg-neutral-800 border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{cfg?.name ?? 'Chart Data'}</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </section>
          <Markdown content={message.content} />
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
          <Markdown content={message.content} />
        </div>
      );
  }
});

MessageContent.displayName = 'MessageContent';