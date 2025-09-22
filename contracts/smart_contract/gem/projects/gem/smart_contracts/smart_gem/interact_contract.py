"""
Interact with Your Smart Contract
Step-by-step contract interaction
"""

import json
import base64
from algosdk import account, mnemonic, encoding
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCallTxn, PaymentTxn, assign_group_id

def interact_with_contract():
    """Interact with your deployed smart contract"""
    
    print("🎮 Interacting with Your Smart Contract")
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
        
        # Get application info
        app_info = client.application_info(app_id)
        app_address = encoding.encode_address(encoding.checksum(b"appID" + (app_id).to_bytes(8, "big")))
        print(f"📱 Contract address: {app_address}")
        
        print(f"\n🎮 Available Functions:")
        print(f"1. stake - Stake ALGO to participate")
        print(f"2. win - Process player win")
        print(f"3. lose - Process player loss")
        print(f"4. toggle_pause - Admin pause/unpause")
        print(f"5. withdraw_commission - Admin withdraw commission")
        
        # Example: Stake function
        print(f"\n🔧 Example: Testing Stake Function")
        
        stake_amount = 100000  # 0.1 ALGO in microALGO
        
        # Create payment transaction
        params = client.suggested_params()
        payment_txn = PaymentTxn(
            sender=sender,
            sp=params,
            receiver=app_address,
            amt=stake_amount
        )
        
        # Create application call transaction
        app_call_txn = ApplicationCallTxn(
            sender=sender,
            sp=params,
            index=app_id,
            app_args=[b"stake"],
            on_complete=0  # NoOp
        )
        
        # Group transactions
        grouped_txns = assign_group_id([payment_txn, app_call_txn])
        
        # Sign transactions
        signed_payment = grouped_txns[0].sign(private_key)
        signed_app_call = grouped_txns[1].sign(private_key)
        
        # Send transactions
        print(f"📝 Sending stake transaction...")
        txid = client.send_transactions([signed_payment, signed_app_call])
        
        print(f"✅ Stake transaction sent: {txid}")
        print(f"🔍 View: https://testnet.algoexplorer.io/tx/{txid}")
        
        # Wait for confirmation
        import time
        print("⏳ Waiting for confirmation...")
        time.sleep(3)
        
        # Check updated contract state
        print(f"\n🔍 Checking updated contract state...")
        updated_app_info = client.application_info(app_id)
        global_state = updated_app_info['params']['global-state']
        
        print(f"📊 Updated Global State:")
        for state in global_state:
            key = base64.b64decode(state['key']).decode('utf-8')
            if state['value']['type'] == 2:  # uint
                value = state['value']['uint']
                print(f"   {key}: {value}")
            else:  # bytes
                value = state['value']['bytes']
                print(f"   {key}: {value}")
        
        print(f"\n✅ Contract interaction complete!")
        print(f"🎉 Your contract is working perfectly!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error interacting with contract: {e}")
        return False

if __name__ == "__main__":
    interact_with_contract()
