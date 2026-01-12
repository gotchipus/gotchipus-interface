// UUID mapping for wearables stored in R3
// Format: https://app.gotchipus.com/wearable/{type}/{uuid}.png
export type WearableType = 'backgrounds' | 'bodys' | 'eyes' | 'hands' | 'heads' | 'clothes' | 'faces' | 'mouths';

export const wearableMapping: Record<WearableType, string[]> = {
  backgrounds: [
    "ec20a472-61d5-4ff5-8d36-3ded8409ceba",
    "d6dbb5f0-6e20-4333-b297-13dab517b960",
    "fa701610-ca04-48f6-bd6d-3ea88e7fda5b",
    "f53bea6e-7005-4fe3-81bb-ae402ce2f9fb",
    "25bdb2e7-349c-4b72-83b9-38ab3a19be30",
    "dbf1345b-e963-48bc-a5a2-891e78843b3c",
    "fd4fa151-31a7-475e-ab7b-db70c45eef4f",
    "c21f38e2-81fd-4ea6-a15d-8723a87230d8",
    "f0e28c3a-aab4-4818-b0cc-308451fa9f06",
    "9d60f8fa-a388-4961-8388-8fcad2f0f2b5",
    "d7b31878-ac0a-4fd2-a9ab-cd3cd0d0a9cb",
    "dfcc1353-a681-44e8-a23a-266460ecf2f2",
    "d94051ce-9cbc-422f-b6bc-ed55b9d1e00e",
    "54a07b72-86cb-4a82-82cd-984eac99c3bc",
    "19406b96-0bb4-4fa2-9959-39471ff6d4e8",
    "9ef77549-1ce7-4ec6-8094-1b606fc8c33f"
  ],
  bodys: [
    "802a6ba4-be79-4928-8b32-ac9921c8c97b",
    "9bc81f94-cce0-4401-8d1d-2c643860f84f",
    "51ce8b6f-8830-4868-9fd1-33fef545ac38",
    "518ef13f-2070-4021-a3d9-6dcb1dd3c5e4",
    "92df1797-1b8e-4857-b6d7-53f6e98cf3a8",
    "839d0c08-0f06-4682-b878-ddf925c7b4fa",
    "ee267bd5-f482-461c-bfea-3c59a9ea8260",
    "b6291ad1-efaa-470e-b19d-1d0485b4c7bf"
  ],
  eyes: [
    "1781a581-030c-4810-9f44-42b9e5a517d7",
    "4e3085b1-90c4-46ea-8360-5594f7a80837",
    "94acd198-010c-4603-bfed-608df78df94e",
    "d63450e1-7ab1-401f-bc44-aa446a3884b1",
    "e21b12ad-c178-4d6c-b8e8-60ba30aaa254",
    "37a97147-e413-4dae-ae81-88dc58da6df6",
    "0b0ed73b-6dfe-4bfc-afaf-41928aef730d",
    "ed746f0b-d3a5-46e8-87b5-9e359dc77825"
  ],
  hands: [
    "1366a1da-7b40-4f43-8c29-1ad4c3b0d922",
    "d236aff9-e3b3-43d4-a3c3-e025343504a8",
    "7a305c78-95ef-4746-9868-a6936c7bc343",
    "dc141e82-f60a-4798-8b5d-a27b2412abb0",
    "8ca11f26-ad8d-413e-8e7a-cb642b264e44",
    "35ed501c-c625-4cd4-b8af-070bf8a13c1b",
    "1ab5f996-a154-4f0a-ac27-92a01ffb9b73",
    "0ae9c93d-564d-440a-9cc8-dd06008f4b89",
    "bc788ee5-1046-48d5-ab1c-6f61258eb1ea",
    "fe8ca982-368b-431d-bcdf-825f935a6304",
    "80bcf3c3-4c0c-4447-bb0e-4fa21a429c69",
    "70054375-bca3-4e98-b186-aad14280d93c",
    "083118ac-e602-43d6-a04d-4d9ab8d201b8",
    "14384f9d-d923-48a0-9d54-d2f1f7033efc"
  ],
  heads: [
    "71116665-5673-4a11-9260-527e1d605600",
    "8c73987e-fd75-4ef8-9cf9-8c89f3d887f0",
    "8d5fd1f7-1757-4ec3-889d-ae5696cca401",
    "101a9df9-50e4-4943-a6a5-2a76c666fad3",
    "0d42629b-5653-4221-9b31-bf76016dbbea",
    "9480e8fc-f5cf-4537-9a56-432304a893b2",
    "62c9de53-3e6a-42f9-b7d2-12f78b58f153",
    "e4bfa069-6cc0-4196-ada7-c6115ce77692",
    "d99b0aeb-1383-4b77-bbbb-b40e71248a1e",
    "66f50fe4-a921-42ab-88fd-0b43b68b2f3b",
    "04dddebc-c224-41bd-86cd-153f9596e6de",
    "30c1758b-bd99-4f06-952b-025f54ff3534",
    "6da21ec4-3abe-4397-9fed-75e2f500a37e",
    "5dfc8a1f-3ae0-4a71-a343-9311afccb1f3",
    "effa5110-de45-4434-8740-36cc303a441e",
    "3f7d82bd-b018-4cc8-8e8f-206958a1a4e5",
    "e1c11233-ac42-4a1a-a63f-d1f66c427a76"
  ],
  clothes: [
    "629e5929-8ccd-4cb1-893f-ba3e2e301c1e",
    "33623528-0f5f-4c17-a60d-626437c21fb6",
    "52c9146e-779f-4533-b545-c2d0a59f0ee1",
    "3fa31fd3-e2d8-4813-ad9a-72d8bc98f8b1",
    "5f500780-b454-4f3a-8772-63554a03ca04",
    "07a7d6b0-7255-434c-b7f6-3f52721a86b4",
    "b2ed16d9-ddad-49f3-b041-c73c49780fd7",
    "11d0ab92-5864-4229-a858-2434e8eca850",
    "2c83d1cf-ee44-47d2-8fc5-9eb4a4b6acfc"
  ],
  faces: [
    "c66ad78c-d7de-4435-9f6e-b54714d64794",
    "3026d0fb-2536-4c92-8c3d-b266fffc84a3",
    "09a0d978-7214-4b5d-b4c9-2eb155239793",
    "c8296e04-fbbb-4337-874d-18c8f36457ff",
    "4c70eecb-39ec-4412-8761-2699b87b784e",
    "0b29ea5f-2c5e-41ef-b8de-5bf247e3845e",
    "dacbb13b-b8f6-4b9a-8a1c-68da54142b5f"
  ],
  mouths: [
    "3eb2907a-cf7a-4017-a539-3ae0348faccb",
    "9de89820-ebd9-47ee-a218-19909159c6f6",
    "5c5956c6-3979-4a46-82b2-ff1c8f46bc16",
    "d264b26b-dd39-42dd-87cf-1cded4771ccb",
    "6ec62bbc-216d-4205-b8fc-8b3b3758f704",
    "7e3ea76b-20aa-48a9-82fe-78ad7b3e6be9"
  ]
};

