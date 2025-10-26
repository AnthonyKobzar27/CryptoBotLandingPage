import { Header } from "@/components/Header"
import { SendToCryptoBot } from "@/components/SendToCryptoBot"
import { CryptoBotInfo } from "@/components/CryptoBotInfo"

export default function Donate() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CryptoBotInfo />
            <SendToCryptoBot />
          </div>
        </div>
      </div>
    </div>
  )
}
