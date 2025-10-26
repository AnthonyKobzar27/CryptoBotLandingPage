import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SuiClient } from '@mysten/sui.js/client'

let robotKeypair: Ed25519Keypair | null = null

export function initializeRobotSigner(): Ed25519Keypair | null {
  if (robotKeypair) {
    return robotKeypair
  }

  console.log('🔍 Checking for CryptoBot private key...')
  const privateKey = process.env.CRYPTOBOT_PRIVATE_KEY
  
  if (!privateKey) {
    console.error('❌ CRYPTOBOT_PRIVATE_KEY not found in environment')
    console.error('📝 Make sure .env.local exists in robotdapp folder')
    console.error('🔄 Restart dev server after adding environment variables')
    return null
  }

  try {
    robotKeypair = Ed25519Keypair.fromSecretKey(privateKey as any)
    console.log('✅ CryptoBot signer initialized successfully')
    return robotKeypair
  } catch (error) {
    console.error('❌ Error initializing CryptoBot signer:', error)
    console.error('💡 Run: node scripts/generateRobotWallet.js to get correct format')
    return null
  }
}

export function getRobotSigner(): Ed25519Keypair | null {
  if (!robotKeypair) {
    return initializeRobotSigner()
  }
  return robotKeypair
}

export async function signAndExecuteTransaction(
  tx: TransactionBlock,
  suiClient: SuiClient
): Promise<any> {
  const signer = getRobotSigner()
  
  if (!signer) {
    throw new Error('CryptoBot signer not available')
  }

  try {
    console.log('🔑 Signing transaction with CryptoBot signer...')
    console.log('📝 Transaction details:', {
      signer: signer.getPublicKey().toSuiAddress(),
      gas: tx.gas ? tx.gas.toString() : 'undefined'
    })

    const result = await suiClient.signAndExecuteTransactionBlock({
      signer,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    })
    
    console.log('✅ Transaction signed and executed:', {
      digest: result.digest,
      effects: result.effects
    })
    
    return result
  } catch (error) {
    throw error
  }
}

export function getRobotAddress(): string {
  const signer = getRobotSigner()
  if (!signer) {
    return process.env.NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS || ''
  }
  return signer.getPublicKey().toSuiAddress()
}

