import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SuiClient } from '@mysten/sui.js/client'

let robotKeypair: Ed25519Keypair | null = null

export function initializeRobotSigner(): Ed25519Keypair | null {
  if (robotKeypair) {
    return robotKeypair
  }

  const privateKey = process.env.CRYPTOBOT_PRIVATE_KEY
  
  if (!privateKey) {

    return null
  }

  try {
    robotKeypair = Ed25519Keypair.fromSecretKey(privateKey as any)
    return robotKeypair
  } catch (error) {

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
    const result = await suiClient.signAndExecuteTransactionBlock({
      signer,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
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

