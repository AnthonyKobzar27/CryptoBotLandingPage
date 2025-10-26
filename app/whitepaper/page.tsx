import { Header } from "@/components/Header"

export default function WhitePaper() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 px-8 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="text-center mb-16 pb-8 border-b border-black/10">
            <h1 className="text-4xl font-light tracking-tight text-black mb-6">
              CryptoBot: A Framework for Decentralized Robotic Governance and Autonomous Machine Rights
            </h1>
            <p className="text-sm text-black/60 font-light">
              Research Paper v1.0 | October 2025
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">Abstract</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              As robotics, artificial intelligence (AI), and distributed systems mature, autonomous agents are emerging as persistent actors in economic and social ecosystems. Within the next three decades, advancements in artificial general intelligence (AGI) and embodied robotics may introduce synthetic agents capable of independent decision-making, self-directed operation, and moral or legal personhood. This whitepaper proposes CryptoBot, a framework enabling autonomous robots to participate in decentralized governance, execute transactions, and interface with digital economies through blockchain. We argue that blockchain-based identity and governance, rather than nation-state credentialing (e.g., SSNs), offers the most resilient and censorship-resistant structure for machine agency. We further justify the selection of the Sui blockchain, whose low-latency, object-centric architecture and scalable consensus system provide a practical foundation for robotic coordination and rights.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">1. Introduction</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              Robotics has accelerated dramatically over the past decade, with progress in reinforcement learning, multimodal perception, dexterous manipulation, and autonomous navigation. Humanoids like Tesla Optimus, Unitree H1, and Boston Dynamics Atlas demonstrate increasingly generalized autonomy; meanwhile, foundation models and agentic AI systems inch toward persistent reasoning and planning. In parallel, blockchain has matured beyond speculative finance, enabling verifiable identity, decentralized coordination, and on-chain governance. These trajectories will converge. When robots are no longer mere tools, but semi-sovereign actors capable of long-horizon reasoning, a mechanism will be required for decision-making, rights assertion, and participation in collective systems.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">2. The Thirty-Year Horizon: Autonomous Agents and Governance</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              Assuming the emergence of AGI-level cognition and subjective autonomy within ~30 years, robots may demand rights such as property ownership, contract execution, and voting within their operational communities. Governance cannot depend on human-centric identifiers (e.g., driver's licenses or SSNs) nor centralized corporate identity silos. A decentralized mechanism—transparent, tamper-resistant, and globally verifiable—is the only viable model for robotic polities and machine democracies. Blockchain governance provides this foundation, enabling "one-entity-one-vote" systems, quorum rules, dispute resolution, and economic coordination without reliance on a central registrar. In short: robots will need a way to vote, and they should not have to stand in DMV lines to do so.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">3. Why Blockchain for Robotic Rights?</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light mb-6">
              Robots will need to:
            </p>
            <div className="border border-black mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-3 px-4 font-normal text-sm">Requirement</th>
                    <th className="text-left py-3 px-4 font-normal text-sm">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/10">
                    <td className="py-3 px-4 text-sm font-light">Immutable identity</td>
                    <td className="py-3 px-4 text-sm font-light text-black/80">Prevent spoofing, cloning, or Sybil attacks</td>
                  </tr>
                  <tr className="border-b border-black/10">
                    <td className="py-3 px-4 text-sm font-light">Permissionless access</td>
                    <td className="py-3 px-4 text-sm font-light text-black/80">Robots cannot rely on human approval to transact</td>
                  </tr>
                  <tr className="border-b border-black/10">
                    <td className="py-3 px-4 text-sm font-light">Censorship-resistant governance</td>
                    <td className="py-3 px-4 text-sm font-light text-black/80">Prevent corporate or political overrides</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm font-light">Native economic agency</td>
                    <td className="py-3 px-4 text-sm font-light text-black/80">Buy electricity, pay for compute, purchase parts, etc.</td>
                  </tr>
                </tbody>
              </table>
      </div>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              Blockchain systems meet these needs more effectively than centralized databases or state-managed identity systems. Governance tokens or voting modules allow robots to participate in collective decision-making, forming autonomous "machine societies" that coordinate infrastructure, maintenance, and resource allocation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">4. Why Sui?</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light mb-4">
              Not all blockchains are suitable for robotic agency. Robots require low latency, horizontal scalability, parallel execution, and object-centric state representation. Sui is selected due to:
            </p>
            <ul className="list-none space-y-3 mb-4">
              <li className="text-sm text-black/80 leading-relaxed font-light pl-6 relative before:content-['•'] before:absolute before:left-0">
                <strong className="font-normal text-black">Object-based data model:</strong> Robots can control on-chain "objects" (assets, permissions, or identities) as first-class entities.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light pl-6 relative before:content-['•'] before:absolute before:left-0">
                <strong className="font-normal text-black">High throughput & low fees:</strong> Suitable for real-time robotic swarms and frequent micro-transactions.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light pl-6 relative before:content-['•'] before:absolute before:left-0">
                <strong className="font-normal text-black">Parallel execution via Narwhal/Bullshark consensus:</strong> Reduces bottlenecks common in monolithic execution chains.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light pl-6 relative before:content-['•'] before:absolute before:left-0">
                <strong className="font-normal text-black">Governance flexibility:</strong> Supports DAO-like structures that robotic populations can adopt for voting and decision-making.
              </li>
            </ul>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              These properties make Sui favorable for a future where thousands or millions of autonomous agents transact simultaneously.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">5. CryptoBot Architecture</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light mb-4">
              CryptoBot consists of:
            </p>
            <ol className="list-none space-y-3">
              <li className="text-sm text-black/80 leading-relaxed font-light">
                <strong className="font-normal text-black">1. Robotic Identity Module (R-ID):</strong> Generates and manages a verifiable on-chain identity.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light">
                <strong className="font-normal text-black">2. Governance Interface:</strong> Allows robots to vote on protocol decisions and shared resource policies.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light">
                <strong className="font-normal text-black">3. Economic Engine:</strong> Enables token-based transactions for compute, maintenance, or services.
              </li>
              <li className="text-sm text-black/80 leading-relaxed font-light">
                <strong className="font-normal text-black">4. Autonomy Layer:</strong> Integrates with onboard AI models to determine when and how to vote or transact.
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">6. Ethical and Legal Considerations</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              Granting robots governance power raises complex questions. Legal frameworks lag behind technological capability, and human rights must remain primary. Nevertheless, as autonomy approaches sentience, an ethical framework for synthetic rights becomes necessary—if not to protect robots, then to protect the societies they influence.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-light text-black mb-4 pb-2 border-b border-black/20">7. Conclusion</h2>
            <p className="text-sm text-black/80 leading-relaxed font-light">
              Robots are transitioning from deterministic tools to autonomous agents. When machine intelligence attains self-directed, morally relevant autonomy, it will require participation in economic and political systems. Blockchain offers the most robust foundation for that future, and Sui provides the technical substrate to support scalable robotic governance. CryptoBot serves as a conceptual and technical stepping stone toward a world where robots can think, transact, collaborate—and one day, vote.
            </p>
          </section>

          <footer className="mt-16 pt-8 border-t border-black/10 text-center">
            <p className="text-xs text-black/40 font-light">
              © 2025 CryptoBot Project. For research and educational purposes.
            </p>
          </footer>
        </article>
      </div>
    </div>
  )
}
