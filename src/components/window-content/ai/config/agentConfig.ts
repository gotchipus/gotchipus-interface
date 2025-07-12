import { AgentConfig } from '../types';
import PetGotchiComponent from '../components/game/PetGotchiComponent';
import SummonComponent from '../components/game/SummonComponent';
import WearableComponent from '../components/game/WearableComponent';
import CallComponent from '../components/game/CallComponent';
import SwapComponent from '../components/defi/SwapComponent';
import AddLiquidityComponent from '../components/defi/AddLiquidityComponent';
import RemoveLiquidityComponent from '../components/defi/RemoveLiquidityComponent';

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
    name: 'Pet Gotchi',
    description: 'Pet Gotchi',
    component: PetGotchiComponent,
    renderAsText: false,
  },
  {
    index: 3,
    name: 'Free Mint',
    description: 'Free Mint Pharos NFT',
    renderAsText: false,
  },
  {
    index: 4,
    name: 'Summon Gotchi',
    description: 'Summon Gotchipus NFT',
    component: SummonComponent,
    renderAsText: false,
  },
  {
    index: 5,
    name: 'Wearable',
    description: 'Gotchi Wearable',
    component: WearableComponent,
    renderAsText: false,
  },
  {
    index: 6,
    name: 'Call',
    description: 'Token Transfer & Contract Call',
    component: CallComponent,
    renderAsText: false,
  },
  {
    index: 7,
    name: 'Swap',
    description: 'Token Swap',
    component: SwapComponent,
    renderAsText: false,
  },
  {
    index: 8,
    name: 'Add Liquidity',
    description: 'Add Liquidity to Pools',
    component: AddLiquidityComponent,
    renderAsText: false,
  },
  {
    index: 9,
    name: 'Remove Liquidity',
    description: 'Remove Liquidity from Pools',
    component: RemoveLiquidityComponent,
    renderAsText: false,
  }
];

export const getAgentConfig = (index: number): AgentConfig | undefined => {
  return AGENT_CONFIGS.find(agent => agent.index === index);
}; 