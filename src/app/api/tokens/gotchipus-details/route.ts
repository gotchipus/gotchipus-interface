import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { pharos } from '@/src/app/blockchain/config';
import { GotchipusInfo } from '@/lib/types';

export const runtime = 'edge';

function stringifyBigInts(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(stringifyBigInts);
  }
  if (typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === 'bigint') {
          newObj[key] = value.toString();
        } else {
          newObj[key] = stringifyBigInts(value);
        }
      }
    }
    return newObj;
  }
  return obj;
}

function serializeBigIntFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializeBigIntFields(item));
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigIntFields(value);
    }
    return result;
  }
  
  return obj;
}

function flattenGotchipusInfo(info: any): GotchipusInfo {
  const serialized = stringifyBigInts(info);
  const core = serialized.core || {};
  const faction = serialized.faction || {};
  const serializedDna = serializeBigIntFields(serialized.dna || {});
  const leveling = serialized.leveling || {};

  return {
    name: serialized.name || "",
    uri: serialized.uri || "",
    story: serialized.story || "",
    owner: serialized.owner || "",
    collateral: serialized.collateral || "",
    collateralAmount: serialized.collateralAmount?.toString() || '0',
    level: Number(core.level || 0),
    status: Number(serialized.status || 0),
    evolution: Number(core.evolution || 0),
    locked: Boolean(serialized.locked),
    epoch: Number(serialized.epoch || 0),
    utc: Number(serialized.utc || 0),
    dna: serializedDna,
    strength: Number(core.strength || 0),
    defense: Number(core.defense || 0),
    mind: Number(core.mind || 0),
    vitality: Number(core.vitality || 0),
    agility: Number(core.agility || 0),
    luck: Number(core.luck || 0),
    singer: serialized.singer || "",
    nonces: serialized.nonces?.toString() || '0',
    element: serialized.element ? Number(serialized.element) : undefined,
    primaryFaction: Number(faction.primaryFaction ?? 0),
    currentExp: Number(leveling.currentExp ?? 0),     
    requiredExp: Number(leveling.requiredExp ?? 0),    
    totalExp: Number(leveling.totalExp ?? 0),       
    battleExp: Number(leveling.battleExp ?? 0),      
    buildingExp: Number(leveling.buildingExp ?? 0),    
    interactionExp: Number(leveling.interactionExp ?? 0), 
    questExp: Number(leveling.questExp ?? 0),       
    expMultiplier: Number(leveling.expMultiplier ?? 0),
    lastExpGain: Number(leveling.lastExpGain ?? 0),    
  };
}

const publicClient = createPublicClient({ chain: pharos, transport: http(process.env.NEXT_PUBLIC_TESTNET_RPC!) });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');
    const tokenId = searchParams.get('tokenId');

    if (!ownerAddress || !isAddress(ownerAddress)) return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    if (!tokenId) return NextResponse.json({ error: 'tokenId is required' }, { status: 400 });

    const selectedTokenId = BigInt(tokenId);

    const [info, tokenBoundAccount, tokenName] = await Promise.all([
      publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'ownedTokenInfo', args: [ownerAddress, selectedTokenId] }).catch(() => null),
      publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'account', args: [selectedTokenId] }).catch(() => null),
      publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'getTokenName', args: [selectedTokenId] }).catch(() => null),
    ]);

    if (!info) {
        return NextResponse.json({ error: 'Token info not found' }, { status: 404 });
    }
    
    const flattenedInfo = flattenGotchipusInfo(info);

    const responseData = {
      info: flattenedInfo,
      tokenBoundAccount,
      tokenName
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API Error (gotchipus-details):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}