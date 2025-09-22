"""
Simple Deployment Script for Smart Contracts
Works without external dependencies
"""

import json
import os
import sys
from datetime import datetime

def create_deployment_instructions():
    """Create deployment instructions for the smart contract"""
    
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
        "approval_program": approval_teal,
        "clear_state_program": clear_teal,
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
    
    return True

def show_deployment_methods():
    """Show different deployment methods"""
    
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

def show_contract_interaction():
    """Show how to interact with the deployed contract"""
    
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

def create_simple_deployment_script():
    """Create a simple deployment script using basic Algorand SDK"""
    
    script_content = '''"""
Simple Deployment Script using Algorand SDK
"""

from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn
import json

def deploy_contract():
    """Deploy the smart contract"""
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Algorand Testnet settings
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    # Create Algod client
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    # Get account (you need to provide your private key)
    # private_key = "YOUR_PRIVATE_KEY_HERE"
    # sender = account.address_from_private_key(private_key)
    
    print("📝 To deploy:")
    print("1. Get your account private key")
    print("2. Uncomment and set the private_key variable")
    print("3. Run this script")
    
    # Uncomment and modify the following lines to deploy:
    """
    # Create application
    txn = ApplicationCreateTxn(
        sender=sender,
        sp=client.suggested_params(),
        on_complete=0,  # NoOp
        approval_program=config["approval_program"],
        clear_program=config["clear_state_program"],
        global_schema=config["global_state_schema"],
        local_schema=config["local_state_schema"]
    )
    
    # Sign and send transaction
    signed_txn = txn.sign(private_key)
    txid = client.send_transaction(signed_txn)
    
    print(f"✅ Contract deployed! Transaction ID: {txid}")
    """
    
if __name__ == "__main__":
    deploy_contract()
'''
    
    with open("deploy_simple.py", "w") as f:
        f.write(script_content)
    
    print("✅ Simple deployment script created: deploy_simple.py")

def main():
    """Main deployment function"""
    
    print("🚀 Smart Contract Deployment Setup")
    print("=" * 40)
    
    # Create deployment instructions
    if not create_deployment_instructions():
        return False
    
    # Show deployment methods
    show_deployment_methods()
    
    # Show contract interaction
    show_contract_interaction()
    
    # Create simple deployment script
    create_simple_deployment_script()
    
    print("\n🎉 Deployment setup complete!")
    print("\n📁 Files created:")
    print("   - deployment_config.json (deployment configuration)")
    print("   - deploy_simple.py (simple deployment script)")
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
    sys.exit(0 if success else 1)
