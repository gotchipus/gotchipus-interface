import { BODY_BYTES32, EYE_BYTES32, HAND_BYTES32, HEAD_BYTES32, CLOTHES_BYTES32, BG_BYTES32, MOUTH_BYTES32, FACE_BYTES32 } from '@/lib/constant';
import { getWearableImagePath } from '@/src/utils/wearableMapping';

export const WEARABLE_CONFIG = {
  background: { key: BG_BYTES32, zIndex: 0, offset: 0, name: "background" },
  body: { key: BODY_BYTES32, zIndex: 1, offset: 16, name: "body" },
  eye: { key: EYE_BYTES32, zIndex: 2, offset: 24, name: "eye" },
  hand: { key: HAND_BYTES32, zIndex: 3, offset: 27, name: "hand" },
  head: { key: HEAD_BYTES32, zIndex: 4, offset: 46, name: "head" },
  clothes: { key: CLOTHES_BYTES32, zIndex: 5, offset: 63, name: "clothes" },
  face: { key: FACE_BYTES32, zIndex: 6, offset: 72, name: "face" },
  mouth: { key: MOUTH_BYTES32, zIndex: 7, offset: 79, name: "mouth" },
};

export type WearableCategoryKey = string;
export const KEY_TO_CONFIG_MAP = Object.values(WEARABLE_CONFIG).reduce((acc, config) => {
    acc[config.key as WearableCategoryKey] = config;
    return acc;
}, {} as Record<WearableCategoryKey, typeof WEARABLE_CONFIG[keyof typeof WEARABLE_CONFIG]>);

export const TOKEN_ID_TO_LOCAL_INDEX: Record<string, Record<number, number>> = {
  'background': {
    0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 16
  },
  'body': {
    16: 1, 17: 2, 18: 3, 19: 4, 20: 5, 21: 6, 22: 7, 23: 8
  },
  'eye': {
    24: 1, 25: 2, 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8
  },
  'hand': {
    32: 1, 33: 2, 34: 3, 35: 4, 36: 5, 37: 6, 38: 7, 39: 8, 40: 9, 41: 10, 42: 11, 43: 12, 44: 13, 45: 14
  },
  'head': {
    46: 1, 47: 2, 48: 3, 49: 4, 50: 5, 51: 6, 52: 7, 53: 8, 54: 9, 55: 10, 56: 11, 57: 12, 58: 13, 59: 14, 60: 15, 61: 16, 62: 17
  },
  'clothes': {
    63: 1, 64: 2, 65: 3, 66: 4, 67: 5, 68: 6, 69: 7, 70: 8, 71: 9
  },
  'face': {
    72: 1, 73: 2, 74: 3, 75: 4, 76: 5, 77: 6, 78: 7
  },
  'mouth': {
    79: 1, 80: 2, 81: 3, 82: 4, 83: 5, 84: 6
  }
};

const generateTokenIdToImage = (): Record<number, string> => {
  const mapping: Record<number, string> = {};
  
  // Backgrounds (0-15) -> index 0-15
  for (let i = 0; i <= 15; i++) {
    mapping[i] = getWearableImagePath('backgrounds', i);
  }
  
  // Bodies (16-23) -> index 0-7
  for (let i = 16; i <= 23; i++) {
    mapping[i] = getWearableImagePath('bodys', i - 16);
  }
  
  // Eyes (24-31) -> index 0-7
  for (let i = 24; i <= 31; i++) {
    mapping[i] = getWearableImagePath('eyes', i - 24);
  }
  
  // Hands (32-45) -> index 0-13
  for (let i = 32; i <= 45; i++) {
    mapping[i] = getWearableImagePath('hands', i - 32);
  }
  
  // Heads (46-62) -> index 0-16
  for (let i = 46; i <= 62; i++) {
    mapping[i] = getWearableImagePath('heads', i - 46);
  }
  
  // Clothes (63-71) -> index 0-8
  for (let i = 63; i <= 71; i++) {
    mapping[i] = getWearableImagePath('clothes', i - 63);
  }
  
  // Faces (72-78) -> index 0-6
  for (let i = 72; i <= 78; i++) {
    mapping[i] = getWearableImagePath('faces', i - 72);
  }
  
  // Mouths (79-84) -> index 0-5
  for (let i = 79; i <= 84; i++) {
    mapping[i] = getWearableImagePath('mouths', i - 79);
  }
  
  return mapping;
};

export const TOKEN_ID_TO_IMAGE: Record<number, string> = generateTokenIdToImage();
