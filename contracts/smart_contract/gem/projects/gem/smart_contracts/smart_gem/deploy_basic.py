"""
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
