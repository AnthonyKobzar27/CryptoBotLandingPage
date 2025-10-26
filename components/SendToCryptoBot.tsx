'use client'

import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { CRYPTOBOT_WALLET_ADDRESS } from '@/lib/cryptobot'
import { logTransaction } from '@/services/transactionLogger'

export function SendToCryptoBot() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const account = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const handleSend = async () => {
    if (!account) {
      setMessage('Please connect your wallet first')
      return
    }

    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setMessage('Please enter a valid amount (e.g. 0.001)')
      return
    }

    if (amountNum < 0.000001) {
      setMessage('Minimum amount is 0.000001 SUI')
      return
    }

    if (!CRYPTOBOT_WALLET_ADDRESS) {
      setMessage('CryptoBot wallet not configured')
      return
    }

    setIsLoading(true)
    setMessage(`Sending ${amount} SUI to CryptoBot...`)

    try {
      const tx = new Transaction()
      const amountInMist = Math.floor(amountNum * 1_000_000_000)
      
      const [coin] = tx.splitCoins(tx.gas, [amountInMist])
      tx.transferObjects([coin], CRYPTOBOT_WALLET_ADDRESS)

      signAndExecute(
        {
          transaction: tx as any,
        },
        {
          onSuccess: async (result) => {
            console.log('✅ Transaction successful:', result.digest)
            
            try {
              await logTransaction({
                fromAddress: account.address,
                toAddress: CRYPTOBOT_WALLET_ADDRESS,
                amount: amount,
                coinType: 'SUI',
                transactionHash: result.digest
              })
              console.log('Transaction logged to Supabase')
            } catch (logError) {
              console.error('Failed to log transaction:', logError)
            }

            setMessage(`Success! Sent ${amount} SUI to CryptoBot`)
            setAmount('')
            setIsLoading(false)
            
            setTimeout(() => setMessage(''), 5000)
          },
          onError: (error: any) => {
            console.error('Transaction failed:', error)
            setMessage(`Transaction failed: ${error.message || 'Unknown error'}`)
            setIsLoading(false)
          }
        }
      )
    } catch (error: any) {
      console.error('Error creating transaction:', error)
      setMessage(`Error: ${error.message || 'Failed to create transaction'}`)
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <div className="border border-black p-6">
        <p className="text-black/60 font-light">
          Connect your wallet to send assets to CryptoBot
        </p>
      </div>
    )
  }

  return (
    <div className="border border-black p-6">
      <h2 className="text-2xl font-light text-black mb-4">
        Send to CryptoBot
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-black/60 mb-2">Amount (SUI)</label>
          <input
            type="number"
            step="0.000001"
            min="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            className="w-full px-4 py-2 border border-black focus:outline-none focus:ring-1 focus:ring-black font-mono"
            disabled={isLoading}
          />
          <p className="text-xs text-black/40 mt-1">
            Min: 0.000001 SUI • Example: 0.001, 0.5, 1.234
          </p>
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || !amount}
          className="w-full px-6 py-3 text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('successful') ? 'text-black' : 'text-black/60'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

