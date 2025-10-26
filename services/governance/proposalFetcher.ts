'use client'

import { SuiClient } from '@mysten/sui.js/client'
import { SuiSystemStateSummary } from '@mysten/sui.js/client'
import { SuiProposal } from '@/lib/governance/types'

// Use string literals for BigInt in older environments
const ONE_MILLION = '1000000'
const DEFAULT_STAKE = '1000000000'

export class ProposalFetcher {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  async getSystemState(): Promise<SuiSystemStateSummary | null> {
    try {
      const state = await this.client.getLatestSuiSystemState()
      return state
    } catch (error) {
      console.error('Failed to fetch system state:', error)
      return null
    }
  }

  async getActiveProposals(): Promise<SuiProposal[]> {
    return this._getActiveProposals()
  }

  private async _getActiveProposals(): Promise<SuiProposal[]> {
    const proposals: SuiProposal[] = []
    try {
      // Get system state for protocol upgrades
      const systemState = await this.getSystemState()
      if (!systemState) return []

      // Get validator set for staking info
      const systemInfo = await this.client.getLatestSuiSystemState()
      const validatorCount = systemInfo.activeValidators?.length || 0

      // Get minimum stake from system parameters
      // Use default stake for testing since we can't access system parameters directly
      
      // Get active validators and their proposals
      const validators = systemInfo.activeValidators || []
      
      // Process each validator's staking and delegation proposals
      for (const validator of validators) {
        if (!validator.nextEpochStake) continue

        const validatorStake = BigInt(validator.nextEpochStake)
        const validatorName = validator.name || validator.suiAddress.slice(0, 8)
        
        // Add validator's staking proposal
        proposals.push({
          id: validator.suiAddress,
          title: `Validator Stake: ${validatorName}`,
          description: `Stake delegation proposal for validator ${validatorName}. Current stake: ${validator.nextEpochStake} MIST. Commission rate: ${validator.commissionRate || '0'}%.`,
          status: 'active' as const,
          votingEndTime: Date.now() + 24 * 60 * 60 * 1000, // 1 day
          votingPower: {
            yes: validatorStake.toString(),
            no: (validatorStake / BigInt(2)).toString()
          },
          type: 'system' as const,
          metadata: {
            validatorAddress: validator.suiAddress,
            validatorName: validator.name || '',
            currentStake: validator.nextEpochStake,
            commission: validator.commissionRate || '0',
            performance: validator.nextEpochGasPrice || '1'
          }
        })
      }

      // Add system upgrade proposal if available
      if (systemState.protocolVersion) {
        proposals.push({
          id: `protocol_${systemState.protocolVersion}`,
          title: `Protocol Version ${systemState.protocolVersion}`,
          description: `Current protocol version: ${systemState.protocolVersion}. System parameters and network configuration for epoch ${systemState.epoch}.`,
          status: 'active' as const,
          votingEndTime: Date.now() + 3 * 24 * 60 * 60 * 1000,
          votingPower: {
            yes: (BigInt(systemState.epoch || '1000') * BigInt(ONE_MILLION)).toString(),
            no: '0'
          },
          type: 'system' as const,
          metadata: {
            currentVersion: systemState.protocolVersion,
            epochNumber: systemState.epoch || '0',
            totalTransactions: systemState.epoch || '0',
            stakingPoolSize: systemState.activeValidators?.length || 0
          }
        })
      }
      
      // Sort proposals by voting power and return top 5
      return proposals
        .sort((a, b) => {
          const diff = BigInt(b.votingPower.yes) - BigInt(a.votingPower.yes)
          return diff > BigInt(0) ? 1 : diff < BigInt(0) ? -1 : 0
        })
        .slice(0, 5)
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
      return []
    }
  }

  async getProposalById(id: string): Promise<SuiProposal | null> {
    try {
      const proposals = await this.getActiveProposals()
      return proposals.find(p => p.id === id) || null
    } catch (error) {
      console.error('Failed to fetch proposal:', error)
      return null
    }
  }
}
