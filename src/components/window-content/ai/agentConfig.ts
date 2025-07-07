import { AgentConfig } from './types';

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    index: 0,
    name: 'Pool Info',
    description: 'Returns pool information',
    renderAsText: false, 
  },
  {
    index: 1,
    name: 'Text Response',
    description: 'Returns plain text response',
    renderAsText: true,
  },
  {
    index: 2,
    name: 'Chart Data',
    description: 'Returns chart data',
    renderAsText: false,
  },
];

export const getAgentConfig = (index: number): AgentConfig | undefined => {
  return AGENT_CONFIGS.find(agent => agent.index === index);
}; 