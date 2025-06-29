import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchipusInfo } from '@/lib/types';
import { pharos } from '@/src/app/blockchain/config';

export const runtime = 'edge';

const rpcUrl = process.env.NEXT_PUBLIC_TESTNET_RPC;
const publicClient = createPublicClient({ chain: pharos, transport: http(rpcUrl) });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const balanceResult = await publicClient.readContract({
      address: PUS_ADDRESS,
      abi: PUS_ABI,
      functionName: 'balanceOf',
      args: [ownerAddress]
    }).catch(() => BigInt(-1));

    if (balanceResult === BigInt(-1)) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Failed to fetch balance' }, { status: 503 });
    }

    const allTokenIdsResult = await publicClient.readContract({
      address: PUS_ADDRESS,
      abi: PUS_ABI,
      functionName: 'allTokensOfOwner',
      args: [ownerAddress]
    }).catch(() => null);

    if (allTokenIdsResult === null && (balanceResult as bigint) > 0) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Inconsistent data from RPC' }, { status: 503 });
    }

    const tokenIds = (allTokenIdsResult || []) as bigint[];
    
    if (tokenIds.length === 0) {
      if ((balanceResult as bigint) > 0) {
        return NextResponse.json({ message: 'RPC Service Unavailable', error: 'Inconsistent data from RPC' }, { status: 503 });
      }
      return NextResponse.json({ balance: (balanceResult as bigint).toString(), filteredIds: [] });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DEVELOPMENT_URL}/images/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({ ids: tokenIds.map(id => id.toString()) }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    const imageStatusMap = new Map<number, boolean>();
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((item: any) => {
        imageStatusMap.set(Number(item.id), item.status);
      });
    } 
    
    const tokenIdsWithImage = tokenIds.filter(id => imageStatusMap.get(Number(id)) === true);
    const tokenIdsWithoutImage = tokenIds.filter(id => imageStatusMap.get(Number(id)) !== true);
    
    let filteredIdsFromContract: string[] = [];
    
    if (tokenIdsWithoutImage.length > 0) {
      const infoPromises = tokenIdsWithoutImage.map(id => 
        publicClient.readContract({ 
          address: PUS_ADDRESS, 
          abi: PUS_ABI, 
          functionName: 'ownedTokenInfo', 
          args: [ownerAddress, id] 
        }).catch(() => null)
      );
      
      const infoResults = await Promise.all(infoPromises);

      filteredIdsFromContract = infoResults
        .map((info, index) => ({ info, id: tokenIdsWithoutImage[index] }))
        .filter(item => item.info && (item.info as GotchipusInfo).status === 1) 
        .map(item => item.id.toString());
    }
    
    const existingImageTokenIds = tokenIdsWithImage.map(id => id.toString());   
    const finalFilteredIds = [...existingImageTokenIds, ...filteredIdsFromContract];
    const sortedFilteredIds = finalFilteredIds.sort((a, b) => parseInt(a) - parseInt(b));

    return NextResponse.json({ 
      balance: (balanceResult as bigint).toString(), 
      filteredIds: sortedFilteredIds,
    });

  } catch (error: any) {
    console.error('API Error (gotchipus-list):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}