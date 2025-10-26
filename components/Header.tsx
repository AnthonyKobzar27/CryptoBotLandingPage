import Link from "next/link"
import { ConnectWallet } from "./ConnectWallet"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        <nav className="flex gap-8">
          <Link 
            href="/"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Home
          </Link>
          <Link 
            href="/ledger"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Activity
          </Link>
          <Link 
            href="/governance"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Governance
          </Link>
          <Link 
            href="/location"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Location
          </Link>
          <Link 
            href="/donate"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Donate
          </Link>
          <Link 
            href="/whitepaper"
            className="text-black hover:text-black/60 transition-colors duration-200 font-light"
          >
            Whitepaper
          </Link>
        </nav>
        <ConnectWallet />
      </div>
    </header>
  )
}

