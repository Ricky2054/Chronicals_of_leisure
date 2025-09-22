"""
Deploy Your Smart Contract Now!
Just add your private key and run
"""

import json
from algosdk import account
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn

def deploy_contract():
    """Deploy the smart contract to testnet"""
    
    print("🚀 Deploying Smart Contract to Algorand Testnet")
    print("=" * 50)
    
    # ⚠️  REPLACE THIS WITH YOUR ACTUAL PRIVATE KEY ⚠️
    private_key = "YOUR_PRIVATE_KEY_HERE"  # Replace this!
    
    if private_key == "YOUR_PRIVATE_KEY_HERE":
        print("❌ Please replace 'YOUR_PRIVATE_KEY_HERE' with your actual private key")
        print("\n📋 How to get your private key:")
        print("1. Go to https://wallet.myalgo.com/")
        print("2. Click on your account")
        print("3. Click 'Export Account'")
        print("4. Enter your password")
        print("5. Copy the private key")
        print("6. Replace the private_key variable above")
        print("7. Run this script again")
        return False
    
    # Get sender address
    sender = account.address_from_private_key(private_key)
    print(f"📱 Deploying from address: {sender}")
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Algorand Testnet settings
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    # Create Algod client
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    try:
        # Read TEAL programs
        with open("artifacts/final_working_approval.teal", "r") as f:
            approval_program = f.read()
        
        with open("artifacts/final_working_clear.teal", "r") as f:
            clear_program = f.read()
        
        print("📝 Creating application transaction...")
        
        # Create application
        txn = ApplicationCreateTxn(
            sender=sender,
            sp=client.suggested_params(),
            on_complete=0,  # NoOp
            approval_program=approval_program,
            clear_program=clear_program,
            global_schema=config["global_state_schema"],
            local_schema=config["local_state_schema"]
        )
        
        print("🔐 Signing transaction...")
        
        # Sign and send transaction
        signed_txn = txn.sign(private_key)
        txid = client.send_transaction(signed_txn)
        
        print("✅ Contract deployed successfully!")
        print(f"📊 Transaction ID: {txid}")
        print(f"🔍 View transaction: https://testnet.algoexplorer.io/tx/{txid}")
        print(f"📱 Your contract is now live on Algorand Testnet!")
        
        # Save deployment info
        deployment_info = {
            "contract_name": "Chronicle of the Ledger Game",
            "deployment_date": "2025-01-17",
            "network": "testnet",
            "transaction_id": txid,
            "deployer_address": sender,
            "explorer_url": f"https://testnet.algoexplorer.io/tx/{txid}"
        }
        
        with open("deployment_info.json", "w") as f:
            json.dump(deployment_info, f, indent=2)
        
        print("💾 Deployment info saved to: deployment_info.json")
        
        print("\n🎮 Next Steps:")
        print("1. Copy the transaction ID above")
        print("2. Go to https://testnet.algoexplorer.io/")
        print("3. Search for your transaction ID")
        print("4. Find your Application ID")
        print("5. Test your contract functions!")
        
        return True
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure you have testnet ALGO")
        print("2. Get free ALGO from: https://testnet.algoexplorer.io/dispenser")
        print("3. Check your private key is correct")
        print("4. Make sure you're connected to the internet")
        return False

if __name__ == "__main__":
    deploy_contract()
