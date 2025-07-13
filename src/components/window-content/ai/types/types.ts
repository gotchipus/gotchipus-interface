export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  isCallTools?: boolean;
  agentIndex?: number;
  data?: any;
  isLoading?: boolean;
  isStreaming?: boolean;
}

export interface ChatResponse {
  is_call_tools: boolean;
  message: string;
  agent_index: number;
}

export interface AgentConfig {
  index: number;
  name: string;
  description: string;
  component?: React.ComponentType<any>;
  renderAsText?: boolean;
}

export interface PoolInfo {
  pool: string;
  token0_symbol: string;
  token1_symbol: string;
  token0: string;
  token1: string;
  token0_reserve: string;
  token1_reserve: string;
} 