// Name to UUID mapping for display purposes
export const wearableNameMapping: Record<WearableType, string[]> = {
  backgrounds: [
    "Beach Lighthouse",
    "Big Ben",
    "Burj Khalifa",
    "Christ The Redeemer",
    "Diamond Head Mountain",
    "Eiffel Tower",
    "Grand Palace",
    "Green",
    "Hollywood Sign",
    "Oriental Pearl Tower",
    "Pure Gold",
    "Pyramids of Egypt",
    "Red",
    "St. Basil's Cathedral",
    "Statue of Liberty",
    "Tokyo Tower"
  ],
  bodys: [
    "Aqua Spirit",
    "Blazing Flame",
    "Candy Pink",
    "Crystal",
    "Deep Sea",
    "Golden Glow",
    "Ink Shadow",
    "Orca Wrap"
  ],
  eyes: [
    "Bitcoin Eyes",
    "Curved Smiling Closed Eyes",
    "Dogecoin Logo Eyes",
    "Dollar Sign Eyes",
    "Normal",
    "Pharos Logo Eyes",
    "Single Eye",
    "Yellow Lightning Eyes"
  ],
  hands: [
    "Drink Bottle",
    "Fire",
    "Gold Coin Pouch",
    "Ink Bottle",
    "Lighthouse Model",
    "Lightning",
    "Magic Potion Bottle",
    "Magic Scroll",
    "Magic Wand",
    "Miner's Pickaxe",
    "Pharos Coin",
    "Sea Urchin",
    "Spray Paint Can",
    "Trident"
  ],
  heads: [
    "Aviator Hat",
    "Captain Hat",
    "Cowboy Hat",
    "Crocodile Hat",
    "Crown",
    "Dogecoin Hat",
    "Frog Hat",
    "Miner Helmet",
    "Orca Hat (Full)",
    "Panda Hat",
    "Pirate Bandana",
    "Polar Bear Hat",
    "Sea Lion Hat",
    "Shark Hat",
    "Straw Hat",
    "Unicorn Hat",
    "Wizard Hat"
  ],
  clothes: [
    "Camouflage Outfit",
    "Cloak",
    "Explorer Jacket",
    "Golden Robe",
    "Knight Armor",
    "Miner Outfit",
    "Royal Cape",
    "Tactical Vest",
    "Wizard Robe"
  ],
  faces: [
    "Diving Googles",
    "Gas Mask",
    "Iron Man Mask",
    "LED GMOTCHI",
    "LED GOTCHI",
    "LED PHAROS",
    "Tactical Face Mask"
  ],
  mouths: [
    "Biting a Golden Key",
    "Eating a Fish",
    "Eating a Starfish",
    "Hidden",
    "HODL Tape",
    "Smile"
  ]
};

/**
 * Get wearable image path from R3 storage
 * 
 * @param type - The type of wearable
 * @param index - The index of the wearable in the array
 * @returns The full URL to the wearable image in R3 storage
 */
export const getWearableImagePath = (type: WearableType, index: number): string => {
  const wearables = wearableMapping[type];
  if (index >= 0 && index < wearables.length) {
    const uuid = wearables[index];
    return `https://app.gotchipus.com/metadata/wearables/${type}/${uuid}.png`;
  }
  // Return first item as fallback
  const uuid = wearables[0];
  return `https://app.gotchipus.com/metadata/wearables/${type}/${uuid}.png`;
};

/**
 * Get wearable display name by index
 * 
 * @param type - The type of wearable
 * @param index - The index of the wearable in the array
 * @returns The display name of the wearable
 */
export const getWearableName = (type: WearableType, index: number): string => {
  const names = wearableNameMapping[type];
  if (index >= 0 && index < names.length) {
    return names[index];
  }
  return 'Unknown';
};

/**
 * Get wearable UUID by type and index
 * 
 * @param type - The type of wearable
 * @param index - The index of the wearable in the array
 * @returns The UUID of the wearable
 */
export const getWearableUUID = (type: WearableType, index: number): string => {
  const wearables = wearableMapping[type];
  if (index >= 0 && index < wearables.length) {
    return wearables[index];
  }
  return wearables[0];
};