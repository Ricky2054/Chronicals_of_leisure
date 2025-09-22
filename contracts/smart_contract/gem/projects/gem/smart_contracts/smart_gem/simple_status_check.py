"""
Simple Contract Status Check
Check your contract status without calling problematic functions
"""

import json
import base64
from algosdk import account, mnemonic, encoding
from algosdk.v2client import algod

def check_contract_status():
    """Check your contract status"""
    
    print("📊 Smart Contract Status Check")
    print("=" * 40)
    
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
        global_state = app_info['params']['global-state']
        
        print(f"\n📊 Contract State Analysis:")
        print("=" * 30)
        
        # Parse state
        state_dict = {}
        for state in global_state:
            key = base64.b64decode(state['key']).decode('utf-8')
            if state['value']['type'] == 2:  # uint
                value = state['value']['uint']
                state_dict[key] = value
                print(f"   {key}: {value}")
            else:  # bytes
                value = state['value']['bytes']
                state_dict[key] = value
                print(f"   {key}: {value}")
        
        # Analyze state
        print(f"\n🎮 Game Status:")
        print("=" * 20)
        
        game_state = state_dict.get('GAME_STATE', 0)
        total_staked = state_dict.get('TOTAL_STAKED', 0)
        paused = state_dict.get('PAUSED', 0)
        commission_pool = state_dict.get('COMMISSION_POOL', 0)
        
        print(f"   Game State: {game_state} ({'Staked' if game_state == 1 else 'Idle'})")
        print(f"   Total Staked: {total_staked} microALGO ({total_staked/1000000:.6f} ALGO)")
        print(f"   Paused: {paused} ({'Yes' if paused == 1 else 'No'})")
        print(f"   Commission Pool: {commission_pool} microALGO ({commission_pool/1000000:.6f} ALGO)")
        
        # Check if you have a stake
        print(f"\n🔍 Player Status:")
        print("=" * 20)
        
        # Get local state for your account
        try:
            local_state = client.account_info(sender)
            # Look for local state in the account info
            if 'apps-local-state' in local_state:
                for app in local_state['apps-local-state']:
                    if app['id'] == app_id:
                        print(f"   ✅ You are opted into the contract")
                        if 'key-value' in app:
                            print(f"   📊 Your Local State:")
                            for kv in app['key-value']:
                                key = base64.b64decode(kv['key']).decode('utf-8')
                                if kv['value']['type'] == 2:  # uint
                                    value = kv['value']['uint']
                                    print(f"      {key}: {value}")
                                else:  # bytes
                                    value = kv['value']['bytes']
                                    print(f"      {key}: {value}")
                        break
                else:
                    print(f"   ❌ You are not opted into the contract")
            else:
                print(f"   ❌ You are not opted into the contract")
        except:
            print(f"   ❌ Could not check local state")
        
        print(f"\n✅ Contract Status Summary:")
        print("=" * 35)
        
        print(f"   📱 Contract: Successfully deployed")
        print(f"   🆔 Application ID: {app_id}")
        print(f"   🌐 Network: Algorand Testnet")
        print(f"   💰 Your Balance: {balance} ALGO")
        print(f"   🎮 Game State: {'Active' if game_state == 1 else 'Idle'}")
        print(f"   ⏸️  Paused: {'Yes' if paused == 1 else 'No'}")
        
        if total_staked > 0:
            print(f"   💎 Total Staked: {total_staked/1000000:.6f} ALGO")
        
        if commission_pool > 0:
            print(f"   🏦 Commission Pool: {commission_pool/1000000:.6f} ALGO")
        
        print(f"\n🎯 Next Steps:")
        print("=" * 15)
        
        if game_state == 1 and total_staked > 0:
            print(f"   🎮 Game is active with stakes")
            print(f"   💡 You can test win/lose functions")
            print(f"   ⚠️  Note: There's a bug in the win function (fee issue)")
        
        if game_state == 0:
            print(f"   🎮 Game is idle")
            print(f"   💡 You can stake to participate")
        
        if paused == 1:
            print(f"   ⏸️  Contract is paused")
            print(f"   💡 Admin can unpause it")
        
        print(f"\n🌐 View Your Contract:")
        print(f"   https://algoexplorer.io/application/{app_id}")
        print(f"   (Make sure to switch to Testnet mode)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking contract status: {e}")
        return False

if __name__ == "__main__":
    check_contract_status()
