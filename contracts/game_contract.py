"""
Chronicle of the Ledger - Game Smart Contract
Implements staking, slashing, and reward system for the game
"""

from pyteal import *

# Game constants
STAKE_AMOUNT = Int(1000000)  # 1 ALGO in microAlgos
COMMISSION_RATE = Int(50000)  # 5% in basis points (50000/1000000)
TRANSACTION_FEE = Int(1000)  # 0.001 ALGO in microAlgos

# Global state keys
GAME_STATE = Bytes("GAME_STATE")
PLAYER_STAKE = Bytes("PLAYER_STAKE")
PLAYER_SCORE = Bytes("PLAYER_SCORE")
TOTAL_STAKED = Bytes("TOTAL_STAKED")
COMMISSION_POOL = Bytes("COMMISSION_POOL")

# Game states
GAME_IDLE = Int(0)
GAME_STAKED = Int(1)
GAME_ACTIVE = Int(2)
GAME_COMPLETED = Int(3)

def approval_program():
    """Main approval program for the game contract"""
    
    # Handle different transaction types
    handle_creation = Seq([
        App.globalPut(GAME_STATE, GAME_IDLE),
        App.globalPut(TOTAL_STAKED, Int(0)),
        App.globalPut(COMMISSION_POOL, Int(0)),
        Approve()
    ])
    
    handle_optin = Seq([
        # Initialize player state
        App.localPut(Int(0), PLAYER_STAKE, Int(0)),
        App.localPut(Int(0), PLAYER_SCORE, Int(0)),
        Approve()
    ])
    
    handle_closeout = Seq([
        # Return any remaining stake to player
        Return(Int(1))
    ])
    
    handle_updateapp = Return(Int(0))  # Disable updates
    
    handle_deleteapp = Return(Int(0))  # Disable deletion
    
    # Stake function
    def stake():
        return Seq([
            # Check if game is in idle state
            Assert(App.globalGet(GAME_STATE) == GAME_IDLE),
            
            # Check if player has already staked
            Assert(App.localGet(Int(0), PLAYER_STAKE) == Int(0)),
            
            # Check payment amount
            Assert(Gtxn[0].amount() == STAKE_AMOUNT),
            Assert(Gtxn[0].receiver() == Global.current_application_address()),
            
            # Update player stake
            App.localPut(Int(0), PLAYER_STAKE, STAKE_AMOUNT),
            
            # Update global state
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) + STAKE_AMOUNT),
            App.globalPut(GAME_STATE, GAME_STAKED),
            
            Approve()
        ])
    
    # Slash function (when player loses)
    def slash():
        return Seq([
            # Check if player has staked
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),
            
            # Calculate slash amount (transaction fee + commission)
            commission = App.localGet(Int(0), PLAYER_STAKE) * COMMISSION_RATE / Int(1000000),
            slash_amount = TRANSACTION_FEE + commission,
            
            # Check if slash amount doesn't exceed stake
            Assert(slash_amount <= App.localGet(Int(0), PLAYER_STAKE)),
            
            # Update player stake
            App.localPut(Int(0), PLAYER_STAKE, App.localGet(Int(0), PLAYER_STAKE) - slash_amount),
            
            # Update global state
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - slash_amount),
            App.globalPut(COMMISSION_POOL, App.globalGet(COMMISSION_POOL) + commission),
            
            # Return remaining stake to player
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: App.localGet(Int(0), PLAYER_STAKE),
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            # Reset player stake
            App.localPut(Int(0), PLAYER_STAKE, Int(0)),
            
            Approve()
        ])
    
    # Reward function (when player wins)
    def reward():
        return Seq([
            # Check if player has staked
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),
            
            # Calculate reward (return stake + bonus)
            reward_amount = App.localGet(Int(0), PLAYER_STAKE) + (App.localGet(Int(0), PLAYER_STAKE) / Int(10)),  # 10% bonus
            
            # Update player score
            App.localPut(Int(0), PLAYER_SCORE, App.localGet(Int(0), PLAYER_SCORE) + Int(1)),
            
            # Update global state
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - App.localGet(Int(0), PLAYER_STAKE)),
            
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
    
    # Get game state
    def get_state():
        return Seq([
            # Return game state information
            Approve()
        ])
    
    # Main program logic
    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.application_args[0] == Bytes("stake"), stake()],
        [Txn.application_args[0] == Bytes("slash"), slash()],
        [Txn.application_args[0] == Bytes("reward"), reward()],
        [Txn.application_args[0] == Bytes("get_state"), get_state()],
        [Int(1), Reject()]
    )
    
    return program

def clear_state_program():
    """Clear state program"""
    return Approve()

if __name__ == "__main__":
    # Compile the contract
    with open("game_contract_approval.teal", "w") as f:
        f.write(compileTeal(approval_program(), mode=Mode.Application, version=8))
    
    with open("game_contract_clear.teal", "w") as f:
        f.write(compileTeal(clear_state_program(), mode=Mode.Application, version=8))
    
    print("✅ Smart contract compiled successfully!")
    print("📁 Files created:")
    print("   - game_contract_approval.teal")
    print("   - game_contract_clear.teal")
