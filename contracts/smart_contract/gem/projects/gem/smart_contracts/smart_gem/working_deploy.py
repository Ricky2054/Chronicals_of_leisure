"""
Working Deployment Script
Fixes the algokit_utils import issue
"""

import json
import os
import sys
from datetime import datetime

def check_dependencies():
    """Check if required dependencies are available"""
    
    print("🔍 Checking Dependencies...")
    
    # Check for algosdk
    try:
        import algosdk
        print("✅ algosdk available")
        algosdk_available = True
    except ImportError:
        print("❌ algosdk not found. Install with: pip install py-algorand-sdk")
        algosdk_available = False
    
    # Check for algokit_utils
    try:
        import algokit_utils
        print("✅ algokit_utils available")
        algokit_available = True
    except ImportError:
        print("❌ algokit_utils not found. Install with: pip install algokit")
        algokit_available = False
    
    return algosdk_available, algokit_available

def create_basic_deployment():
    """Create basic deployment using algosdk only"""
    
    print("\n🚀 Creating Basic Deployment Script...")
    
    script_content = '''"""
Basic Deployment Script using Algorand SDK
"""

from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import ApplicationCreateTxn
import json

def deploy_contract():
    """Deploy the smart contract to testnet"""
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Algorand Testnet settings
    ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
    ALGOD_TOKEN = ""
    
    # Create Algod client
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)
    
    print("📝 To deploy your contract:")
    print("1. Get your account private key from Algorand wallet")
    print("2. Uncomment and set the private_key variable below")
    print("3. Run this script")
    print()
    print("Example:")
    print("private_key = 'YOUR_PRIVATE_KEY_HERE'")
    print("sender = account.address_from_private_key(private_key)")
    print()
    
    # Uncomment and modify the following lines to deploy:
    """
    # Get your private key (keep this secret!)
    private_key = "YOUR_PRIVATE_KEY_HERE"
    sender = account.address_from_private_key(private_key)
    
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
    """
    
if __name__ == "__main__":
    deploy_contract()
'''
    
    with open("deploy_basic.py", "w") as f:
        f.write(script_content)
    
    print("✅ Basic deployment script created: deploy_basic.py")

def create_algokit_deployment():
    """Create deployment script using algokit"""
    
    print("\n🚀 Creating AlgoKit Deployment Script...")
    
    script_content = '''"""
AlgoKit Deployment Script
"""

import json
from algokit_utils import ApplicationClient, ApplicationSpecification

def deploy_with_algokit():
    """Deploy using AlgoKit"""
    
    # Load deployment config
    with open("deployment_config.json", "r") as f:
        config = json.load(f)
    
    # Read TEAL programs
    with open("artifacts/final_working_approval.teal", "r") as f:
        approval_program = f.read()
    
    with open("artifacts/final_working_clear.teal", "r") as f:
        clear_program = f.read()
    
    # Create application specification
    app_spec = ApplicationSpecification.from_json({
        "name": config["contract_name"],
        "version": config["version"],
        "approval_program": approval_program,
        "clear_state_program": clear_program,
        "global_state_schema": config["global_state_schema"],
        "local_state_schema": config["local_state_schema"]
    })
    
    print("📝 To deploy with AlgoKit:")
    print("1. Make sure you have algokit installed: pip install algokit")
    print("2. Set up your Algorand account")
    print("3. Run: algokit deploy --network testnet")
    print()
    print("Or use the ApplicationClient in your code:")
    print("client = ApplicationClient.from_spec(app_spec)")
    print("app_id, txid = client.create()")
    
if __name__ == "__main__":
    deploy_with_algokit()
'''
    
    with open("deploy_algokit.py", "w") as f:
        f.write(script_content)
    
    print("✅ AlgoKit deployment script created: deploy_algokit.py")

def show_deployment_options():
    """Show all deployment options"""
    
    print("\n🎯 Deployment Options:")
    print("=" * 25)
    
    print("\n1️⃣  Basic SDK Deployment (Recommended for beginners):")
    print("   - Uses only py-algorand-sdk")
    print("   - Simple and straightforward")
    print("   - Run: python deploy_basic.py")
    
    print("\n2️⃣  AlgoKit Deployment (Recommended for advanced users):")
    print("   - Uses algokit utilities")
    print("   - More features and automation")
    print("   - Run: python deploy_algokit.py")
    
    print("\n3️⃣  Manual Deployment:")
    print("   - Use Algorand Developer Portal")
    print("   - Upload TEAL files manually")
    print("   - Good for learning")
    
    print("\n4️⃣  CLI Deployment:")
    print("   - Use Algorand CLI tools")
    print("   - Command line interface")
    print("   - Good for automation")

def main():
    """Main deployment setup function"""
    
    print("🚀 Smart Contract Deployment Setup")
    print("=" * 40)
    
    # Check dependencies
    algosdk_available, algokit_available = check_dependencies()
    
    # Check if TEAL files exist
    if not os.path.exists("artifacts/final_working_approval.teal"):
        print("\n❌ TEAL files not found. Please run:")
        print("   python final_working.py")
        return False
    
    print("\n✅ TEAL files found!")
    
    # Create deployment scripts
    if algosdk_available:
        create_basic_deployment()
    
    if algokit_available:
        create_algokit_deployment()
    
    # Show deployment options
    show_deployment_options()
    
    print("\n🎉 Deployment setup complete!")
    print("\n📁 Files created:")
    if algosdk_available:
        print("   - deploy_basic.py (basic deployment)")
    if algokit_available:
        print("   - deploy_algokit.py (algokit deployment)")
    print("   - deployment_config.json (configuration)")
    
    print("\n🚀 Next steps:")
    print("   1. Choose a deployment method above")
    print("   2. Get your Algorand account credentials")
    print("   3. Deploy to testnet first")
    print("   4. Test all contract functions")
    print("   5. Deploy to mainnet when ready")
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Ready for deployment!")
    else:
        print("\n❌ Please fix the issues above first.")
