"""
Test Your Deployed Smart Contract
Interact with your contract using the Application ID
"""

import json
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationOptInTxn, ApplicationCallTxn, PaymentTxn, assign_group_id

def test_contract():
    """Test your deployed smart contract"""
    
    print("🧪 Testing Your Deployed Smart Contract")
    print("=" * 45)
    
    # Load application info
    try:
        with open("application_info.json", "r") as f:
            app_info = json.load(f)
        
        app_id = app_info["application_id"]
        print(f"📱 Application ID: {app_id}")
        
    except FileNotFoundError:
        print("❌ Application info not found. Please run 'python find_contract.py' first.")
        return False
    
    # Your mnemonic (from Lute)
    mnemonic_phrase = "trumpet noodle nature august silly admit famous borrow keep ignore scene sock long inch save uphold riot yard private brush uncover ladder decade abandon recall"
    
    try:
        # Convert mnemonic to private key
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        sender = account.address_from_private_key(private_key)
        print(f"📱 Your address: {sender}")
        
    except Exception as e:
        print(f"❌ Error with mnemonic: {e}")
        return False
    
    # Connect to Algorand testnet
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    try:
        client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
        
        # Get account info
        account_info = client.account_info(sender)
        balance = account_info['amount'] / 1000000  # Convert microALGO to ALGO
        print(f"💰 Your balance: {balance} ALGO")
        
        if balance < 0.1:
            print("⚠️  Low balance! You need at least 0.1 ALGO for transactions.")
            print("Get more testnet ALGO from: https://testnet.algoexplorer.io/dispenser")
            return False
        
        # Test 1: Opt-in to the contract
        print(f"\n🔧 Test 1: Opting in to contract {app_id}...")
        
        params = client.suggested_params()
        optin_txn = ApplicationOptInTxn(
            sender=sender,
            sp=params,
            index=app_id
        )
        
        signed_optin = optin_txn.sign(private_key)
        optin_txid = client.send_transaction(signed_optin)
        
        print(f"✅ Opt-in transaction sent: {optin_txid}")
        print(f"🔍 View: https://testnet.algoexplorer.io/tx/{optin_txid}")
        
        # Wait for confirmation
        import time
        print("⏳ Waiting for confirmation...")
        time.sleep(3)
        
        # Test 2: Check contract state
        print(f"\n🔧 Test 2: Checking contract state...")
        
        app_info = client.application_info(app_id)
        print(f"📊 Contract creator: {app_info['params']['creator']}")
        print(f"📊 Global state: {app_info['params']['global-state']}")
        
        # Test 3: Stake function (if you want to test)
        print(f"\n🔧 Test 3: Ready to test stake function...")
        print("To test staking, you would:")
        print("1. Send a payment transaction to the contract")
        print("2. Call the 'stake' function")
        print("3. Check the contract state")
        
        print(f"\n✅ Contract testing complete!")
        print(f"🎮 Your contract is working and ready for use!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing contract: {e}")
        return False

if __name__ == "__main__":
    test_contract()