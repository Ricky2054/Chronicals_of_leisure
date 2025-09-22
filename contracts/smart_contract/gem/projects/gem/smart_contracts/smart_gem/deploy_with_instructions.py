"""
Deploy Smart Contract with Step-by-Step Instructions
"""

import json
import os
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn

def deploy_contract():
    """Deploy the smart contract to testnet with instructions"""
    
    print("🚀 Smart Contract Deployment")
    print("=" * 40)
    
    # Check if TEAL files exist
    if not os.path.exists("artifacts/final_working_approval.teal"):
        print("❌ TEAL files not found. Please run:")
        print("   python final_working.py")
        return False
    
    print("✅ TEAL files found!")
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Algorand Testnet settings
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    # Create Algod client
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    print("\n📋 Step-by-Step Deployment Instructions:")
    print("=" * 45)
    
    print("\n1️⃣  Get Your Private Key:")
    print("   - Open MyAlgo Wallet: https://wallet.myalgo.com/")
    print("   - Click on your account")
    print("   - Click 'Export Account'")
    print("   - Enter your password")
    print("   - Copy the private key")
    
    print("\n2️⃣  Get Testnet ALGO (if needed):")
    print("   - Go to: https://testnet.algoexplorer.io/dispenser")
    print("   - Paste your wallet address")
    print("   - Click 'Dispense' to get free testnet ALGO")
    
    print("\n3️⃣  Deploy Your Contract:")
    print("   - Replace 'YOUR_PRIVATE_KEY_HERE' below with your actual private key")
    print("   - Uncomment the deployment code")
    print("   - Run this script again")
    
    print("\n4️⃣  Test Your Contract:")
    print("   - Use Algorand Explorer to view your deployed contract")
    print("   - Test all functions: stake, win, lose, toggle_pause, withdraw_commission")
    
    # Example deployment code (commented out for safety)
    print("\n" + "="*50)
    print("DEPLOYMENT CODE (Uncomment and modify):")
    print("="*50)
    
    deployment_code = '''
    # Get your private key (keep this secret!)
    private_key = "YOUR_PRIVATE_KEY_HERE"  # Replace with your actual private key
    sender = account.address_from_private_key(private_key)
    
    print(f"Deploying from address: {sender}")
    
    # Read TEAL programs
    with open("artifacts/final_working_approval.teal", "r") as f:
        approval_program = f.read()
    
    with open("artifacts/final_working_clear.teal", "r") as f:
        clear_program = f.read()
    
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
    
    # Sign and send transaction
    signed_txn = txn.sign(private_key)
    txid = client.send_transaction(signed_txn)
    
    print(f"✅ Contract deployed! Transaction ID: {txid}")
    print(f"🔍 Check transaction at: https://testnet.algoexplorer.io/tx/{txid}")
    print(f"📱 Your contract is now live on Algorand Testnet!")
    '''
    
    print(deployment_code)
    
    print("\n" + "="*50)
    print("SAFETY REMINDERS:")
    print("="*50)
    print("⚠️  NEVER share your private key")
    print("⚠️  NEVER commit private keys to code repositories")
    print("⚠️  Use testnet for testing, mainnet for production")
    print("⚠️  Always test thoroughly before mainnet deployment")
    
    return True

if __name__ == "__main__":
    deploy_contract()
