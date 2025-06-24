import { type NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, isAddress } from 'viem';
import { PUS_ABI, PUS_ADDRESS } from '@/src/app/blockchain';
import { pharos } from '@/src/app/blockchain/config';

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

const publicClient = createPublicClient({ chain: pharos, transport: http(process.env.NEXT_PUBLIC_ZAN_RPC!) });

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

    const responseData = {
      info: stringifyBigInts(info),
      tokenBoundAccount,
      tokenName
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('API Error (gotchipus-details):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}