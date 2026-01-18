import { useMemo } from 'react';
import { GotchiMetadata } from '@/lib/types';
import { RARITY_NAMES, RARITY_COLORS, FACTION_NAMES } from '../constants';
import { calculateLevel, calculateAge, formatAttribute } from '../utils';

export const useGotchiComputedData = (metadata: GotchiMetadata) => {
  const currentExp = metadata.leveling_data?.current_exp || 0;
  const calculatedLevel = useMemo(() => calculateLevel(currentExp), [currentExp]);

  const rarity = metadata.dna_data?.rarity ?? 0;
  const rarityName = RARITY_NAMES[rarity] || "Common";
  const rarityColor = RARITY_COLORS[rarity] || "bg-[#808080] text-white";

  const primaryFaction = metadata.faction_primary ?? 0;
  const factionName = FACTION_NAMES[primaryFaction] || "COMBAT";

  const age = useMemo(() => calculateAge(metadata.birth_time), [metadata.birth_time]);

  const attributes = useMemo(() => [
    { name: "STR", value: formatAttribute(metadata.core_strength), icon: "strength" },
    { name: "DEF", value: formatAttribute(metadata.core_defense), icon: "defense" },
    { name: "INT", value: formatAttribute(metadata.core_mind), icon: "mind" },
    { name: "VIT", value: formatAttribute(metadata.core_vitality), icon: "vitality" },
    { name: "AGI", value: formatAttribute(metadata.core_agility), icon: "agility" },
    { name: "LUK", value: formatAttribute(metadata.core_luck), icon: "luck" },
  ], [
    metadata.core_strength,
    metadata.core_defense,
    metadata.core_mind,
    metadata.core_vitality,
    metadata.core_agility,
    metadata.core_luck
  ]);

  return {
    currentExp,
    calculatedLevel,
    rarity,
    rarityName,
    rarityColor,
    primaryFaction,
    factionName,
    age,
    attributes,
  };
};
