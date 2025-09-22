"""
Find Your Deployed Smart Contract
Get the Application ID and contract details
"""

import json
from algosdk.v2client import algod

def find_contract():
    """Find your deployed contract and get Application ID"""
    
    print("🔍 Finding Your Deployed Smart Contract")
    print("=" * 45)
    
    # Load deployment info
    try:
        with open("deployment_info_lute.json", "r") as f:
            deployment_info = json.load(f)
        
        transaction_id = deployment_info["transaction_id"]
        deployer_address = deployment_info["deployer_address"]
        
        print(f"📊 Transaction ID: {transaction_id}")
        print(f"📱 Deployer Address: {deployer_address}")
        
    except FileNotFoundError:
        print("❌ Deployment info not found. Please deploy your contract first.")
        return False
    
    # Connect to Algorand testnet
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    try:
        client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
        
        # Get transaction details
        print("\n🔍 Getting transaction details...")
        txn_info = client.pending_transaction_info(transaction_id)
        
        if 'confirmed-round' in txn_info and txn_info['confirmed-round'] > 0:
            print("✅ Transaction confirmed!")
            
            # Get application ID from transaction
            if 'application-index' in txn_info:
                app_id = txn_info['application-index']
                print(f"🎉 Application ID: {app_id}")
                
                # Get application info
                print("\n📋 Getting application details...")
                app_info = client.application_info(app_id)
                
                print(f"📱 Application Address: {app_info['params']['creator']}")
                print(f"📊 Global State Schema: {app_info['params']['global-state-schema']}")
                print(f"📊 Local State Schema: {app_info['params']['local-state-schema']}")
                
                # Save application info
                app_info_data = {
                    "application_id": app_id,
                    "application_address": app_info['params']['creator'],
                    "transaction_id": transaction_id,
                    "deployer_address": deployer_address,
                    "explorer_url": f"https://testnet.algoexplorer.io/application/{app_id}",
                    "transaction_url": f"https://testnet.algoexplorer.io/tx/{transaction_id}"
                }
                
                with open("application_info.json", "w") as f:
                    json.dump(app_info_data, f, indent=2)
                
                print(f"\n✅ Application info saved to: application_info.json")
                
                print(f"\n🌐 View Your Contract:")
                print(f"   Application: https://testnet.algoexplorer.io/application/{app_id}")
                print(f"   Transaction: https://testnet.algoexplorer.io/tx/{transaction_id}")
                
                print(f"\n🎮 Contract Functions Available:")
                print(f"   - stake: Stake ALGO to participate")
                print(f"   - win: Process player win")
                print(f"   - lose: Process player loss")
                print(f"   - toggle_pause: Admin pause/unpause")
                print(f"   - withdraw_commission: Admin withdraw commission")
                
                return True
            else:
                print("❌ No application ID found in transaction")
                return False
        else:
            print("⏳ Transaction not yet confirmed. Please wait a moment and try again.")
            return False
            
    except Exception as e:
        print(f"❌ Error getting contract info: {e}")
        print("\n🔧 Manual Steps:")
        print("1. Go to: https://testnet.algoexplorer.io/")
        print(f"2. Search for transaction: {transaction_id}")
        print("3. Look for 'Application ID' in the transaction details")
        return False

if __name__ == "__main__":
    find_contract()
