'use client'

import { useState, useEffect } from 'react'
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { SuiProposal } from '@/lib/governance/types'
import { ProposalFetcher } from '@/services/governance/proposalFetcher'

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') })
const proposalFetcher = new ProposalFetcher(suiClient)

interface ProposalListProps {
  onVote?: (proposal: SuiProposal, vote: boolean) => Promise<void>;
}

export function ProposalList({ onVote }: ProposalListProps) {
  const [proposals, setProposals] = useState<SuiProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({})
  const [analysisStates, setAnalysisStates] = useState<Record<string, string>>({})

  useEffect(() => {
    loadProposals()
    // Refresh every 30 seconds
    const interval = setInterval(loadProposals, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadProposals = async () => {
    setIsLoading(true)
    try {
      const data = await proposalFetcher.getActiveProposals()
      setProposals(data)
    } catch (error) {
      console.error('Failed to load proposals:', error)
    }
    setIsLoading(false)
  }

  const formatTimeLeft = (endTime: number): string => {
    const now = Date.now()
    const diff = endTime - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h left`
  }

  if (isLoading) {
    return (
      <div className="border border-black p-8">
        <p className="text-black/60 font-light">Loading proposals...</p>
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <div className="border border-black p-8">
        <p className="text-black/60 font-light">No active proposals</p>
      </div>
    )
  }

  const handleVote = async (proposal: SuiProposal, vote: boolean) => {
    if (!onVote) return
    
    setVotingStates(prev => ({ ...prev, [proposal.id]: true }))
    try {
      await onVote(proposal, vote)
      // Update proposals after voting
      await loadProposals()
    } catch (error) {
      console.error('Failed to vote:', error)
    }
    setVotingStates(prev => ({ ...prev, [proposal.id]: false }))
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="border border-black p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-light text-black">
                  {proposal.title}
                </h3>
                <span className="px-2 py-1 text-xs border border-black">
                  {proposal.type}
                </span>
              </div>
              <p className="text-sm text-black/60 mb-4">
                {proposal.description}
              </p>
              
              {proposal.metadata && (
                <div className="space-y-1 text-xs text-black/40">
                  {Object.entries(proposal.metadata).map(([key, value]) => (
                    <p key={key}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value.toString()}
                    </p>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <p className="text-sm font-mono text-black mb-2">
                {formatTimeLeft(proposal.votingEndTime)}
              </p>
              {analysisStates[proposal.id] && (
                <p className="text-xs text-black/60 max-w-[200px] text-right">
                  {analysisStates[proposal.id]}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-black/60 mb-2">
                <span>Yes: {(parseInt(proposal.votingPower.yes) / 1_000_000_000).toFixed(2)} SUI</span>
                <span>No: {(parseInt(proposal.votingPower.no) / 1_000_000_000).toFixed(2)} SUI</span>
              </div>
              <div className="h-2 bg-black/5">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{
                    width: `${(parseInt(proposal.votingPower.yes) / (parseInt(proposal.votingPower.yes) + parseInt(proposal.votingPower.no))) * 100}%`
                  }}
                />
              </div>
            </div>

            {onVote && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote(proposal, true)}
                  disabled={votingStates[proposal.id]}
                  className="flex-1 px-4 py-2 text-sm border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  {votingStates[proposal.id] ? 'Voting...' : 'Vote Yes'}
                </button>
                <button
                  onClick={() => handleVote(proposal, false)}
                  disabled={votingStates[proposal.id]}
                  className="flex-1 px-4 py-2 text-sm border border-black hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  {votingStates[proposal.id] ? 'Voting...' : 'Vote No'}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
