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

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const [balanceResult, allTokenIdsResult] = await Promise.all([
      publicClient.readContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: 'balanceOf',
        args: [ownerAddress]
      }).catch(() => BigInt(-1)),
      publicClient.readContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: 'allTokensOfOwner',
        args: [ownerAddress]
      }).catch(() => null)
    ]);

    if (balanceResult === BigInt(-1)) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Failed to fetch balance' }, { status: 503 });
    }

    if (allTokenIdsResult === null && (balanceResult as bigint) > 0) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Inconsistent data from RPC' }, { status: 503 });
    }

    const tokenIds = (allTokenIdsResult || []) as bigint[];
    const balance = (balanceResult as bigint).toString();
    
    if (tokenIds.length === 0) {
      if ((balanceResult as bigint) > 0) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Inconsistent data from RPC' }, { status: 503 });
      }
      const emptyResponse: GotchipusResponse = {
        balance,
        ids: [],
        gotchipusInfo: [],
        totalCount: 0
      };
      return NextResponse.json(emptyResponse);
    }

    const [imageCheckResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/images/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ ids: tokenIds.map(id => id.toString()) }),
      })
    ]);

    if (!imageCheckResponse.ok) {
      throw new Error(`Image check API responded with status: ${imageCheckResponse.status}`);
    }

    const imageData = await imageCheckResponse.json();

    const imageStatusMap = new Map<number, boolean>();
    if (imageData.data && Array.isArray(imageData.data)) {
      imageData.data.forEach((item: any) => {
        imageStatusMap.set(Number(item.id), item.status);
      });
    } 
    
    const tokenIdsWithImage = tokenIds.filter(id => imageStatusMap.get(Number(id)) === true);
    const tokenIdsWithoutImage = tokenIds.filter(id => imageStatusMap.get(Number(id)) !== true);
    
    let validTokensFromContract: Array<{ id: string; info: GotchipusInfo | null }> = [];

    if (tokenIdsWithoutImage.length > 0) {
      const infoPromises = tokenIdsWithoutImage.map(async (id) => {
        try {
          const info = await publicClient.readContract({ 
            address: PUS_ADDRESS, 
            abi: PUS_ABI, 
            functionName: 'ownedTokenInfo', 
            args: [ownerAddress, id] 
          }) as any;
          
          return { id: id.toString(), info: serializeGotchipusInfo(info) };
        } catch {
          return { id: id.toString(), info: null };
        }
      });
      
      const infoResults = await Promise.all(infoPromises);
      validTokensFromContract = infoResults.filter(item => 
        item.info && item.info.status === 1
      );
    }
    
    const allValidTokensWithInfo: Array<{ id: string; info: GotchipusInfo | null }> = [];
    
    const existingTokenInfoPromises = tokenIdsWithImage.map(async (id) => {
      try {
        const info = await publicClient.readContract({ 
          address: PUS_ADDRESS, 
          abi: PUS_ABI, 
          functionName: 'ownedTokenInfo', 
          args: [ownerAddress, id] 
        }) as any;
        
        return { id: id.toString(), info: serializeGotchipusInfo(info) };
      } catch {
        return { id: id.toString(), info: null };
      }
    });
    
    const existingTokensWithInfo = await Promise.all(existingTokenInfoPromises);
    
    const validExistingTokens = existingTokensWithInfo.filter(item => item.info !== null);
    allValidTokensWithInfo.push(...validExistingTokens);
    allValidTokensWithInfo.push(...validTokensFromContract);
    
    allValidTokensWithInfo.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    
    const sortedIds = allValidTokensWithInfo.map(item => item.id);
    const allGotchipusInfo = allValidTokensWithInfo.map(item => item.info) as GotchipusInfo[];

    const response: GotchipusResponse = {
      balance,
      ids: sortedIds,
      gotchipusInfo: allGotchipusInfo,
      totalCount: sortedIds.length
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('API Error (gotchipus-list):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}