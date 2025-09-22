"""
Fixed Deployment Script
No encoding issues
"""

import json
import os
import sys
from datetime import datetime

def check_dependencies():
    """Check if required dependencies are available"""
    
    print("Checking Dependencies...")
    
    # Check for algosdk
    try:
        import algosdk
        print("SUCCESS: algosdk available")
        algosdk_available = True
    except ImportError:
        print("ERROR: algosdk not found. Install with: pip install py-algorand-sdk")
        algosdk_available = False
    
    # Check for algokit_utils
    try:
        import algokit_utils
        print("SUCCESS: algokit_utils available")
        algokit_available = True
    except ImportError:
        print("ERROR: algokit_utils not found. Install with: pip install algokit")
        algokit_available = False
    
    return algosdk_available, algokit_available

def create_basic_deployment():
    """Create basic deployment using algosdk only"""
    
    print("\nCreating Basic Deployment Script...")
    
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
    
    print("To deploy your contract:")
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
    
    print(f"Contract deployed! Transaction ID: {txid}")
    print(f"Check transaction at: https://testnet.algoexplorer.io/tx/{txid}")
    """
    
if __name__ == "__main__":
    deploy_contract()
'''
    
    with open("deploy_basic.py", "w", encoding='utf-8') as f:
        f.write(script_content)
    
    print("SUCCESS: Basic deployment script created: deploy_basic.py")

def show_deployment_options():
    """Show all deployment options"""
    
    print("\nDeployment Options:")
    print("=" * 25)
    
    print("\n1. Basic SDK Deployment (Recommended for beginners):")
    print("   - Uses only py-algorand-sdk")
    print("   - Simple and straightforward")
    print("   - Run: python deploy_basic.py")
    
    print("\n2. AlgoKit Deployment (Recommended for advanced users):")
    print("   - Uses algokit utilities")
    print("   - More features and automation")
    print("   - Run: algokit deploy --network testnet")
    
    print("\n3. Manual Deployment:")
    print("   - Use Algorand Developer Portal")
    print("   - Upload TEAL files manually")
    print("   - Good for learning")
    
    print("\n4. CLI Deployment:")
    print("   - Use Algorand CLI tools")
    print("   - Command line interface")
    print("   - Good for automation")

def main():
    """Main deployment setup function"""
    
    print("Smart Contract Deployment Setup")
    print("=" * 40)
    
    # Check dependencies
    algosdk_available, algokit_available = check_dependencies()
    
    # Check if TEAL files exist
    if not os.path.exists("artifacts/final_working_approval.teal"):
        print("\nERROR: TEAL files not found. Please run:")
        print("   python final_working.py")
        return False
    
    print("\nSUCCESS: TEAL files found!")
    
    # Create deployment scripts
    if algosdk_available:
        create_basic_deployment()
    
    # Show deployment options
    show_deployment_options()
    
    print("\nDeployment setup complete!")
    print("\nFiles created:")
    if algosdk_available:
        print("   - deploy_basic.py (basic deployment)")
    print("   - deployment_config.json (configuration)")
    
    print("\nNext steps:")
    print("   1. Choose a deployment method above")
    print("   2. Get your Algorand account credentials")
    print("   3. Deploy to testnet first")
    print("   4. Test all contract functions")
    print("   5. Deploy to mainnet when ready")
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\nSUCCESS: Ready for deployment!")
    else:
        print("\nERROR: Please fix the issues above first.")
