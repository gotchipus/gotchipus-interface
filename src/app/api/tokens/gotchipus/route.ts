import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchipusInfo } from '@/lib/types';
import { pharos } from '@/src/app/blockchain/config';

interface GotchipusResponse {
  balance: string;
  ids: string[];
  gotchipusInfo: GotchipusInfo[];
  totalCount: number;
}

export const runtime = 'edge';

const rpcUrl = process.env.NEXT_PUBLIC_TESTNET_RPC;
const publicClient = createPublicClient({ chain: pharos, transport: http(rpcUrl) });

async function getGotchipusTokens(ownerAddress: string, includeGotchipusInfo: boolean): Promise<GotchipusResponse> {
  try {
    const tokenIds = await publicClient.readContract({
      address: PUS_ADDRESS,
      abi: PUS_ABI,
      functionName: 'getGotchiOrPharosInfo',
      args: [ownerAddress, 1]
    }) as bigint[];

    if (!tokenIds || tokenIds.length === 0) {
      return {
        balance: '0',
        ids: [],
        gotchipusInfo: [],
        totalCount: 0
      };
    }

    const balance = tokenIds.length.toString();
    const ids = tokenIds.map(id => id.toString());
    
    let gotchipusInfo: GotchipusInfo[] = [];
    
    if (includeGotchipusInfo) {
      const infoPromises = tokenIds.map(async (tokenId) => {
        try {
          const info = await publicClient.readContract({
            address: PUS_ADDRESS,
            abi: PUS_ABI,
            functionName: 'ownedTokenInfo',
            args: [ownerAddress, tokenId]
          }) as any;
          
          return serializeGotchipusInfo(info);
        } catch (error) {
          console.error(`Error fetching info for token ${tokenId}:`, error);
          return null;
        }
      });
      
      const infoResults = await Promise.all(infoPromises);
      gotchipusInfo = infoResults.filter(info => info !== null) as GotchipusInfo[];
    }

    return {
      balance,
      ids,
      gotchipusInfo,
      totalCount: ids.length
    };
  } catch (error: any) {
    console.error('Error calling getGotchiOrPharosInfo:', error);
    if (error.message?.includes('execution reverted')) {
      return {
        balance: '0',
        ids: [],
        gotchipusInfo: [],
        totalCount: 0
      };
    }
    throw error;
  }
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

function serializeGotchipusInfo(info: any): GotchipusInfo {
  const serializedDna = serializeBigIntFields(info.dna || {});
  
  return {
    name: info.name || "",
    uri: info.uri || "",
    story: info.story || "",
    owner: info.owner || "",
    collateral: info.collateral || "",
    collateralAmount: info.collateralAmount?.toString() || '0',
    level: Number(info.level || 0),
    status: Number(info.status || 0),
    evolution: Number(info.evolution || 0),
    locked: Boolean(info.locked),
    epoch: Number(info.epoch || 0),
    utc: Number(info.utc || 0),
    dna: serializedDna,
    bonding: Number(info.bonding || 0),
    growth: Number(info.growth || 0),
    wisdom: Number(info.wisdom || 0),
    aether: Number(info.aether || 0),
    singer: info.singer || "",
    nonces: info.nonces?.toString() || '0',
    element: info.element ? Number(info.element) : undefined
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');
    const includeGotchipusInfo = searchParams.get('includeGotchipusInfo') !== 'false';

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const response = await getGotchipusTokens(ownerAddress, includeGotchipusInfo);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API Error (gotchipus-list):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}