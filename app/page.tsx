import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/Header"
import { CryptoBotInfo } from "@/components/CryptoBotInfo"
import { SendToCryptoBot } from "@/components/SendToCryptoBot"
import { RobotDashboard } from "@/components/RobotDashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="min-h-screen flex items-center justify-end px-8 py-12 pt-24">
        <main className="flex items-center gap-8 max-w-fit pr-12">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-light tracking-tight text-black mb-6 text-center">
              Introducing CryptoBot
            </h1>
            <p className="text-2xl text-black/60 mb-12 font-light text-center">
              Autonomous crypto agent
            </p>
            <Link 
              href="/ledger"
              className="inline-block px-8 py-3 text-black border border-black hover:bg-black hover:text-white transition-colors duration-200"
            >
              View Activity
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/booster-t1-humanoid-robot2.jpg"
              alt="Booster T1 Humanoid Robot"
              width={400}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </main>
      </div>
    </div>
  )
}
