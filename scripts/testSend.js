import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { bech32 } from 'bech32';
import dotenv from 'dotenv';

export async function sendSUI(pk, myrec, myam) {
  let privateKey = pk;
  const decoded = bech32.decode(privateKey);
  const bytes = Buffer.from(bech32.fromWords(decoded.words));
  privateKey = bytes.subarray(1);
  try {
    const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io:443' })

    console.log('🔑 Initializing CryptoBot signer...')
    const keypair = Ed25519Keypair.fromSecretKey(privateKey)
    const address = keypair.getPublicKey().toSuiAddress()

    const tx = new TransactionBlock()
    const amount = BigInt(Math.floor(myam * 1_000_000_000)) // 0.001 SUI in MIST
    const recipient = myrec;

    // Split coins and send
    console.log('💰 Preparing to send', amount.toString(), 'MIST to', recipient)
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount.toString())])
    tx.transferObjects([coin], tx.pure(recipient))

    // Execute transaction
    console.log('📤 Executing transaction...')
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    })

    console.log('✅ Transaction successful!')
    console.log('📝 Transaction hash:', result.digest)
    console.log('🔗 View on Explorer:', `https://suiexplorer.com/txblock/${result.digest}?network=testnet`)
    return result
  } catch (error) {
    console.error('❌ Transaction failed:', error)
  }
}

// Run the test
sendSUI(
  "suiprivkey1qryc3tj980ke0250jwm479fcncgelh3flu68pvke5ggyactdglkeqwjhayx",
  "0x3f6bb1bdaaacafd020194d452a5a1afce89114cd5fafa3aebc9b214e83aa2ef2",
  0.001
)
