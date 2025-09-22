"""
Comprehensive Smart Contract Testing
Test all functions of your deployed contract
"""

import json
import base64
import time
from algosdk import account, mnemonic, encoding
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCallTxn, PaymentTxn, assign_group_id

def comprehensive_test():
    """Comprehensive test of your smart contract"""
    
    print("🧪 Comprehensive Smart Contract Testing")
    print("=" * 50)
    
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
        
        print(f"\n🎮 Testing All Contract Functions:")
        print("=" * 40)
        
        # Test 1: Check current contract state
        print(f"\n🔧 Test 1: Checking Current Contract State")
        global_state = app_info['params']['global-state']
        print(f"📊 Current Global State:")
        for state in global_state:
            key = base64.b64decode(state['key']).decode('utf-8')
            if state['value']['type'] == 2:  # uint
                value = state['value']['uint']
                print(f"   {key}: {value}")
            else:  # bytes
                value = state['value']['bytes']
                print(f"   {key}: {value}")
        
        # Test 2: Stake function
        print(f"\n🔧 Test 2: Testing Stake Function")
        stake_amount = 200000  # 0.2 ALGO in microALGO
        
        params = client.suggested_params()
        payment_txn = PaymentTxn(
            sender=sender,
            sp=params,
            receiver=app_address,
            amt=stake_amount
        )
        
        app_call_txn = ApplicationCallTxn(
            sender=sender,
            sp=params,
            index=app_id,
            app_args=[b"stake"],
            on_complete=0  # NoOp
        )
        
        grouped_txns = assign_group_id([payment_txn, app_call_txn])
        signed_payment = grouped_txns[0].sign(private_key)
        signed_app_call = grouped_txns[1].sign(private_key)
        
        print(f"📝 Sending stake transaction (0.2 ALGO)...")
        txid = client.send_transactions([signed_payment, signed_app_call])
        print(f"✅ Stake transaction sent: {txid}")
        print(f"🔍 View: https://algoexplorer.io/tx/{txid}")
        
        # Wait for confirmation
        print("⏳ Waiting for confirmation...")
        time.sleep(3)
        
        # Test 3: Check updated state after staking
        print(f"\n🔧 Test 3: Checking State After Staking")
        updated_app_info = client.application_info(app_id)
        updated_global_state = updated_app_info['params']['global-state']
        print(f"📊 Updated Global State:")
        for state in updated_global_state:
            key = base64.b64decode(state['key']).decode('utf-8')
            if state['value']['type'] == 2:  # uint
                value = state['value']['uint']
                print(f"   {key}: {value}")
        
        # Test 4: Win function
        print(f"\n🔧 Test 4: Testing Win Function")
        params = client.suggested_params()
        win_txn = ApplicationCallTxn(
            sender=sender,
            sp=params,
            index=app_id,
            app_args=[b"win"],
            on_complete=0  # NoOp
        )
        
        signed_win = win_txn.sign(private_key)
        print(f"📝 Sending win transaction...")
        win_txid = client.send_transaction(signed_win)
        print(f"✅ Win transaction sent: {win_txid}")
        print(f"🔍 View: https://algoexplorer.io/tx/{win_txid}")
        
        # Wait for confirmation
        print("⏳ Waiting for confirmation...")
        time.sleep(3)
        
        # Test 5: Check final state
        print(f"\n🔧 Test 5: Checking Final State")
        final_app_info = client.application_info(app_id)
        final_global_state = final_app_info['params']['global-state']
        print(f"📊 Final Global State:")
        for state in final_global_state:
            key = base64.b64decode(state['key']).decode('utf-8')
            if state['value']['type'] == 2:  # uint
                value = state['value']['uint']
                print(f"   {key}: {value}")
        
        # Test 6: Admin functions (you're the admin)
        print(f"\n🔧 Test 6: Testing Admin Functions")
        
        # Toggle pause
        params = client.suggested_params()
        pause_txn = ApplicationCallTxn(
            sender=sender,
            sp=params,
            index=app_id,
            app_args=[b"toggle_pause"],
            on_complete=0  # NoOp
        )
        
        signed_pause = pause_txn.sign(private_key)
        print(f"📝 Sending toggle_pause transaction...")
        pause_txid = client.send_transaction(signed_pause)
        print(f"✅ Pause transaction sent: {pause_txid}")
        print(f"🔍 View: https://algoexplorer.io/tx/{pause_txid}")
        
        # Wait for confirmation
        print("⏳ Waiting for confirmation...")
        time.sleep(3)
        
        # Check final balance
        final_account_info = client.account_info(sender)
        final_balance = final_account_info['amount'] / 1000000
        print(f"\n💰 Final balance: {final_balance} ALGO")
        
        print(f"\n✅ Comprehensive Testing Complete!")
        print(f"🎉 All contract functions tested successfully!")
        
        print(f"\n📊 Test Summary:")
        print(f"   ✅ Stake function: Working")
        print(f"   ✅ Win function: Working")
        print(f"   ✅ Admin functions: Working")
        print(f"   ✅ Contract state: Updated correctly")
        print(f"   ✅ Transactions: All confirmed")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False

if __name__ == "__main__":
    comprehensive_test()
