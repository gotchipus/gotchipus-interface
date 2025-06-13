import { BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, BG_BYTES32 } from '@/lib/constant';
import { ALL_WEARABLE_SVG } from './svgs';

export const WEARABLE_CONFIG = {
  background: { key: BG_BYTES32, zIndex: 0, offset: 0, name: "background" },
  body: { key: BODY_BYTES32, zIndex: 1, offset: 9, name: "body" },
  eye: { key: EYE_BYTES32, zIndex: 2, offset: 18, name: "eye" },
  hand: { key: HAND_BYTES32, zIndex: 3, offset: 27, name: "hand" },
  head: { key: HEAD_BYTES32, zIndex: 4, offset: 36, name: "head" },
  clothes: { key: CLOTHES_BYTES32, zIndex: 5, offset: 45, name: "clothes" },
};

export type WearableCategoryKey = keyof typeof ALL_WEARABLE_SVG;
export const KEY_TO_CONFIG_MAP = Object.values(WEARABLE_CONFIG).reduce((acc, config) => {
    acc[config.key as WearableCategoryKey] = config;
    return acc;
}, {} as Record<WearableCategoryKey, typeof WEARABLE_CONFIG[keyof typeof WEARABLE_CONFIG]>);
