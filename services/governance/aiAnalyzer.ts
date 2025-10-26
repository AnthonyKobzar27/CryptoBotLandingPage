'use client'

import { SuiProposal, ProposalAnalysis } from '@/lib/governance/types'

export class ProposalAnalyzer {
  private readonly KEYWORDS_POSITIVE = [
    'upgrade', 'improve', 'optimize', 'enhance', 'secure',
    'community', 'decentralize', 'sustainable', 'efficient'
  ]

  private readonly KEYWORDS_NEGATIVE = [
    'centralize', 'restrict', 'reduce', 'limit', 'remove',
    'force', 'mandatory', 'penalty'
  ]

  async analyzeProposal(proposal: SuiProposal): Promise<ProposalAnalysis> {
    const text = `${proposal.title} ${proposal.description}`.toLowerCase()
    
    // Count positive and negative keywords
    const positiveCount = this.KEYWORDS_POSITIVE.filter(word => 
      text.includes(word.toLowerCase())
    ).length

    const negativeCount = this.KEYWORDS_NEGATIVE.filter(word => 
      text.includes(word.toLowerCase())
    ).length

    // Calculate confidence based on keyword matches
    const total = positiveCount + negativeCount
    const confidence = total > 0 ? Math.min((Math.max(positiveCount, negativeCount) / total) * 100, 100) : 50

    // Make decision
    const decision = positiveCount >= negativeCount

    // Extract relevant factors
    const factors = [
      ...this.KEYWORDS_POSITIVE.filter(word => 
        text.includes(word.toLowerCase())
      ),
      ...this.KEYWORDS_NEGATIVE.filter(word => 
        text.includes(word.toLowerCase())
      )
    ]

    return {
      decision,
      confidence,
      reasoning: this.generateReasoning(positiveCount, negativeCount, factors),
      factors
    }
  }

  private generateReasoning(positiveCount: number, negativeCount: number, factors: string[]): string {
    if (factors.length === 0) {
      return 'Insufficient data to make a strong recommendation.'
    }

    const sentiment = positiveCount >= negativeCount ? 'positive' : 'negative'
    const keyFactors = factors.slice(0, 3).join(', ') // Top 3 factors

    return `Analysis shows ${sentiment} sentiment based on key factors: ${keyFactors}. ` +
           `Found ${positiveCount} positive and ${negativeCount} negative indicators.`
  }
}
