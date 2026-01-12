export interface WearableItem {
  id: number;
  name: string;
  imagePath: string;
  category: 'head' | 'hand' | 'clothes' | 'face' | 'mouth';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

export interface CartItem extends WearableItem {
  quantity: number;
}

export const RARITY_COLORS = {
  common: '#808080',
  rare: '#0000FF',
  epic: '#800080',
  legendary: '#FFD700'
} as const;

export const RARITY_MULTIPLIER = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 5
} as const;

export interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

export interface RarityOption {
  value: string;
  label: string;
  color: string;
}
