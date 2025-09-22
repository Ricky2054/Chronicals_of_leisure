"""
Test Your Smart Contract with Different Wallets
Guide for testing with Pera, MyAlgo, and other wallets
"""

import json

def test_with_other_wallets():
    """Guide for testing your contract with different wallets"""
    
    print("🧪 Testing Your Contract with Different Wallets")
    print("=" * 50)
    
    # Load application info
    try:
        with open("application_info.json", "r") as f:
            app_info = json.load(f)
        
        app_id = app_info["application_id"]
        print(f"📱 Your Contract Application ID: {app_id}")
        
    except FileNotFoundError:
        print("❌ Application info not found. Please run 'python find_contract.py' first.")
        return False
    
    print(f"\n🎮 Your Contract Details:")
    print(f"   Application ID: {app_id}")
    print(f"   Network: Algorand Testnet")
    print(f"   Contract Address: IT2YZ5XEUAHYES5H4YR4DX5WJE4GYFSK6JPGW4ZSGWWDWSVWWHWJS5JERY")
    
    print(f"\n🔧 How to Test with Different Wallets:")
    print("=" * 45)
    
    print(f"\n1️⃣  **Pera Wallet (Mobile/Desktop):**")
    print(f"   - Download Pera Wallet app")
    print(f"   - Create new account or import existing")
    print(f"   - Switch to Testnet mode")
    print(f"   - Get testnet ALGO from dispenser")
    print(f"   - Go to 'Discover' or 'DApps' section")
    print(f"   - Add your contract using Application ID: {app_id}")
    print(f"   - Test functions: stake, win, lose")
    
    print(f"\n2️⃣  **MyAlgo Wallet (Web):**")
    print(f"   - Go to: https://wallet.myalgo.com/")
    print(f"   - Create new wallet or import existing")
    print(f"   - Switch to Testnet")
    print(f"   - Get testnet ALGO from dispenser")
    print(f"   - Use Algorand SDK to interact with contract")
    print(f"   - Application ID: {app_id}")
    
    print(f"\n3️⃣  **Algorand Wallet (Official):**")
    print(f"   - Download from app store")
    print(f"   - Create account and switch to Testnet")
    print(f"   - Get testnet ALGO")
    print(f"   - Use for testing contract interactions")
    
    print(f"\n4️⃣  **Algorand Explorer (Web Interface):**")
    print(f"   - Go to: https://testnet.algoexplorer.io/")
    print(f"   - Search for Application ID: {app_id}")
    print(f"   - View contract state and transactions")
    print(f"   - Use for monitoring contract activity")
    
    print(f"\n🎯 **Testing Steps for Any Wallet:**")
    print("=" * 35)
    
    print(f"\nStep 1: Get Testnet ALGO")
    print(f"   - Use dispenser: https://testnet.algoexplorer.io/dispenser")
    print(f"   - Enter your wallet address")
    print(f"   - Get 10 free testnet ALGO")
    
    print(f"\nStep 2: Opt-in to Contract")
    print(f"   - Application ID: {app_id}")
    print(f"   - This allows your wallet to interact with the contract")
    
    print(f"\nStep 3: Test Functions")
    print(f"   - stake: Send ALGO to contract + call stake function")
    print(f"   - win: Call win function (if you have a stake)")
    print(f"   - lose: Call lose function (if you have a stake)")
    print(f"   - toggle_pause: Admin function (only contract creator)")
    print(f"   - withdraw_commission: Admin function (only contract creator)")
    
    print(f"\n📊 **Contract Functions Available:**")
    print("=" * 35)
    
    print(f"\n🎮 **Player Functions:**")
    print(f"   - stake: Stake ALGO to participate in games")
    print(f"   - win: Process player win (get stake + 10% bonus)")
    print(f"   - lose: Process player loss (pay 5% commission)")
    
    print(f"\n👑 **Admin Functions (Only for contract creator):**")
    print(f"   - toggle_pause: Pause/unpause contract")
    print(f"   - withdraw_commission: Withdraw accumulated commission")
    
    print(f"\n🌐 **Useful Links:**")
    print("=" * 20)
    
    print(f"   - Your Contract: https://testnet.algoexplorer.io/application/{app_id}")
    print(f"   - Testnet Dispenser: https://testnet.algoexplorer.io/dispenser")
    print(f"   - Algorand Explorer: https://testnet.algoexplorer.io/")
    print(f"   - Pera Wallet: https://perawallet.app/")
    print(f"   - MyAlgo Wallet: https://wallet.myalgo.com/")
    
    print(f"\n✅ **Your contract is ready for testing with any wallet!**")
    print(f"   Just use Application ID: {app_id}")
    
    return True

if __name__ == "__main__":
    test_with_other_wallets()
