import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchipusInfo } from '@/lib/types';
import { pharos } from '@/src/app/blockchain/config';

interface PharosResponse {
  balance: string;
  ids: string[];
  pharosInfo: GotchipusInfo[];
  totalCount: number;
}

export const runtime = 'edge';

const rpcUrl = process.env.NEXT_PUBLIC_TESTNET_RPC;

const publicClient = createPublicClient({
  chain: pharos,
  transport: http(rpcUrl),
});

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
    singer: info.singer || "",
    nonces: info.nonces?.toString() || '0',
    element: info.element ? Number(info.element) : undefined,
    strength: Number(info.strength || 0),
    defense: Number(info.defense || 0),
    mind: Number(info.mind || 0),
    vitality: Number(info.vitality || 0),
    agility: Number(info.agility || 0),
    luck: Number(info.luck || 0),
    primaryFaction: Number(info.primaryFaction || 0),
  };
}

async function getPharosTokens(ownerAddress: string, includePharosInfo: boolean): Promise<PharosResponse> {
  try {
    const tokenIds = await publicClient.readContract({
      address: PUS_ADDRESS,
      abi: PUS_ABI,
      functionName: 'getGotchiOrPharosInfo',
      args: [ownerAddress, 0]
    }) as bigint[];

    if (!tokenIds || tokenIds.length === 0) {
      return {
        balance: '0',
        ids: [],
        pharosInfo: [],
        totalCount: 0
      };
    }

    const balance = tokenIds.length.toString();
    const ids = tokenIds.map(id => id.toString());
        
    let pharosInfo: GotchipusInfo[] = [];
    
    if (includePharosInfo) {
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
      pharosInfo = infoResults.filter(info => info !== null) as GotchipusInfo[];
    }

    return {
      balance,
      ids,
      pharosInfo,
      totalCount: ids.length
    };
  } catch (error: any) {
    console.error('Error calling getGotchiOrPharosInfo for pharos:', error);
    if (error.message?.includes('execution reverted')) {
      return {
        balance: '0',
        ids: [],
        pharosInfo: [],
        totalCount: 0
      };
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');
    const includePharosInfo = searchParams.get('includePharosInfo') !== 'false';
    const format = searchParams.get('format') || 'full'; 

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const response = await getPharosTokens(ownerAddress, includePharosInfo);

    if (format === 'simple') {
      return NextResponse.json(response.ids, { status: 200 });
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('API Error (pharos-list):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}