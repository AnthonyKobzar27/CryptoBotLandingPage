import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { bech32 } from 'bech32';
import { NextResponse } from 'next/server';
import { sendSUI } from '../../../../scripts/testSend';
// Use Node.js runtime for crypto compatibility
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const res = await sendSUI(
      "",
      "0x3f6bb1bdaaacafd020194d452a5a1afce89114cd5fafa3aebc9b214e83aa2ef2",
      0.001
    );

    return NextResponse.json({
      success: true,
      transactionHash: res?.digest,
      explorerUrl: `https://suiexplorer.com/txblock/${res?.digest}?network=testnet`
    });

  } catch (error) {
    console.error('Transaction failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
