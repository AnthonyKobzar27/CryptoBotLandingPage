export const CRYPTOBOT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS || ''

export function isCryptoBotAddress(address: string): boolean {
  return address.toLowerCase() === CRYPTOBOT_WALLET_ADDRESS.toLowerCase()
}

export function getCryptoBotName(): string {
  return 'CryptoBot'
}

