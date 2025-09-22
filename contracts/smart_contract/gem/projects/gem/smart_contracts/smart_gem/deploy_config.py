"""
Deployment configuration for Chronicle of the Ledger smart contract
"""

from algokit_utils import (
    ApplicationClient,
    ApplicationSpecification,
    get_algod_client,
    get_indexer_client,
    get_account,
    get_localnet_default_account,
    get_testnet_account,
    get_mainnet_account,
)
from algosdk import transaction
import json
import os
import sys

def deploy_contract(network="testnet"):
    """Deploy the game contract to the specified network"""
    
    print(f"�� Starting deployment to {network}...")
    
    # Get clients
    algod_client = get_algod_client(network)
    indexer_client = get_indexer_client(network)
    
    # Get account
    if network == "localnet":
        account = get_localnet_default_account(algod_client)
    elif network == "testnet":
        account = get_testnet_account(algod_client)
    else:
        account = get_mainnet_account(algod_client)
    
    print(f"📋 Deploying with account: {account.address}")
    
    # Load contract
    from contract import GameContract
    contract = GameContract()
    
    # Compile contract
    approval_teal, clear_teal = contract.compile()
    
    # Create application specification
    app_spec = ApplicationSpecification.from_json({
        "name": "ChronicleLedgerGame",
        "version": "1.0.0",
        "approval_program": approval_teal,
        "clear_state_program": clear_teal,
        "global_state_schema": {
            "num_byte_slices": 8,  # Updated for new state keys
            "num_ints": 8
        },
        "local_state_schema": {
            "num_byte_slices": 7,  # Updated for new player state keys
            "num_ints": 7
        }
    })
    
    # Create application client
    app_client = ApplicationClient(
        algod_client=algod_client,
        app_spec=app_spec,
        signer=account
    )
    
    # Deploy the contract
    print("�� Deploying contract...")
    app_id, app_address, tx_id = app_client.create()
    
    print(f"✅ Contract deployed successfully!")
    print(f"📋 App ID: {app_id}")
    print(f"📍 App Address: {app_address}")
    print(f"🔗 Transaction ID: {tx_id}")
    
    # Save deployment info
    deployment_info = {
        "network": network,
        "app_id": app_id,
        "app_address": app_address,
        "tx_id": tx_id,
        "deployer": account.address,
        "deployment_time": str(transaction.get_current_timestamp()),
        "contract_version": "1.0.0"
    }
    
    # Create artifacts directory if it doesn't exist
    os.makedirs("artifacts", exist_ok=True)
    
    with open(f"artifacts/deployment_{network}.json", "w") as f:
        json.dump(deployment_info, f, indent=2)
    
    print(f"💾 Deployment info saved to: artifacts/deployment_{network}.json")
    
    return app_id, app_address, tx_id

def verify_deployment(network="testnet"):
    """Verify the deployment by checking the contract state"""
    
    try:
        with open(f"artifacts/deployment_{network}.json", "r") as f:
            deployment_info = json.load(f)
        
        app_id = deployment_info["app_id"]
        app_address = deployment_info["app_address"]
        
        # Get clients
        algod_client = get_algod_client(network)
        
        # Get application info
        app_info = algod_client.application_info(app_id)
        
        print(f"✅ Deployment verification successful!")
        print(f"📋 App ID: {app_id}")
        print(f"📍 App Address: {app_address}")
        print(f"🔍 App Info: {app_info}")
        
        return True
    except Exception as e:
        print(f"❌ Deployment verification failed: {e}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Deploy Chronicle of the Ledger smart contract")
    parser.add_argument("network", choices=["localnet", "testnet", "mainnet"], 
                       default="testnet", help="Network to deploy to")
    parser.add_argument("--verify", action="store_true", help="Verify deployment")
    
    args = parser.parse_args()
    
    if args.verify:
        verify_deployment(args.network)
    else:
        deploy_contract(args.network)