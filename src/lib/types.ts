import type { JSX } from "react"
import { ethers } from "ethers";

export interface WindowType {
  id: string
  title: string
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
}

export interface TokenInfo {
  aether?: number;
  bonding?: number;
  growth?: number;
  element?: number;
  wisdom?: number;
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
  collateralAmount: bigint;
  level: number;
  status: number;
  evolution: number;
  locked: boolean;
  epoch: number;
  utc: number;
  dna: any; 
  bonding: number;
  growth: number;
  wisdom: number;
  aether: number;
  singer: string;
  nonces: bigint;
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
      collateralAmount: BigInt(result.collateralAmount || 0),
      level: Number(result.level || 0),
      status: Number(result.status || 0),
      evolution: Number(result.evolution || 0),
      locked: Boolean(result.locked),
      epoch: Number(result.epoch || 0),
      utc: Number(result.utc || 0),
      dna: result.dna || {},
      bonding: Number(result.bonding || 0),
      growth: Number(result.growth || 0),
      wisdom: Number(result.wisdom || 0),
      aether: Number(result.aether || 0),
      singer: result.singer || "",
      nonces: BigInt(result.nonces || 0)
    };
  } catch (error) {
    console.error("error::", error);
    return undefined;
  }
}