module cryptobot::governance {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::event;

    // Error codes
    const EInvalidProposalId: u64 = 0;
    const EProposalNotActive: u64 = 1;
    const EAlreadyVoted: u64 = 2;
    const EInsufficientVotingPower: u64 = 3;

    // Events
    struct VoteCast has copy, drop {
        proposal_id: u64,
        voter: address,
        vote: bool,
        voting_power: u64
    }

    // Proposal status
    struct ProposalStatus has copy, drop, store {
        active: bool,
        yes_votes: u64,
        no_votes: u64,
        end_time: u64
    }

    // Governance state
    struct GovernanceState has key {
        id: UID,
        proposals: Table<u64, ProposalStatus>,
        votes: Table<address, Table<u64, bool>>,
        next_proposal_id: u64
    }

    // Initialize governance
    fun init(ctx: &mut TxContext) {
        let governance = GovernanceState {
            id: object::new(ctx),
            proposals: table::new(ctx),
            votes: table::new(ctx),
            next_proposal_id: 0
        };
        transfer::share_object(governance);
    }

    // Create a new proposal
    public fun create_proposal(
        state: &mut GovernanceState,
        end_time: u64,
        _ctx: &mut TxContext
    ) {
        let proposal_id = state.next_proposal_id;
        let status = ProposalStatus {
            active: true,
            yes_votes: 0,
            no_votes: 0,
            end_time
        };
        table::add(&mut state.proposals, proposal_id, status);
        state.next_proposal_id = proposal_id + 1;
    }

    // Cast a vote
    public fun vote(
        state: &mut GovernanceState,
        proposal_id: u64,
        vote: bool,
        voting_power: &Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Verify proposal exists and is active
        let status = table::borrow_mut(&mut state.proposals, proposal_id);
        assert!(status.active, EProposalNotActive);
        
        // Check if already voted
        let voter = tx_context::sender(ctx);
        if (!table::contains(&state.votes, voter)) {
            table::add(&mut state.votes, voter, table::new(ctx));
        };
        let voter_votes = table::borrow_mut(&mut state.votes, voter);
        assert!(!table::contains(voter_votes, proposal_id), EAlreadyVoted);
        
        // Record vote
        table::add(voter_votes, proposal_id, vote);
        
        // Update vote counts
        let power = coin::value(voting_power);
        if (vote) {
            status.yes_votes = status.yes_votes + power;
        } else {
            status.no_votes = status.no_votes + power;
        };
        
        // Emit event
        event::emit(VoteCast {
            proposal_id,
            voter,
            vote,
            voting_power: power
        });
    }

    // Get proposal status
    public fun get_proposal_status(
        state: &GovernanceState,
        proposal_id: u64
    ): (bool, u64, u64, u64) {
        let status = table::borrow(&state.proposals, proposal_id);
        (status.active, status.yes_votes, status.no_votes, status.end_time)
    }

    // Check if address has voted
    public fun has_voted(
        state: &GovernanceState,
        voter: address,
        proposal_id: u64
    ): bool {
        if (!table::contains(&state.votes, voter)) {
            return false
        };
        let voter_votes = table::borrow(&state.votes, voter);
        table::contains(voter_votes, proposal_id)
    }
}
