import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { GotchipusInfo } from '@/lib/types';
import { pharos } from '@/src/app/blockchain/config';

export const runtime = 'edge';

const rpcUrl = process.env.NEXT_PUBLIC_ZAN_RPC;
const publicClient = createPublicClient({ chain: pharos, transport: http(rpcUrl) });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('owner');

    if (!ownerAddress || !isAddress(ownerAddress)) {
      return NextResponse.json({ error: 'Valid owner address is required' }, { status: 400 });
    }

    const [balanceResult, allTokenIdsResult] = await Promise.all([
      publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'balanceOf', args: [ownerAddress] }).catch(() => BigInt(0)),
      publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'allTokensOfOwner', args: [ownerAddress] }).catch(() => [])
    ]) as [bigint, bigint[]];

    const tokenIds = (allTokenIdsResult || []) as bigint[];
    
    if (tokenIds.length === 0) {
      return NextResponse.json({ balance: balanceResult.toString(), filteredIds: [] });
    }

    const infoPromises = tokenIds.map(id => 
        publicClient.readContract({ address: PUS_ADDRESS, abi: PUS_ABI, functionName: 'ownedTokenInfo', args: [ownerAddress, id] }).catch(() => null)
    );
    const infoResults = await Promise.all(infoPromises);

    const filteredIds = infoResults
      .map((info, index) => ({ info, id: tokenIds[index] }))
      .filter(item => item.info && (item.info as GotchipusInfo).status === 1) 
      .map(item => item.id.toString());
      
    return NextResponse.json({ balance: balanceResult.toString(), filteredIds });

  } catch (error: any) {
    console.error('API Error (gotchipus-list):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}