import { ethers } from 'ethers';
import { GeneTrait, DNATraits, TraitDetail } from '../types/dna';
import {
  BODY_SHAPES,
  TENTACLE_COUNTS,
  TENTACLE_SHAPES,
  EYE_COUNTS,
  EYE_SHAPES,
  PERSONALITIES,
} from '../types/dna';

export function getGene(dnaId: string, index: number): number {
  if (index >= 33000) {
    throw new Error('Invalid gene index');
  }

  const seed = BigInt(dnaId);
  const segment = Math.floor(index / 1000);
  const offset = index % 1000;

  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  let subSeed = ethers.keccak256(
    abiCoder.encode(['uint256', 'uint256'], [seed, segment])
  );

  for (let i = 0; i < offset; i++) {
    subSeed = ethers.keccak256(subSeed);
  }

  return parseInt(subSeed, 16) % 10;
}

export function analyzeDNA(dnaId: string): DNATraits {
  // Body shape (gene 0)
  const bodyShapeValue = getGene(dnaId, 0);
  const bodyShape = BODY_SHAPES[bodyShapeValue];

  // Body color (genes 1-3)
  const bodyColorR = getGene(dnaId, 1);
  const bodyColorG = getGene(dnaId, 2);
  const bodyColorB = getGene(dnaId, 3);
  const bodyColor = {
    name: `RGB(${bodyColorR},${bodyColorG},${bodyColorB})`,
    value: parseInt(`${bodyColorR}${bodyColorG}${bodyColorB}`, 10),
    description: `#${bodyColorR}${bodyColorG}${bodyColorB}`,
    rarity: (bodyColorR >= 8 || bodyColorG >= 8 || bodyColorB >= 8 ? 'rare' : 'common') as 'rare' | 'ultra-rare' | 'common',
  };

  // Tentacle count (gene 4)
  const tentacleCountValue = getGene(dnaId, 4);
  const tentacleCount = TENTACLE_COUNTS[tentacleCountValue];

  // Tentacle shapes (genes 5-12)
  const tentacleShapes = [];
  for (let i = 5; i <= 12; i++) {
    const shapeValue = getGene(dnaId, i);
    tentacleShapes.push(TENTACLE_SHAPES[shapeValue]);
  }

  // Eye count (gene 13)
  const eyeCountValue = getGene(dnaId, 13);
  const eyeCount = EYE_COUNTS[eyeCountValue];

  // Eye shapes (genes 14-17)
  const eyeShapes = [];
  for (let i = 14; i <= 17; i++) {
    const shapeValue = getGene(dnaId, i);
    eyeShapes.push(EYE_SHAPES[shapeValue]);
  }

  // Personality (gene 18)
  const personalityValue = getGene(dnaId, 18);
  const personality = PERSONALITIES[personalityValue];

  return {
    id: dnaId,
    rawSequence: dnaId,
    sequence: [],
    bodyShape: { ...bodyShape, rarity: (bodyShape.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' },
    bodyColor,
    tentacleCount: { ...tentacleCount, rarity: (tentacleCount.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' },
    tentacleShapes: tentacleShapes.map(shape => ({ ...shape, rarity: (shape.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' })),
    eyeCount: { ...eyeCount, rarity: (eyeCount.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' },
    eyeShapes: eyeShapes.map(shape => ({ ...shape, rarity: (shape.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' })),
    personality: { ...personality, rarity: (personality.rarity || 'common') as 'rare' | 'ultra-rare' | 'common' },
    generation: 1,
    cooldownIndex: 0,
    breedingPotential: 50,
    mutationFactor: 0.1,
    tentacleColor: { name: 'Blue', description: 'Blue tentacles', rarity: 'common', value: 1 },
    tentacleTexture: { name: 'Smooth', description: 'Smooth texture', rarity: 'common', value: 1 },
    eyeColor: { name: 'Black', description: 'Black eyes', rarity: 'common', value: 1 },
    skinTexture: { name: 'Smooth', description: 'Smooth skin', rarity: 'common', value: 1 },
    glowIntensity: { name: 'Low', description: 'Low glow intensity', rarity: 'common', value: 1 },
    inkColor: { name: 'Black', description: 'Black ink', rarity: 'common', value: 1 },
    inkPattern: { name: 'Solid', description: 'Solid pattern', rarity: 'common', value: 1 },
    camouflage: { name: 'Basic', description: 'Basic camouflage', rarity: 'common', value: 1 },
    bioluminescence: { name: 'None', description: 'No bioluminescence', rarity: 'common', value: 0 },
    finShape: { name: 'None', description: 'No fins', rarity: 'common', value: 0 },
    finColor: { name: 'None', description: 'No fins', rarity: 'common', value: 0 },
    beakShape: { name: 'Standard', description: 'Standard beak', rarity: 'common', value: 1 },
    beakColor: { name: 'Black', description: 'Black beak', rarity: 'common', value: 1 }
  };
}

export const calculateRarityScore = (traits: DNATraits): number => {
  let score = 0;
  
  // Calculate score based on trait rarities
  const traitRarityScores: Record<string, number> = {
    'common': 1,
    'rare': 5,
    'ultra-rare': 10
  };
  
  // Add scores for each trait
  const traitsToCheck = [
    traits.bodyShape,
    traits.bodyColor,
    traits.tentacleCount,
    traits.eyeCount,
    traits.personality,
    ...traits.tentacleShapes,
    ...traits.eyeShapes
  ];
  
  traitsToCheck.forEach(trait => {
    score += traitRarityScores[trait.rarity] || 0;
  });
  
  return score;
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'ultra-rare':
      return '#FFD700'; // Gold
    case 'rare':
      return '#800080'; // Purple
    default:
      return '#0000FF'; // Blue
  }
};

export const getRarityLabel = (rarity: string): string => {
  return rarity.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}; 