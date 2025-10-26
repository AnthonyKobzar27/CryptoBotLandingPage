'use client'

import { useState, useEffect } from 'react'
import { CRYPTOBOT_WALLET_ADDRESS } from '@/lib/cryptobot'

export function RobotDashboard() {
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const fetchBalance = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/robot/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'balance' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBalance(data.data.balance)
      } else {
        setMessage('Failed to fetch balance')
      }
    } catch (error) {
      setMessage('Error fetching balance')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  return (
    <div className="border border-black p-6">
      <h2 className="text-2xl font-light text-black mb-4">
        CryptoBot Status
      </h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-black/40 mb-1">Wallet Address</p>
          <p className="text-sm text-black font-mono break-all">
            {CRYPTOBOT_WALLET_ADDRESS || 'Not configured'}
          </p>
        </div>

        <div>
          <p className="text-xs text-black/40 mb-1">Current Balance</p>
          <p className="text-2xl text-black font-light">
            {isLoading ? 'Loading...' : balance ? `${balance} SUI` : '0 SUI'}
          </p>
        </div>

        <button
          onClick={fetchBalance}
          disabled={isLoading}
          className="px-4 py-2 text-sm text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Balance'}
        </button>

        {message && (
          <p className="text-sm text-black/60">{message}</p>
        )}

        <div className="pt-4 border-t border-black/10">
          <p className="text-xs text-black/40">
            ✅ Autonomous signing enabled
          </p>
        </div>
      </div>
    </div>
  )
}

