import type { JSX } from "react"
import { ethers } from "ethers";

// Gotchi Metadata from Database (matches gotchi_metadata table)
export interface GotchiMetadata {
  // Primary Key & Identifiers
  id: number;
  token_id: number;

  // Basic Info
  name?: string;
  uri?: string;
  story?: string; // BYTEA decoded as string
  owner?: string;
  collateral?: string;
  collateral_amount?: string;
  status: number;
  locked: boolean;
  birth_time?: number;
  timezone?: number;

  // Core Attributes
  core_level: number;
  core_evolution: number;
  core_experience: number;
  core_available_points: number;
  core_strength: number;
  core_defense: number;
  core_mind: number;
  core_vitality: number;
  core_agility: number;
  core_luck: number;

  // Faction
  faction_primary?: number;
  faction_purity: number;
  faction_has_secondary: boolean;

  // Leveling
  leveling_total_exp: number;

  // Computed Fields
  total_stats: number;
  is_evolved: boolean;

  // JSONB Data
  soul_data?: Record<string, any>;
  faction_data?: Record<string, any>;
  spec_data?: Record<string, any>;
  strategy_data?: Record<string, any>;
  evolution_data?: Record<string, any>;
  leveling_data?: Record<string, any>;
  dynamic_states?: Record<string, any>;
  dna_data?: Record<string, any>;

  // ERC6551
  singer?: string;
  nonces?: string;

  // Metadata
  created_at?: string;
  updated_at?: string;
  synced_at?: string;
  block_number?: number;

  // Equipped wearables (array from API)
  all_equip?: Array<{
    equipped: boolean;
    wearable_id: string;
    wearable_type: string;
  }>;
}

export interface WindowType {
  id: string
  title: string
  icon?: string
  content: JSX.Element
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  minimized: boolean
}

export interface DesktopIconProps {
  id: string
  title: string
  icon: string
  onClick: () => void
  isActive: boolean
  isMobile?: boolean
}

export interface TokenInfo {
  strength?: number;
  defense?: number;
  mind?: number;
  vitality?: number;
  agility?: number;
  luck?: number;
  status?: number;
  dna?: {
    geneSeed: string;
    ruleVersion: string;
  };
}


export interface GotchipusInfo {
  name: string;
  uri: string;
  story: string; 
  owner: string;
  collateral: string;
  collateralAmount: string;
  level: number;
  status: number;
  evolution: number;
  locked: boolean;
  epoch: number;
  utc: number;
  dna: any; 
  strength: number;
  defense: number;
  mind: number;
  vitality: number;
  agility: number;
  luck: number;
  singer: string;
  nonces: string;
  element?: number;
  primaryFaction?: number;
  currentExp?: number;
  requiredExp?: number;
  totalExp?: number;
  battleExp?: number;
  buildingExp?: number;
  interactionExp?: number;
  questExp?: number;
  expMultiplier?: number;
  lastExpGain?: number;
}

export interface GotchiItem {
  id: string;
  info?: GotchipusInfo;
}


export function safeDecodeUtf8(bytesData: string | Uint8Array): string {
  try {
    let byteArr: Uint8Array;

    if (typeof bytesData === "string") {
      let hex = bytesData.trim();

      if (!hex.startsWith("0x") && /^[0-9a-fA-F]+$/.test(hex)) {
        hex = "0x" + hex;
      }

      if (!hex.startsWith("0x")) {
        return "";
      }

      byteArr = ethers.getBytes(hex);
    }
    else if (bytesData instanceof Uint8Array) {
      byteArr = bytesData;
    }
    else {
      return "";
    }

    const decoder = new TextDecoder("utf-8", { fatal: false });
    return decoder.decode(byteArr);
  } catch (err) {
    console.error("safeDecodeUtf8 failed", err);
    return "";
  }
}

export function parseGotchipusInfo(rawData: any): GotchipusInfo | undefined {
  if (!rawData) return undefined;
  
  try {
    if (!rawData.result) {
      return undefined;
    }
    
    const result = rawData.result;
    
    if (result.name === undefined || result.status === undefined) {
      return undefined;
    }

    return {
      name: result.name || "",
      uri: result.uri || "",
      story: result.story || "",
      owner: result.owner || "",
      collateral: result.collateral || "",
      collateralAmount: (result.collateralAmount || BigInt(0)).toString(),
      level: Number(result.level || 0),
      status: Number(result.status || 0),
      evolution: Number(result.evolution || 0),
      locked: Boolean(result.locked),
      epoch: Number(result.epoch || 0),
      utc: Number(result.utc || 0),
      dna: result.dna || {},
      strength: Number(result.strength || 0),
      defense: Number(result.defense || 0),
      mind: Number(result.mind || 0),
      vitality: Number(result.vitality || 0),
      agility: Number(result.agility || 0),
      luck: Number(result.luck || 0),
      singer: result.singer || "",
      nonces: (result.nonces || BigInt(0)).toString()
    };
  } catch (error) {
    console.error("error::", error);
    return undefined;
  }
}

export interface NftParts {
  background?: number;
  body?: number;
  clothes?: number;
  head?: number;
  eye?: number;
  hand?: number;
}

export interface EquipWearableType {
  wearableType: string;
  wearableId: number;
  equiped: boolean;
}

export interface WearableDefinition {
  id: number;
  name: string;
  svg: string;
}

export interface Token {
  name: string;
  icon: string;
  symbol: string;
  contract: string;
  balance?: string;
  decimals: number;
  popular?: boolean;
}