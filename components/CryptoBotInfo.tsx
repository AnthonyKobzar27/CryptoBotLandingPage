'use client'

import { CRYPTOBOT_WALLET_ADDRESS, getCryptoBotName } from '@/lib/cryptobot'

export function CryptoBotInfo() {
  if (!CRYPTOBOT_WALLET_ADDRESS) {
    return (
      <div className="border border-black p-6">
        <p className="text-black/60 font-light">
          CryptoBot wallet not configured
        </p>
      </div>
    )
  }

  const getAvatarColor = (addr: string) => {
    const hash = addr.slice(2, 8)
    return `#${hash}`
  }

  return (
    <div className="border border-black p-6">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-12 h-12 border border-black"
          style={{ backgroundColor: getAvatarColor(CRYPTOBOT_WALLET_ADDRESS) }}
        />
        <div>
          <h2 className="text-2xl font-light text-black">
            {getCryptoBotName()}
          </h2>
          <p className="text-sm text-black/60 font-light">
            Autonomous Crypto Agent
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-black/40 mb-1">Wallet Address</p>
          <p className="text-sm text-black font-mono break-all">
            {CRYPTOBOT_WALLET_ADDRESS}
          </p>
        </div>
      </div>
    </div>
  )
}

