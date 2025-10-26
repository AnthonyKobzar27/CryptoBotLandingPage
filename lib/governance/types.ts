'use client'

export interface SuiProposal {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'failed'
  votingEndTime: number
  votingPower: {
    yes: string
    no: string
  }
  type: 'system' | 'community'
  metadata?: Record<string, any>
}

export interface VotingPower {
  amount: string
  delegatedStake: string
  totalPower: string
}

export interface VoteTransaction {
  proposalId: string
  vote: boolean
  transactionHash: string
  timestamp: number
  voter: string
}

export interface ProposalAnalysis {
  decision: boolean
  confidence: number
  reasoning: string
  factors: string[]
}
