"""
Main entry point for Chronicle of the Ledger smart contract
"""

import sys
import os

def main():
    """Main function to run the contract operations"""
    
    if len(sys.argv) < 2:
        print("Usage: python -m smart_gem <command> [options]")
        print("Commands:")
        print("  compile    - Compile the smart contract")
        print("  deploy     - Deploy the smart contract")
        print("  verify     - Verify deployment")
        print("  test       - Run tests")
        return
    
    command = sys.argv[1]
    
    if command == "compile":
        from contract import GameContract
        
        print("🔨 Compiling Chronicle of the Ledger smart contract...")
        
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
    
    elif command == "deploy":
        from deploy_config import deploy_contract
        
        network = sys.argv[2] if len(sys.argv) > 2 else "testnet"
        deploy_contract(network)
    
    elif command == "verify":
        from deploy_config import verify_deployment
        
        network = sys.argv[2] if len(sys.argv) > 2 else "testnet"
        verify_deployment(network)
    
    elif command == "test":
        print("�� Running tests...")
        os.system("python -m pytest tests/ -v")
    
    else:
        print(f"❌ Unknown command: {command}")
        print("Available commands: compile, deploy, verify, test")

if __name__ == "__main__":
    main()