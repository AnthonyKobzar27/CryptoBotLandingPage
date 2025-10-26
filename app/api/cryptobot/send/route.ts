import { NextResponse } from 'next/server';
import { sendSUI } from '../../../../scripts/testSend';
// Use Node.js runtime for crypto compatibility
export const runtime = 'nodejs';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../../.env.local' , override: true });

export async function POST(request: Request) {
  try {
    const priv = process.env.CRYPTOBOT_PRIVATE_KEY;
    const res = await sendSUI(
      priv,
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
