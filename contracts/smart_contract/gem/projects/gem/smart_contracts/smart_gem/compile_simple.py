"""
Simple compilation script for the game contract
"""

import os

def compile_contract():
    """Compile the smart contract"""
    
    print("🔨 Compiling Chronicle of the Ledger smart contract...")
    
    try:
        from contract import GameContract
        
        contract = GameContract()
        approval_teal, clear_teal = contract.compile()
        
        # Create artifacts directory if it doesn't exist
        os.makedirs("artifacts", exist_ok=True)
        
        # Write to files
        with open("artifacts/game_contract_approval.teal", "w") as f:
            f.write(approval_teal)
        
        with open("artifacts/game_contract_clear.teal", "w") as f:
            f.write(clear_teal)
        
        print("✅ Smart contract compiled successfully!")
        print("�� Files created:")
        print("   - artifacts/game_contract_approval.teal")
        print("   - artifacts/game_contract_clear.teal")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure you're in the correct directory and all files are present")
    except Exception as e:
        print(f"❌ Compilation error: {e}")

if __name__ == "__main__":
    compile_contract()