'use client'

import { useState, useRef, useEffect } from 'react'
import { useCurrentAccount, useDisconnectWallet, useConnectWallet, useWallets } from '@mysten/dapp-kit'
import { ensureUser } from '@/services/transactionLogger'

export function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const account = useCurrentAccount()
  const { mutate: disconnect } = useDisconnectWallet()
  const { mutate: connect } = useConnectWallet()
  const wallets = useWallets()

  useEffect(() => {
    if (account?.address) {
      ensureUser(account.address)
    }
  }, [account?.address])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowWalletModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (account) {
    const address = account.address
    const getAvatarColor = (addr: string) => {
      const hash = addr.slice(2, 8)
      return `#${hash}`
    }
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-black border border-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          <div 
            className="w-6 h-6 border border-black"
            style={{ backgroundColor: getAvatarColor(address) }}
          />
          <span className="font-['Inter']">{address.slice(0, 6)}...{address.slice(-4)}</span>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-black z-50">
            <button
              onClick={() => {
                disconnect()
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-black hover:bg-black hover:text-white transition-colors duration-200 font-['Inter']"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <button 
        onClick={() => setShowWalletModal(true)}
        className="px-6 py-2 text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 font-['Inter']"
      >
        Connect Wallet
      </button>

      {showWalletModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white border border-black p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-black font-['Inter']">Connect Wallet</h2>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="text-black hover:text-black/60 transition-colors text-2xl font-['Inter']"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => {
                      connect({ wallet })
                      setShowWalletModal(false)
                    }}
                    className="w-full px-4 py-3 text-left text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 flex items-center gap-3 font-['Inter']"
                  >
                    {wallet.icon && (
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))
              ) : (
                <div className="border border-black p-6">
                  <p className="text-black/60 font-['Inter'] mb-4">
                    No SUI wallets detected. Please install a SUI wallet to continue.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-center text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 font-['Inter']"
                    >
                      Install Sui Wallet
                    </a>
                    <a
                      href="https://suiet.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-center text-black border border-black hover:bg-black hover:text-white transition-colors duration-200 font-['Inter']"
                    >
                      Install Suiet Wallet
                    </a>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-black/40 mt-4 font-['Inter']">
              Note: MetaMask does not support SUI blockchain. Please use a SUI-compatible wallet.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

