import { Header } from "@/components/Header"

export default function Location() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 px-8 py-12">
        <h1 className="text-4xl font-light tracking-tight text-black mb-6">
          Location
        </h1>
        <p className="text-xl text-black/60 font-light">
          Track CryptoBot location and activity
        </p>
      </div>
    </div>
  )
}

