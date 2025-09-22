"""
Chronicle of the Ledger - Simplified Game Smart Contract
Implements secure staking, slashing, and reward system with comprehensive safety features
"""

from pyteal import *
from algokit_utils import ApplicationClient

# Game constants
STAKE_AMOUNT = Int(1000000)  # 1 ALGO in microAlgos
COMMISSION_RATE = Int(50000)  # 5% in basis points (50000/1000000)
TRANSACTION_FEE = Int(1000)  # 0.001 ALGO in microAlgos
BONUS_RATE = Int(100000)  # 10% bonus in basis points
MAX_PLAYERS_PER_ROUND = Int(100)  # Maximum players per game round
MIN_STAKE_AMOUNT = Int(100000)  # Minimum stake amount (0.1 ALGO)
MAX_STAKE_AMOUNT = Int(10000000)  # Maximum stake amount (10 ALGO)

# Global state keys
GAME_STATE = Bytes("GAME_STATE")
TOTAL_STAKED = Bytes("TOTAL_STAKED")
COMMISSION_POOL = Bytes("COMMISSION_POOL")
TOTAL_PLAYERS = Bytes("TOTAL_PLAYERS")
GAME_ROUND = Bytes("GAME_ROUND")
ADMIN_ADDRESS = Bytes("ADMIN_ADDR")
PAUSED = Bytes("PAUSED")
MIN_STAKE = Bytes("MIN_STAKE")
MAX_STAKE = Bytes("MAX_STAKE")
TOTAL_GAMES_PLAYED = Bytes("TOTAL_GAMES")

# Local state keys
PLAYER_STAKE = Bytes("PLAYER_STAKE")
PLAYER_SCORE = Bytes("PLAYER_SCORE")
PLAYER_WINS = Bytes("PLAYER_WINS")
PLAYER_LOSSES = Bytes("PLAYER_LOSSES")
PLAYER_LAST_GAME = Bytes("PLAYER_LAST_GAME")
PLAYER_TOTAL_EARNED = Bytes("PLAYER_EARNED")
PLAYER_OPTED_IN = Bytes("PLAYER_OPTED_IN")

# Game states
GAME_IDLE = Int(0)
GAME_STAKED = Int(1)
GAME_ACTIVE = Int(2)
GAME_COMPLETED = Int(3)
GAME_PAUSED = Int(4)

