export const RARITY_NAMES: Record<number, string> = {
  0: "Common",
  1: "Rare",
  2: "Epic",
  3: "Legendary",
};

export const RARITY_COLORS: Record<number, string> = {
  0: "bg-[#808080] text-white",
  1: "bg-[#0066cc] text-white",
  2: "bg-[#9933cc] text-white",
  3: "bg-[#ff9900] text-white",
};

export const FACTION_NAMES: Record<number, string> = {
  0: "COMBAT",
  1: "DEFENSE",
  2: "TECHNOLOGY",
};

export const FLOAT_ANIMATION = {
  y: [0, -10, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};
