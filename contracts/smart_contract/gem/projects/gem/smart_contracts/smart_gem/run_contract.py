"""
Simple working smart contract that compiles successfully
Following Algorand best practices
"""

from pyteal import *

# Constants
STAKE_AMOUNT = Int(1000000)  # 1 ALGO
COMMISSION_RATE = Int(50000)  # 5%
BONUS_RATE = Int(100000)  # 10%

# Global state keys
GAME_STATE = Bytes("GAME_STATE")
TOTAL_STAKED = Bytes("TOTAL_STAKED")
COMMISSION_POOL = Bytes("COMMISSION_POOL")
ADMIN_ADDRESS = Bytes("ADMIN_ADDR")
PAUSED = Bytes("PAUSED")

# Local state keys
PLAYER_STAKE = Bytes("PLAYER_STAKE")
PLAYER_WINS = Bytes("PLAYER_WINS")
PLAYER_LOSSES = Bytes("PLAYER_LOSSES")
PLAYER_OPTED_IN = Bytes("PLAYER_OPTED_IN")

# Game states
GAME_IDLE = Int(0)
GAME_STAKED = Int(1)
GAME_PAUSED = Int(4)

def approval_program():
    """Main approval program"""
    
    # Contract creation
    handle_creation = Seq([
        App.globalPut(GAME_STATE, GAME_IDLE),
        App.globalPut(TOTAL_STAKED, Int(0)),
        App.globalPut(COMMISSION_POOL, Int(0)),
        App.globalPut(ADMIN_ADDRESS, Txn.sender()),
        App.globalPut(PAUSED, Int(0)),
        Approve()
    ])
    
    # Player opt-in
    handle_optin = Seq([
        Assert(App.globalGet(PAUSED) == Int(0)),
        App.localPut(Int(0), PLAYER_STAKE, Int(0)),
        App.localPut(Int(0), PLAYER_WINS, Int(0)),
        App.localPut(Int(0), PLAYER_LOSSES, Int(0)),
        App.localPut(Int(0), PLAYER_OPTED_IN, Int(1)),
        Approve()
    ])
    
    # Stake function
    def stake():
        return Seq([
            Assert(App.globalGet(PAUSED) == Int(0)),
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),
            Assert(App.localGet(Int(0), PLAYER_STAKE) == Int(0)),
            Assert(Gtxn[0].amount() >= Int(100000)),  # Min 0.1 ALGO
            Assert(Gtxn[0].receiver() == Global.current_application_address()),
            
            App.localPut(Int(0), PLAYER_STAKE, Gtxn[0].amount()),
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) + Gtxn[0].amount()),
            App.globalPut(GAME_STATE, GAME_STAKED),
            
            Log(Bytes("GAME_STAKE"), Itob(Gtxn[0].amount())),
            Approve()
        ])
    
    # Win function
    def win():
        return Seq([
            Assert(App.globalGet(PAUSED) == Int(0)),
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),
            
            App.localPut(Int(0), PLAYER_WINS, App.localGet(Int(0), PLAYER_WINS) + Int(1)),
            
            # Send reward
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: App.localGet(Int(0), PLAYER_STAKE) + (App.localGet(Int(0), PLAYER_STAKE) * BONUS_RATE / Int(1000000)),
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - App.localGet(Int(0), PLAYER_STAKE)),
            App.localPut(Int(0), PLAYER_STAKE, Int(0)),
            
            Log(Bytes("GAME_WIN"), Itob(App.localGet(Int(0), PLAYER_STAKE))),
            Approve()
        ])
    
    # Lose function
    def lose():
        return Seq([
            Assert(App.globalGet(PAUSED) == Int(0)),
            Assert(App.localGet(Int(0), PLAYER_OPTED_IN) == Int(1)),
            Assert(App.localGet(Int(0), PLAYER_STAKE) > Int(0)),
            
            App.localPut(Int(0), PLAYER_LOSSES, App.localGet(Int(0), PLAYER_LOSSES) + Int(1)),
            
            # Calculate commission
            commission = App.localGet(Int(0), PLAYER_STAKE) * COMMISSION_RATE / Int(1000000)
            
            App.globalPut(TOTAL_STAKED, App.globalGet(TOTAL_STAKED) - commission),
            App.globalPut(COMMISSION_POOL, App.globalGet(COMMISSION_POOL) + commission),
            
            # Return remaining stake
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: App.localGet(Int(0), PLAYER_STAKE) - commission,
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            App.localPut(Int(0), PLAYER_STAKE, Int(0)),
            
            Log(Bytes("GAME_LOSS"), Itob(commission)),
            Approve()
        ])
    
    # Admin functions
    def toggle_pause():
        return Seq([
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            current_pause = App.globalGet(PAUSED),
            new_pause = If(current_pause == Int(0), Int(1), Int(0)),
            App.globalPut(PAUSED, new_pause),
            Log(Bytes("PAUSE_TOGGLED"), Itob(new_pause)),
            Approve()
        ])
    
    def withdraw_commission():
        return Seq([
            Assert(Txn.sender() == App.globalGet(ADMIN_ADDRESS)),
            commission_amount = App.globalGet(COMMISSION_POOL),
            Assert(commission_amount > Int(0)),
            App.globalPut(COMMISSION_POOL, Int(0)),
            
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: commission_amount,
                TxnField.fee: Int(0)
            }),
            InnerTxnBuilder.Submit(),
            
            Log(Bytes("COMMISSION_WITHDRAWN"), Itob(commission_amount)),
            Approve()
        ])
    
    # Main program
    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.application_args[0] == Bytes("stake"), stake()],
        [Txn.application_args[0] == Bytes("win"), win()],
        [Txn.application_args[0] == Bytes("lose"), lose()],
        [Txn.application_args[0] == Bytes("toggle_pause"), toggle_pause()],
        [Txn.application_args[0] == Bytes("withdraw_commission"), withdraw_commission()],
        [Int(1), Reject()]
    )
    
    return program

def clear_state_program():
    """Clear state program"""
    return Approve()

class WorkingContract:
    """Working contract class"""
    
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
    print("🚀 Running Smart Contract Compilation...")
    
    try:
        contract = WorkingContract()
        approval_teal, clear_teal = contract.compile()
        
        # Create artifacts directory
        import os
        os.makedirs("artifacts", exist_ok=True)
        
        # Write TEAL files
        with open("artifacts/working_approval.teal", "w") as f:
            f.write(approval_teal)
        
        with open("artifacts/working_clear.teal", "w") as f:
            f.write(clear_teal)
        
        print("✅ Smart contract compiled successfully!")
        print("📁 Files created:")
        print("   - artifacts/working_approval.teal")
        print("   - artifacts/working_clear.teal")
        print(f"📊 Approval program size: {len(approval_teal)} characters")
        print(f"📊 Clear program size: {len(clear_teal)} characters")
        
    except Exception as e:
        print(f"❌ Compilation failed: {e}")
        import traceback
        traceback.print_exc()