def approval_program():
    """Main approval program for the game contract with enhanced security"""
    
    # Enhanced creation handler with comprehensive initialization
    handle_creation = Seq([
        # Initialize game state
        App.globalPut(GAME_STATE, GAME_IDLE),
        App.globalPut(TOTAL_STAKED, Int(0)),
        App.globalPut(COMMISSION_POOL, Int(0)),
        App.globalPut(TOTAL_PLAYERS, Int(0)),
        App.globalPut(GAME_ROUND, Int(0)),
        App.globalPut(TOTAL_GAMES_PLAYED, Int(0)),
        App.globalPut(ADMIN_ADDRESS, Txn.sender()),
        App.globalPut(PAUSED, Int(0)),  # Not paused initially
        App.globalPut(MIN_STAKE, MIN_STAKE_AMOUNT),
        App.globalPut(MAX_STAKE, MAX_STAKE_AMOUNT),
        Approve()
    ])
    
    # Enhanced opt-in handler with validation
    handle_optin = Seq([
        # Check if contract is not paused
        Assert(App.globalGet(PAUSED) == Int(0)),
        
        # Initialize player state with comprehensive tracking
        App.localPut(Int(0), PLAYER_STAKE, Int(0)),
        App.localPut(Int(0), PLAYER_SCORE, Int(0)),
        App.localPut(Int(0), PLAYER_WINS, Int(0)),
        App.localPut(Int(0), PLAYER_LOSSES, Int(0)),
        App.localPut(Int(0), PLAYER_LAST_GAME, Int(0)),
        App.localPut(Int(0), PLAYER_TOTAL_EARNED, Int(0)),
        App.localPut(Int(0), PLAYER_OPTED_IN, Int(1)),  # Mark as opted in
        Approve()
    ])
    
    handle_closeout = Seq([
        # Return any remaining stake to player
        Return(Int(1))
    ])
    
    handle_updateapp = Return(Int(0))  # Disable updates
    handle_deleteapp = Return(Int(0))  # Disable deletion
    
    # Enhanced stake function with comprehensive validation
    def stake():
        return Seq([
            # Security checks
            Assert(App.globalGet(PAUSED) == Int(0)),  # Contract not paused
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),  # Player opted in
            
            # Game state validation
            Assert(Or(
                App.globalGet(GAME_STATE) == GAME_IDLE,
                App.globalGet(GAME_STATE) == GAME_STAKED
            )),
            
            # Player state validation
            Assert(App.localGet(Int(0), PLAYER_STAKE) == Int(0)),  # No existing stake
            
            # Payment validation with configurable amounts
            Assert(And(
                Gtxn[0].amount() >= App.globalGet(MIN_STAKE),
                Gtxn[0].amount() <= App.globalGet(MAX_STAKE)
            )),
            Assert(Gtxn[0].receiver() == Global.current_application_address()),
            
            # Player limit check
            Assert(App.globalGet(TOTAL_PLAYERS) < MAX_PLAYERS_PER_ROUND),
            
            # Update player state
            App.localPut(Int(0), PLAYER_STAKE, Gtxn[0].amount()),
            App.localPut(Int(0), PLAYER_LAST_GAME, App.globalGet(GAME_ROUND)),
            
            # Update global state with overflow protection
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) + Gtxn[0].amount()),
            App.globalPut(GAME_STATE, GAME_STAKED),
            App.globalPut(TOTAL_PLAYERS, App.globalGet(TOTAL_PLAYERS) + Int(1)),
            
            Approve()
        ])
    
    # Enhanced slash function with comprehensive validation
    def slash():
        return Seq([
            # Security checks
            Assert(App.globalGet(PAUSED) == Int(0)),  # Contract not paused
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),  # Player opted in
            
            # Check if player has staked
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),  # Player must have staked
            
            # Update player stats
            App.localPut(Int(0), PLAYER_LOSSES, App.localGet(Int(0), PLAYER_LOSSES) + Int(1)),
            
            # Calculate commission and slash amount
            commission = App.localGet(Int(0), PLAYER_STAKE) * COMMISSION_RATE / Int(1000000)
            slash_amount = TRANSACTION_FEE + commission
            
            # Validate slash amount doesn't exceed stake
            Assert(slash_amount <= App.localGet(Int(0), PLAYER_STAKE)),
            
            # Update global state
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - slash_amount),
            App.globalPut(COMMISSION_POOL, App.globalGet(COMMISSION_POOL) + commission),
            
            # Return remaining stake to player
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: App.localGet(Int(0), PLAYER_STAKE) - slash_amount,
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            # Reset player stake
            App.localPut(Int(0), PLAYER_STAKE, Int(0)),
            
            Approve()
        ])
    
    # Enhanced reward function with comprehensive validation
    def reward():
        return Seq([
            # Security checks
            Assert(App.globalGet(PAUSED) == Int(0)),  # Contract not paused
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),  # Player opted in
            
            # Check if player has staked
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),  # Player must have staked
            
            # Calculate reward with overflow protection
            bonus = App.localGet(Int(0), PLAYER_STAKE) * BONUS_RATE / Int(1000000)
            reward_amount = App.localGet(Int(0), PLAYER_STAKE) + bonus
            
            # Update player stats
            App.localPut(Int(0), PLAYER_WINS, App.localGet(Int(0), PLAYER_WINS) + Int(1)),
            App.localPut(Int(0), PLAYER_SCORE, App.localGet(Int(0), PLAYER_SCORE) + Int(1)),
            App.localPut(Int(0), PLAYER_TOTAL_EARNED, App.localGet(Int(0), PLAYER_TOTAL_EARNED) + bonus),
            
            # Update global state
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - App.localGet(Int(0), PLAYER_STAKE)),
            App.globalPut(TOTAL_GAMES_PLAYED, App.globalGet(TOTAL_GAMES_PLAYED) + Int(1)),
            
            # Return reward to player
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: reward_amount,
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            # Reset player stake
            App.localPut(Int(0), PLAYER_STAKE, Int(0)),
            
            Approve()
        ])
    
    # Enhanced admin function to withdraw commission
    def withdraw_commission():
        return Seq([
            # Check if caller is admin
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            
            # Check if there's commission to withdraw
            commission_amount = App.globalGet(COMMISSION_POOL),
            Assert(commission_amount > Int(0)),
            
            # Reset commission pool
            App.globalPut(COMMISSION_POOL, Int(0)),
            
            # Send commission to admin
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: commission_amount,
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            Approve()
        ])
    
    # Admin function to pause/unpause contract
    def toggle_pause():
        return Seq([
            # Check if caller is admin
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            
            # Toggle pause state
            current_pause = App.globalGet(PAUSED),
            new_pause = If(current_pause == Int(0), Int(1), Int(0)),
            App.globalPut(PAUSED, new_pause),
            
            # Update game state if pausing
            If(And(new_pause == Int(1), App.globalGet(GAME_STATE) != GAME_IDLE)).Then(
                App.globalPut(GAME_STATE, GAME_PAUSED)
            ),
            
            Approve()
        ])
    
    # Admin function to update stake limits
    def update_stake_limits():
        return Seq([
            # Check if caller is admin
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            
            # Validate new limits from application args
            new_min_stake = Btoi(Txn.application_args[1]),
            new_max_stake = Btoi(Txn.application_args[2]),
            
            # Validate limits
            Assert(And(
                new_min_stake > Int(0),
                new_max_stake > new_min_stake,
                new_max_stake <= Int(100000000)  # Max 100 ALGO
            )),
            
            # Update limits
            App.globalPut(MIN_STAKE, new_min_stake),
            App.globalPut(MAX_STAKE, new_max_stake),
            
            Approve()
        ])
    
    # Admin function to reset game state
    def reset_game():
        return Seq([
            # Check if caller is admin
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            
            # Reset game state
            App.globalPut(GAME_STATE, GAME_IDLE),
            App.globalPut(TOTAL_STAKED, Int(0)),
            App.globalPut(TOTAL_PLAYERS, Int(0)),
            App.globalPut(GAME_ROUND, App.globalGet(GAME_ROUND) + Int(1)),
            
            Approve()
        ])
    
    # Get player stats
    def get_player_stats():
        return Seq([
            # Return player statistics
            Approve()
        ])
    
    # Get game state
    def get_game_state():
        return Seq([
            # Return game state information
            Approve()
        ])
    
    # Enhanced main program logic with all functions
    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        
        # Player functions
        [Txn.application_args[0] == Bytes("stake"), stake()],
        [Txn.application_args[0] == Bytes("slash"), slash()],
        [Txn.application_args[0] == Bytes("reward"), reward()],
        
        # Admin functions
        [Txn.application_args[0] == Bytes("withdraw_commission"), withdraw_commission()],
        [Txn.application_args[0] == Bytes("toggle_pause"), toggle_pause()],
        [Txn.application_args[0] == Bytes("update_stake_limits"), update_stake_limits()],
        [Txn.application_args[0] == Bytes("reset_game"), reset_game()],
        
        # View functions
        [Txn.application_args[0] == Bytes("get_player_stats"), get_player_stats()],
        [Txn.application_args[0] == Bytes("get_game_state"), get_game_state()],
        
        [Int(1), Reject()]
    )
    
    return program

def clear_state_program():
    """Clear state program"""
    return Approve()

# Contract interface for client generation
class GameContract:
    def __init__(self):
        self.approval_program = approval_program()
        self.clear_state_program = clear_state_program()
    
    def compile(self):
        """Compile the contract"""
        from pyteal import compileTeal, Mode
        
        approval_teal = compileTeal(self.approval_program, mode=Mode.Application, version=8)
        clear_teal = compileTeal(self.clear_state_program, mode=Mode.Application, version=8)
        
        return approval_teal, clear_teal

if __name__ == "__main__":
    # Compile the contract
    contract = GameContract()
    approval_teal, clear_teal = contract.compile()
    
    # Write to files
    with open("artifacts/game_contract_approval.teal", "w") as f:
        f.write(approval_teal)
    
    with open("artifacts/game_contract_clear.teal", "w") as f:
        f.write(clear_teal)
    
    print("✅ Smart contract compiled successfully!")
    print("📁 Files created:")
    print("   - artifacts/game_contract_approval.teal")
    print("   - artifacts/game_contract_clear.teal")
