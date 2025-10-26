'use client'

import { useState, useEffect } from 'react'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { Header } from '@/components/Header'
import { ProposalList } from '@/components/governance/ProposalList'
import { VotingService } from '@/services/governance/votingService'
import { ProposalAnalyzer } from '@/services/governance/aiAnalyzer'
import { SuiProposal } from '@/lib/governance/types'
import { logTransaction } from '@/services/transactionLogger'
import { CRYPTOBOT_WALLET_ADDRESS } from '@/lib/cryptobot'

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') })
const votingService = new VotingService(suiClient)
const analyzer = new ProposalAnalyzer()

export default function Governance() {
  const [votingPower, setVotingPower] = useState<string>('0')
  const [isVoting, setIsVoting] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null)
  const [autoVoteEnabled, setAutoVoteEnabled] = useState(true)
  const [votingHistory, setVotingHistory] = useState<Array<{
    proposalId: string;
    decision: boolean;
    reason: string;
    timestamp: number;
  }>>([])

  useEffect(() => {
    loadVotingPower()
    const interval = setInterval(loadVotingPower, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const loadVotingPower = async () => {
    const power = await votingService.getVotingPower()
    setVotingPower(power)
  }

  const handleAutonomousVote = async (proposal: SuiProposal, forceVote?: boolean) => {
    if (!autoVoteEnabled && !forceVote) return
    
    setIsVoting(true)
    try {
      // Analyze proposal
      const analysis = await analyzer.analyzeProposal(proposal)
      
      // Log analysis
      const analysisMessage = `Analysis: ${analysis.reasoning}\nConfidence: ${analysis.confidence}%\nKey factors: ${analysis.factors.join(', ')}`
      setLastAnalysis(analysisMessage)
      
      // Cast vote if confidence is high enough or forced
      if (analysis.confidence >= 70 || forceVote) {
        const result = await votingService.castVote(proposal.id, analysis.decision)
        if (result) {
          console.log('Vote cast successfully:', result.transactionHash)
          
          // Add to voting history
          setVotingHistory(prev => [{
            proposalId: proposal.id,
            decision: analysis.decision,
            reason: analysis.reasoning,
            timestamp: Date.now()
          }, ...prev])
          
          // Log to Supabase
          await logTransaction({
            fromAddress: CRYPTOBOT_WALLET_ADDRESS,
            toAddress: proposal.id,
            amount: '0',
            coinType: 'VOTE',
            transactionHash: result.transactionHash
          })
        }
      } else {
        console.log('Confidence too low to vote:', analysis.confidence)
      }
    } catch (error) {
      console.error('Failed to process autonomous vote:', error)
    }
    setIsVoting(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-black mb-2">
                Governance
              </h1>
              <p className="text-sm text-black/60">
                CryptoBot's autonomous governance system
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-black/60">Voting Power</p>
              <p className="text-xl font-mono text-black">
                {(parseInt(votingPower) / 1_000_000_000).toFixed(4)} SUI
              </p>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <div className="border border-black p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-light text-black">Autonomous Voting</h2>
                  <p className="text-sm text-black/60">
                    Let CryptoBot analyze and vote on proposals automatically
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoVoteEnabled}
                    onChange={(e) => setAutoVoteEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/10 peer-checked:bg-black border border-black peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-black after:h-5 after:w-5 after:transition-all" />
                </label>
              </div>
              {lastAnalysis && (
                <div className="text-sm text-black/60 whitespace-pre-line">
                  {lastAnalysis}
                </div>
              )}
            </div>

            {votingHistory.length > 0 && (
              <div className="border border-black p-4">
                <h2 className="text-lg font-light text-black mb-4">Recent Votes</h2>
                <div className="space-y-3">
                  {votingHistory.map((vote) => (
                    <div key={vote.proposalId + vote.timestamp} className="text-sm">
                      <p className="text-black">
                        Voted {vote.decision ? 'Yes' : 'No'} on proposal {vote.proposalId}
                      </p>
                      <p className="text-black/60 text-xs">
                        {new Date(vote.timestamp).toLocaleString()}
                      </p>
                      <p className="text-black/40 text-xs">
                        Reason: {vote.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ProposalList onVote={handleAutonomousVote} />
        </div>
      </div>
    </div>
  )
}