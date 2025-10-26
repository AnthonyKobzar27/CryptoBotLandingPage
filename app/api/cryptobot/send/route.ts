import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SuiClient } from '@mysten/sui.js/client'
import { bech32 } from 'bech32'
import { logTransaction } from '@/services/transactionLogger'
import { sendSUI } from '@/scripts/testSend'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' , override: true });


const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' })


export async function POST(request: NextRequest) {
  try {
    const { recipient, amount } = await request.json()


    if (!recipient || !amount) {
      return NextResponse.json(
        { error: 'Recipient and amount required' },
        { status: 400 }
      )
    }


    console.log('🚀 Starting transaction:', { recipient, amount })


    const privateKey = process.env.CRYPTOBOT_PRIVATE_KEY
    console.log('🔑 Private key:', privateKey)


    const result = await sendSUI(privateKey, recipient, amount)


    // Log to Supabase
    await logTransaction({
      fromAddress: 'CryptoBot',
      toAddress: recipient,
      amount: amount,
      coinType: 'SUI',
      transactionHash: '0x123'
    })


    return NextResponse.json({
      success: true,
      digest: '0x123',
      from: 'CryptoBot',
      to: recipient,
      amount: amount,
      explorer: `https://suiexplorer.com/txblock/?network=testnet`
    })


  } catch (error: any) {
    console.error('❌ Transaction failed:', error)
    return NextResponse.json(
      {
        error: error.message || 'Transaction failed',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
