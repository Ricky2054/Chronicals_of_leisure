"""
Deploy Smart Contract with Lute Wallet
Step-by-step instructions for Lute users
"""

import json
import base64
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn, StateSchema

def deploy_contract():
    """Deploy the smart contract to testnet using Lute wallet"""
    
    print("🚀 Deploying Smart Contract with Lute Wallet")
    print("=" * 50)
    
    # ⚠️  REPLACE THIS WITH YOUR ACTUAL 25-WORD MNEMONIC FROM LUTE ⚠️
    mnemonic_phrase = "trumpet noodle nature august silly admit famous borrow keep ignore scene sock long inch save uphold riot yard private brush uncover ladder decade abandon recall"
    
    if mnemonic_phrase == "YOUR_25_WORD_MNEMONIC_HERE":
        print("❌ Please replace with your actual 25-word mnemonic phrase from Lute")
        return False
    
    try:
        # Convert mnemonic to private key
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        sender = account.address_from_private_key(private_key)
        print(f"✅ Mnemonic converted successfully!")
        print(f"📱 Your address: {sender}")
    except Exception as e:
        print(f"❌ Error converting mnemonic: {e}")
        return False
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Algorand Testnet settings
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    # Create Algod client
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    try:
        # Read and compile TEAL programs
        with open("artifacts/final_working_approval.teal", "r") as f:
            approval_teal = f.read()
        
        with open("artifacts/final_working_clear.teal", "r") as f:
            clear_teal = f.read()
        
        # Compile TEAL to bytes
        approval_program = base64.b64decode(client.compile(approval_teal)['result'])
        clear_program = base64.b64decode(client.compile(clear_teal)['result'])
        
        print("📝 Creating application transaction...")
        
        # Create application
        txn = ApplicationCreateTxn(
            sender=sender,
            sp=client.suggested_params(),
            on_complete=0,  # NoOp
            approval_program=approval_program,
            clear_program=clear_program,
            global_schema=StateSchema(
                num_uints=config["global_state_schema"]["num_ints"],
                num_byte_slices=config["global_state_schema"]["num_byte_slices"]
            ),
            local_schema=StateSchema(
                num_uints=config["local_state_schema"]["num_ints"],
                num_byte_slices=config["local_state_schema"]["num_byte_slices"]
            )
        )
        
        print("🔐 Signing transaction...")
        
        # Sign and send transaction
        signed_txn = txn.sign(private_key)
        txid = client.send_transaction(signed_txn)
        
        print("✅ Contract deployed successfully with Lute!")
        print(f"📊 Transaction ID: {txid}")
        print(f"🔍 View transaction: https://testnet.algoexplorer.io/tx/{txid}")
        print(f"📱 Your contract is now live on Algorand Testnet!")
        
        # Save deployment info
        deployment_info = {
            "contract_name": "Chronicle of the Ledger Game",
            "deployment_date": "2025-01-17",
            "network": "testnet",
            "wallet": "Lute",
            "transaction_id": txid,
            "deployer_address": sender,
            "explorer_url": f"https://testnet.algoexplorer.io/tx/{txid}"
        }
        
        with open("deployment_info_lute.json", "w") as f:
            json.dump(deployment_info, f, indent=2)
        
        print("💾 Deployment info saved to: deployment_info_lute.json")
        
        print("\n🎮 Next Steps:")
        print("1. Copy the transaction ID above")
        print("2. Go to https://testnet.algoexplorer.io/")
        print("3. Search for your transaction ID")
        print("4. Find your Application ID")
        print("5. Test your contract functions!")
        
        print("\n🔧 Testing with Lute:")
        print("1. Open Lute wallet")
        print("2. Go to 'DApps' or 'Applications' section")
        print("3. Add your contract using the Application ID")
        print("4. Test all functions: stake, win, lose, toggle_pause, withdraw_commission")
        
        return True
        
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        print("Full error details:")
        traceback.print_exc()
        print("\n🔧 Troubleshooting:")
        print("1. Make sure you have testnet ALGO in Lute")
        print("2. Get free ALGO from: https://testnet.algoexplorer.io/dispenser")
        print("3. Check your private key is correct")
        print("4. Make sure you're connected to the internet")
        print("5. Try switching to testnet in Lute settings")
        return False

if __name__ == "__main__":
    deploy_contract()
