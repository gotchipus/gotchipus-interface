export interface GeneTrait {
  name: string;
  value: number;
  description: string;
  rarity?: 'common' | 'rare' | 'ultra-rare';
}

export interface DNATraits {
  id: string;
  rawSequence: string;
  sequence: Array<{
    name: string;
    value: string;
    description: string;
    color: string;
    start: number;
    end: number;
  }>;
  bodyShape: TraitDetail;
  bodyColor: TraitDetail;
  tentacleCount: TraitDetail;
  tentacleShapes: TraitDetail[];
  tentacleColor: TraitDetail;
  tentacleTexture: TraitDetail;
  eyeCount: TraitDetail;
  eyeShapes: TraitDetail[];
  eyeColor: TraitDetail;
  skinTexture: TraitDetail;
  personality: TraitDetail;
  generation: number;
  cooldownIndex: number;
  breedingPotential: number;
  mutationFactor?: number;
  glowIntensity: TraitDetail;
  inkColor: TraitDetail;
  inkPattern: TraitDetail;
  camouflage: TraitDetail;
  bioluminescence: TraitDetail;
  finShape: TraitDetail;
  finColor: TraitDetail;
  beakShape: TraitDetail;
  beakColor: TraitDetail;
}

export interface TraitDetail {
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'ultra-rare';
  dominance?: number;
  genePosition?: [number, number];
  value?: number;
}

export const BODY_SHAPES = [
  { value: 0, name: 'Round', description: 'Round' },
  { value: 1, name: 'Oval', description: 'Oval' },
  { value: 2, name: 'Bulbous', description: 'Bulbous' },
  { value: 3, name: 'Streamlined', description: 'Streamlined' },
  { value: 4, name: 'Squat', description: 'Squat' },
  { value: 5, name: 'Heart-shaped', description: 'Heart-shaped' },
  { value: 6, name: 'Star-shaped', description: 'Star-shaped' },
  { value: 7, name: 'Barrel-shaped', description: 'Barrel-shaped' },
  { value: 8, name: 'Tapered', description: 'Tapered', rarity: 'rare' },
  { value: 9, name: 'Irregular', description: 'Irregular', rarity: 'ultra-rare' },
];

export const TENTACLE_COUNTS = [
  { value: 0, name: '4 tentacles', description: '4 tentacles' },
  { value: 1, name: '4 tentacles', description: '4 tentacles' },
  { value: 2, name: '4 tentacles', description: '4 tentacles' },
  { value: 3, name: '4 tentacles', description: '4 tentacles' },
  { value: 4, name: '6 tentacles', description: '6 tentacles' },
  { value: 5, name: '6 tentacles', description: '6 tentacles' },
  { value: 6, name: '6 tentacles', description: '6 tentacles' },
  { value: 7, name: '8 tentacles', description: '8 tentacles' },
  { value: 8, name: '8 tentacles', description: '8 tentacles' },
  { value: 9, name: '10 tentacles', description: '10 tentacles', rarity: 'rare' },
];

export const TENTACLE_SHAPES = [
  { value: 0, name: 'Straight', description: 'Straight' },
  { value: 1, name: 'Curly', description: 'Curly' },
  { value: 2, name: 'Wavy', description: 'Wavy' },
  { value: 3, name: 'Spiral', description: 'Spiral' },
  { value: 4, name: 'Tapered', description: 'Tapered' },
  { value: 5, name: 'Thick', description: 'Thick' },
  { value: 6, name: 'Thin', description: 'Thin' },
  { value: 7, name: 'Forked', description: 'Forked' },
  { value: 8, name: 'Knotted', description: 'Knotted', rarity: 'rare' },
  { value: 9, name: 'Barbed', description: 'Barbed', rarity: 'ultra-rare' },
];

export const EYE_COUNTS = [
  { value: 0, name: '2 eyes', description: '2 eyes' },
  { value: 1, name: '2 eyes', description: '2 eyes' },
  { value: 2, name: '2 eyes', description: '2 eyes' },
  { value: 3, name: '2 eyes', description: '2 eyes' },
  { value: 4, name: '2 eyes', description: '2 eyes' },
  { value: 5, name: '3 eyes', description: '3 eyes' },
  { value: 6, name: '3 eyes', description: '3 eyes' },
  { value: 7, name: '3 eyes', description: '3 eyes' },
  { value: 8, name: '4 eyes', description: '4 eyes' },
  { value: 9, name: '1 eye', description: '1 eye', rarity: 'rare' },
];

export const EYE_SHAPES = [
  { value: 0, name: 'Round', description: 'Round' },
  { value: 1, name: 'Oval', description: 'Oval' },
  { value: 2, name: 'Slit', description: 'Slit' },
  { value: 3, name: 'Star', description: 'Star' },
  { value: 4, name: 'Square', description: 'Square' },
  { value: 5, name: 'Crescent', description: 'Crescent' },
  { value: 6, name: 'Heart', description: 'Heart' },
  { value: 7, name: 'Diamond', description: 'Diamond' },
  { value: 8, name: 'Spiral', description: 'Spiral', rarity: 'rare' },
  { value: 9, name: 'Glowing Orb', description: 'Glowing Orb', rarity: 'ultra-rare' },
];

export const PERSONALITIES = [
  { value: 0, name: 'Curious', description: 'Curious' },
  { value: 1, name: 'Calm', description: 'Calm' },
  { value: 2, name: 'Playful', description: 'Playful' },
  { value: 3, name: 'Shy', description: 'Shy' },
  { value: 4, name: 'Bold', description: 'Bold' },
  { value: 5, name: 'Lazy', description: 'Lazy' },
  { value: 6, name: 'Friendly', description: 'Friendly' },
  { value: 7, name: 'Mysterious', description: 'Mysterious' },
  { value: 8, name: 'Mischievous', description: 'Mischievous', rarity: 'rare' },
  { value: 9, name: 'Regal', description: 'Regal', rarity: 'ultra-rare' },
];