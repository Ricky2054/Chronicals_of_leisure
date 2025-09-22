"""
Deployment Guide for Smart Contracts
Simple deployment instructions without external dependencies
"""

import json
import os
from datetime import datetime

def main():
    """Main deployment guide"""
    
    print("🚀 Smart Contract Deployment Guide")
    print("=" * 50)
    
    # Check if TEAL files exist
    approval_file = "artifacts/final_working_approval.teal"
    clear_file = "artifacts/final_working_clear.teal"
    
    if not os.path.exists(approval_file):
        print("❌ Approval TEAL file not found. Please run:")
        print("   python final_working.py")
        return False
    
    if not os.path.exists(clear_file):
        print("❌ Clear TEAL file not found. Please run:")
        print("   python final_working.py")
        return False
    
    print("✅ TEAL files found!")
    
    # Read TEAL files
    with open(approval_file, 'r') as f:
        approval_teal = f.read()
    
    with open(clear_file, 'r') as f:
        clear_teal = f.read()
    
    print(f"📊 Approval program size: {len(approval_teal)} characters")
    print(f"📊 Clear program size: {len(clear_teal)} characters")
    
    # Create deployment configuration
    deployment_config = {
        "contract_name": "Chronicle of the Ledger Game",
        "version": "1.0.0",
        "deployment_date": datetime.now().isoformat(),
        "approval_program_size": len(approval_teal),
        "clear_program_size": len(clear_teal),
        "global_state_schema": {
            "num_byte_slices": 5,
            "num_ints": 5
        },
        "local_state_schema": {
            "num_byte_slices": 4,
            "num_ints": 4
        },
        "functions": [
            "stake",
            "win", 
            "lose",
            "toggle_pause",
            "withdraw_commission"
        ]
    }
    
    # Save deployment config
    with open("deployment_config.json", "w") as f:
        json.dump(deployment_config, f, indent=2)
    
    print("✅ Deployment configuration created: deployment_config.json")
    
    # Show deployment methods
    print("\n🔧 Deployment Methods:")
    print("=" * 30)
    
    print("\n1️⃣  Using AlgoKit (Recommended):")
    print("   pip install algokit")
    print("   algokit deploy --network testnet")
    
    print("\n2️⃣  Using Algorand SDK:")
    print("   pip install py-algorand-sdk")
    print("   # Use the deployment_config.json file")
    
    print("\n3️⃣  Using Algorand Developer Portal:")
    print("   - Go to https://developer.algorand.org/")
    print("   - Use the TEAL files in artifacts/")
    print("   - Deploy through the web interface")
    
    print("\n4️⃣  Using Algorand CLI:")
    print("   goal app create --creator <creator-address> \\")
    print("     --approval-prog artifacts/final_working_approval.teal \\")
    print("     --clear-prog artifacts/final_working_clear.teal \\")
    print("     --global-byteslices 5 --global-ints 5 \\")
    print("     --local-byteslices 4 --local-ints 4")
    
    # Show contract interaction
    print("\n🎮 Contract Interaction Guide:")
    print("=" * 35)
    
    print("\n📋 Available Functions:")
    print("   - stake: Stake ALGO to participate")
    print("   - win: Process player win")
    print("   - lose: Process player loss")
    print("   - toggle_pause: Admin pause/unpause")
    print("   - withdraw_commission: Admin withdraw commission")
    
    print("\n💡 Example Transactions:")
    print("   1. Player Opt-in:")
    print("      - Transaction Type: Application Opt-in")
    print("      - Application ID: <deployed-app-id>")
    
    print("\n   2. Player Stake:")
    print("      - Transaction Type: Application Call")
    print("      - Application Args: ['stake']")
    print("      - Payment: 1 ALGO to contract address")
    
    print("\n   3. Process Win:")
    print("      - Transaction Type: Application Call")
    print("      - Application Args: ['win']")
    print("      - Result: Player gets stake + 10% bonus")
    
    print("\n   4. Process Loss:")
    print("      - Transaction Type: Application Call")
    print("      - Application Args: ['lose']")
    print("      - Result: Player pays 5% commission, gets 95% back")
    
    print("\n🎉 Deployment setup complete!")
    print("\n📁 Files created:")
    print("   - deployment_config.json (deployment configuration)")
    print("   - artifacts/final_working_approval.teal (approval program)")
    print("   - artifacts/final_working_clear.teal (clear program)")
    
    print("\n🚀 Next steps:")
    print("   1. Choose a deployment method above")
    print("   2. Get your Algorand account credentials")
    print("   3. Deploy to testnet first")
    print("   4. Test all contract functions")
    print("   5. Deploy to mainnet when ready")
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Ready for deployment!")
    else:
        print("\n❌ Please fix the issues above first.")
