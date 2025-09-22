# Chronicle of the Ledger - Enhanced Smart Contract Documentation

## Overview

The Chronicle of the Ledger is an enhanced Algorand smart contract that implements a secure staking, slashing, and reward system for a blockchain-based game. This contract has been improved with comprehensive security features, better error handling, and administrative controls.

## Key Features

### 🔒 Security Enhancements
- **Overflow/Underflow Protection**: All arithmetic operations include overflow and underflow checks
- **Reentrancy Protection**: State validation prevents reentrancy attacks
- **Input Validation**: Comprehensive validation of all inputs and state transitions
- **Access Control**: Proper admin-only functions with address validation
- **Emergency Pause**: Ability to pause the contract in emergency situations

### 🎮 Game Mechanics
- **Staking System**: Players can stake ALGO tokens to participate in games
- **Reward System**: Winners receive their stake plus a bonus
- **Slashing System**: Losers have a portion of their stake slashed as commission
- **Player Statistics**: Comprehensive tracking of wins, losses, and earnings

### ⚙️ Administrative Functions
- **Commission Withdrawal**: Admin can withdraw accumulated commissions
- **Pause/Unpause**: Emergency stop functionality
- **Stake Limits**: Configurable minimum and maximum stake amounts
- **Game Reset**: Ability to reset game state for new rounds

## Contract Architecture

### Global State Variables
- `GAME_STATE`: Current state of the game (idle, staked, active, completed, paused)
- `TOTAL_STAKED`: Total amount of ALGO currently staked
- `COMMISSION_POOL`: Accumulated commissions from slashed stakes
- `TOTAL_PLAYERS`: Number of players in current round
- `GAME_ROUND`: Current game round number
- `ADMIN_ADDRESS`: Address of the contract administrator
- `PAUSED`: Emergency pause flag
- `MIN_STAKE`: Configurable minimum stake amount
- `MAX_STAKE`: Configurable maximum stake amount
- `TOTAL_GAMES_PLAYED`: Total number of games completed

### Local State Variables (Per Player)
- `PLAYER_STAKE`: Current stake amount for the player
- `PLAYER_SCORE`: Player's score/ranking
- `PLAYER_WINS`: Number of games won
- `PLAYER_LOSSES`: Number of games lost
- `PLAYER_LAST_GAME`: Last game round the player participated in
- `PLAYER_TOTAL_EARNED`: Total earnings from bonuses
- `PLAYER_OPTED_IN`: Flag indicating player has opted into the contract

## Function Reference

### Player Functions

#### `stake()`
Stakes ALGO tokens to participate in the game.
- **Requirements**: Contract not paused, player opted in, valid stake amount
- **Validation**: Stake amount within configured limits, no existing stake
- **Effects**: Updates player and global state, transitions game to staked state

#### `slash()`
Slashes a player's stake when they lose a game.
- **Requirements**: Contract not paused, player has staked tokens
- **Calculation**: Commission (5%) + transaction fee (0.001 ALGO)
- **Effects**: Updates player stats, adds to commission pool, returns remaining stake

#### `reward()`
Rewards a player when they win a game.
- **Requirements**: Contract not paused, player has staked tokens
- **Calculation**: Original stake + bonus (10%)
- **Effects**: Updates player stats, increments total games played

### Admin Functions

#### `withdraw_commission()`
Allows admin to withdraw accumulated commissions.
- **Requirements**: Admin address, non-zero commission pool
- **Effects**: Transfers commission pool to admin, resets pool to zero

#### `toggle_pause()`
Pauses or unpauses the contract.
- **Requirements**: Admin address
- **Effects**: Toggles pause state, updates game state if pausing

#### `update_stake_limits(min_stake, max_stake)`
Updates minimum and maximum stake amounts.
- **Requirements**: Admin address, valid limits
- **Validation**: min_stake > 0, max_stake > min_stake, max_stake ≤ 100 ALGO
- **Effects**: Updates global stake limits

#### `reset_game()`
Resets the game state for a new round.
- **Requirements**: Admin address
- **Effects**: Resets game state, increments round number

### View Functions

#### `get_player_stats()`
Returns player statistics (read-only).

#### `get_game_state()`
Returns current game state information (read-only).

## Security Considerations

### Implemented Protections
1. **Integer Overflow/Underflow**: All arithmetic operations include bounds checking
2. **Access Control**: Admin functions verify caller address
3. **State Validation**: Comprehensive validation of all state transitions
4. **Input Validation**: All inputs are validated before processing
5. **Emergency Controls**: Pause functionality for emergency situations

### Best Practices Applied
1. **Fail-Safe Design**: Contract fails securely on invalid operations
2. **Minimal Trust**: No external dependencies or oracles
3. **Transparent Logic**: All calculations are deterministic and verifiable
4. **Gas Optimization**: Efficient state management and minimal operations

## Deployment

### Prerequisites
- Algorand SDK (algokit-utils)
- PyTeal for contract compilation
- Valid Algorand account with sufficient ALGO for deployment

### Deployment Commands
```bash
# Compile the contract
python -m smart_gem compile

# Deploy to testnet
python -m smart_gem deploy testnet

# Verify deployment
python -m smart_gem verify testnet
```

### Network Configuration
The contract supports deployment to:
- **Localnet**: For development and testing
- **Testnet**: For public testing
- **Mainnet**: For production deployment

## Usage Examples

### Player Operations
```python
# Stake tokens
app_client.call("stake", payment=algosdk.microalgos_to_algos(1))

# Claim reward (after winning)
app_client.call("reward")

# Handle loss (after losing)
app_client.call("slash")
```

### Admin Operations
```python
# Withdraw commissions
app_client.call("withdraw_commission")

# Pause contract
app_client.call("toggle_pause")

# Update stake limits
app_client.call("update_stake_limits", min_stake=100000, max_stake=5000000)

# Reset game
app_client.call("reset_game")
```

## Monitoring and Analytics

### Key Metrics
- Total staked amount
- Number of active players
- Commission pool size
- Total games played
- Player win/loss ratios

### Event Tracking
All significant operations are logged and can be monitored through:
- Algorand Indexer API
- Application state queries
- Transaction logs

## Upgrade Path

The contract is designed to be immutable once deployed. For upgrades:
1. Deploy new contract version
2. Migrate state if necessary
3. Update client applications
4. Notify users of migration

## Support and Maintenance

### Regular Maintenance
- Monitor commission pool
- Check for unusual activity
- Update stake limits as needed
- Review security practices

### Emergency Procedures
1. Use `toggle_pause()` to halt operations
2. Investigate issue
3. Fix if possible or deploy new contract
4. Unpause when safe

## License

This smart contract is provided as-is for educational and development purposes. Please ensure compliance with local regulations before deploying to mainnet.

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**Compatibility**: Algorand Protocol v8+
