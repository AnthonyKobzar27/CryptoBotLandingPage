import { NextRequest, NextResponse } from 'next/server'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SuiClient } from '@mysten/sui.js/client'
import { signAndExecuteTransaction, getRobotAddress } from '@/lib/robotSigner'
import { logTransaction } from '@/services/transactionLogger'

const suiClient = new SuiClient({ 
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443' 
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, recipient, amount, coinType = 'SUI' } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      )
    }

    const robotAddress = getRobotAddress()
    if (!robotAddress) {
      return NextResponse.json(
        { error: 'CryptoBot not configured' },
        { status: 500 }
      )
    }

    let result

    switch (action) {
      case 'send':
        if (!recipient || !amount) {
          return NextResponse.json(
            { error: 'Recipient and amount required' },
            { status: 400 }
          )
        }

        // Validate recipient address
        if (!recipient.startsWith('0x') || recipient.length !== 66) {
          return NextResponse.json(
            { error: 'Invalid recipient address. Must be a valid SUI address starting with 0x' },
            { status: 400 }
          )
        }

        // Validate amount
        const amountNum = parseFloat(amount)
        if (isNaN(amountNum) || amountNum <= 0 || amountNum < 0.000001) {
          return NextResponse.json(
            { error: 'Invalid amount. Must be greater than 0.000001 SUI' },
            { status: 400 }
          )
        }

        result = await executeSendTransaction(recipient, amount)
        break

      case 'balance':
        result = await getBalance()
        break

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Transaction failed' },
      { status: 500 }
    )
  }
}

async function executeSendTransaction(recipient: string, amount: string) {
  const robotAddress = getRobotAddress()
  const tx = new TransactionBlock()

  // Convert amount to MIST (1 SUI = 1_000_000_000 MIST)
  const amountInMist = BigInt(Math.floor(parseFloat(amount) * 1_000_000_000))
  
  const [coin] = tx.splitCoins(tx.gas, [
    tx.pure(amountInMist.toString())
  ])
  tx.transferObjects([coin], tx.pure(recipient))

  const result = await signAndExecuteTransaction(tx, suiClient)

  await logTransaction({
    fromAddress: robotAddress,
    toAddress: recipient,
    amount: amount,
    coinType: 'SUI',
    transactionHash: result.digest
  })

  return {
    digest: result.digest,
    from: robotAddress,
    to: recipient,
    amount: amount,
    status: 'completed'
  }
}

async function getBalance() {
  const robotAddress = getRobotAddress()
  
  const balance = await suiClient.getBalance({
    owner: robotAddress,
    coinType: '0x2::sui::SUI'
  })

  return {
    address: robotAddress,
    balance: (parseInt(balance.totalBalance) / 1_000_000_000).toString(),
    coinType: 'SUI'
  }
}

