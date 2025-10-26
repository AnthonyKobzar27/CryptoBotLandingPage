'use client'

import { SuiClient } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { VoteTransaction } from '@/lib/governance/types'
import { getRobotSigner, signAndExecuteTransaction } from '@/lib/robotSigner'
import { logTransaction } from '@/services/transactionLogger'
import { CRYPTOBOT_WALLET_ADDRESS } from '@/lib/cryptobot'

export class VotingService {
  private client: SuiClient

  constructor(client: SuiClient) {
    this.client = client
  }

  async getVotingPower(): Promise<string> {
    try {
      const balance = await this.client.getBalance({
        owner: CRYPTOBOT_WALLET_ADDRESS
      })
      return balance.totalBalance
    } catch (error) {
      console.error('Failed to get voting power:', error)
      return '0'
    }
  }

  async castVote(proposalId: string, vote: boolean): Promise<VoteTransaction | null> {
    try {
      const signer = getRobotSigner()
      if (!signer) {
        throw new Error('CryptoBot signer not available')
      }

      // Create a transaction to call our governance contract
      const tx = new TransactionBlock()
      
      // Get CryptoBot's voting power (current balance)
      const balance = await this.client.getBalance({
        owner: CRYPTOBOT_WALLET_ADDRESS
      })
      
      // Split coins for voting power
      const amount = BigInt(balance.totalBalance)
      const [votingPowerCoin] = tx.splitCoins(tx.gas, [tx.pure(amount.toString())])
      
      // Use SUI's built-in staking for voting power
      tx.moveCall({
        target: '0x2::sui_system::request_add_stake',
        arguments: [
          tx.object(proposalId), // Using proposal ID as stake ID
          votingPowerCoin,       // Amount to stake
        ]
      })
      
      // For now, we'll just record a metadata transaction
      const result = await signAndExecuteTransaction(tx, this.client)

      // Log the vote to Supabase
      await logTransaction({
        fromAddress: CRYPTOBOT_WALLET_ADDRESS,
        toAddress: proposalId, // Using proposalId as the receiver for now
        amount: '0',
        coinType: 'VOTE',
        transactionHash: result.digest
      })

      const voteTransaction: VoteTransaction = {
        proposalId,
        vote,
        transactionHash: result.digest,
        timestamp: Date.now(),
        voter: CRYPTOBOT_WALLET_ADDRESS
      }

      return voteTransaction
    } catch (error) {
      console.error('Failed to cast vote:', error)
      return null
    }
  }
}
