import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchipusInfo } from '@/lib/types';
import { pharos } from '@/src/app/blockchain/config';

export const runtime = 'edge';

const rpcUrl = process.env.NEXT_PUBLIC_ZAN_RPC;

const publicClient = createPublicClient({
  chain: pharos,
  transport: http(rpcUrl),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const allTokenIds = await publicClient.readContract({
      address: PUS_ADDRESS,
      abi: PUS_ABI,
      functionName: 'allTokensOfOwner',
      args: [ownerAddress],
    });

    const tokenIds = allTokenIds as bigint[]; 

    if (!tokenIds || tokenIds.length === 0) {
      return NextResponse.json([], { status: 200 }); 
    }

    const promises = tokenIds.map(id => 
      publicClient.readContract({
        address: PUS_ADDRESS,
        abi: PUS_ABI,
        functionName: 'ownedTokenInfo',
        args: [ownerAddress, id],
      }).catch(err => {
        console.error(`Get token ID ${id} info failed:`, err);
        return null;
      })
    );

    const results = await Promise.all(promises);

    const validTokenIds: string[] = [];
    results.forEach((info, index) => {
      if (info && (info as GotchipusInfo).status === 0) {
        validTokenIds.push(tokenIds[index].toString());
      }
    });

    return NextResponse.json(validTokenIds, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}