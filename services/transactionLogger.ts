import { supabase } from '@/lib/supabase'
import { CRYPTOBOT_WALLET_ADDRESS } from '@/lib/cryptobot'

interface LogTransactionParams {
  fromAddress: string
  toAddress: string
  amount: string
  coinType: string
  transactionHash: string
}

function addressToId(address: string): number {
  return parseInt(address.slice(2, 10), 16)
}

export async function logTransaction(params: LogTransactionParams) {
  console.log('📝 Logging transaction to Supabase...', {
    from: params.fromAddress.slice(0, 8),
    to: params.toAddress.slice(0, 8),
    amount: params.amount,
    coinType: params.coinType
  })

  if (!supabase) {
    console.warn('⚠️  Supabase not configured - transaction not logged')
    return null
  }

  const isCryptoBotInvolved = 
    params.fromAddress.toLowerCase() === CRYPTOBOT_WALLET_ADDRESS.toLowerCase() || 
    params.toAddress.toLowerCase() === CRYPTOBOT_WALLET_ADDRESS.toLowerCase()

  if (!isCryptoBotInvolved) {
    console.log('ℹ️  Transaction does not involve CryptoBot - skipping log')
    return null
  }

  try {
    const senderId = addressToId(params.fromAddress)
    const receiverId = addressToId(params.toAddress)
    
    // Generate numeric ID from hash (base64 to numeric)
    const hashBuffer = Buffer.from(params.transactionHash, 'base64')
    const transactionId = hashBuffer.readUInt32BE(0)
    
    const sending = params.fromAddress.toLowerCase() === CRYPTOBOT_WALLET_ADDRESS.toLowerCase()

    console.log('💾 Inserting into ledger_table:', {
      transaction_id: transactionId,
      sender_id: senderId,
      reciever_id: receiverId,
      type: `${params.amount} ${params.coinType}`,
      sending: sending,
      transaction_hash: params.transactionHash
    })

    const { data, error } = await supabase
      .from('ledger_table')
      .insert({
        transaction_id: transactionId,
        sender_id: senderId,
        reciever_id: receiverId,
        type: `${params.amount} ${params.coinType}`,
        sending: sending,
        date: new Date().toISOString(),
        transaction_hash: params.transactionHash,
        from_address: params.fromAddress,
        to_address: params.toAddress
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log('✅ Transaction logged successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Error logging transaction:', error)
    return null
  }
}

export async function getTransactions() {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  const { data, error } = await supabase
    .from('ledger_table')
    .select('*')
    .order('date', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data
}

export async function ensureUser(walletAddress: string) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  return { wallet_address: walletAddress }
}

