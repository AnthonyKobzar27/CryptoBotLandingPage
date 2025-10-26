'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/Header"
import { getTransactions } from '@/services/transactionLogger'
import { LedgerEntry } from '@/lib/supabase'

export default function Ledger() {
  const [transactions, setTransactions] = useState<LedgerEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTransactions()
    const interval = setInterval(loadTransactions, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadTransactions = async () => {
    console.log('🔄 Loading transactions from Supabase...')
    const data = await getTransactions()
    console.log('📊 Loaded', data.length, 'transactions')
    setTransactions(data)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-light tracking-tight text-black">
              Activity Ledger
            </h1>
            <button
              onClick={loadTransactions}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {isLoading ? (
            <div className="border border-black p-12 text-center">
              <p className="text-black/60 font-light">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="border border-black p-12 text-center">
              <p className="text-black/60 font-light">No transactions yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {transactions.map((tx, index) => (
                  <div 
                    key={tx.transaction_id}
                    className="border border-black p-4 hover:bg-black/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-base font-light text-black">
                          {tx.sending ? 'Sent' : 'Received'} {tx.type || 'SUI'}
                        </p>
                        <p className="text-xs text-black/60 mt-1">
                          {tx.date ? new Date(tx.date + 'Z').toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-black/40">{tx.sending ? 'To' : 'From'}</p>
                        <p className="text-xs font-mono text-black mt-1">
                          {tx.sending 
                            ? (tx.to_address ? `${tx.to_address.slice(0, 6)}...${tx.to_address.slice(-4)}` : `${tx.reciever_id}`)
                            : (tx.from_address ? `${tx.from_address.slice(0, 6)}...${tx.from_address.slice(-4)}` : `${tx.sender_id}`)
                          }
                        </p>
                      </div>
                    </div>
                    
                    {tx.transaction_hash && (
                      <a
                        href={`https://suiexplorer.com/txblock/${tx.transaction_hash}?network=testnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-black/60 hover:text-black hover:underline break-all block"
                      >
                        {tx.transaction_hash}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-black/40 mt-6">
                Showing {transactions.length} transactions
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

