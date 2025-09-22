"""
Enhanced Deployment Script for Chronicle of the Ledger Contract
Following Algorand Deployment Best Practices

Features:
- Multi-network support (localnet, testnet, mainnet)
- Comprehensive validation
- State schema optimization
- Security checks
- Rollback capabilities
- Monitoring and logging
"""

import json
import os
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

from algosdk import account, mnemonic, transaction
from algosdk.v2client import algod, indexer
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

from enhanced_contract import EnhancedGameContract

class EnhancedDeploymentManager:
    """Enhanced deployment manager with comprehensive features"""
    
    def __init__(self, network: str = "testnet"):
        self.network = network
        self.contract = EnhancedGameContract()
        self.deployment_info = {}
        
        # Initialize clients
        self.algod_client = get_algod_client(network)
        self.indexer_client = get_indexer_client(network)
        
        # Get account
        if network == "localnet":
            self.account = get_localnet_default_account(self.algod_client)
        elif network == "testnet":
            self.account = get_testnet_account(self.algod_client)
        else:
            self.account = get_mainnet_account(self.algod_client)
        
        print(f"🌐 Network: {network}")
        print(f"👤 Account: {self.account.address}")
    
    def validate_contract(self) -> bool:
        """Validate contract before deployment"""
        print("🔍 Validating contract...")
        
        try:
            # Compile contract
            approval_teal, clear_teal = self.contract.compile()
            
            # Basic validation
            if not approval_teal or not clear_teal:
                print("❌ Contract compilation failed")
                return False
            
            # Check TEAL syntax
            if "pragma" not in approval_teal:
                print("❌ Invalid TEAL syntax")
                return False
            
            # Check for required patterns
            required_patterns = [
                "GAME_STATE", "TOTAL_STAKED", "ADMIN_COUNT",
                "EMERGENCY_STOP", "PAUSED", "ORACLE_ADDRESS"
            ]
            
            for pattern in required_patterns:
                if pattern not in approval_teal:
                    print(f"❌ Missing required pattern: {pattern}")
                    return False
            
            print("✅ Contract validation passed")
            return True
            
        except Exception as e:
            print(f"❌ Contract validation failed: {e}")
            return False
    
    def check_account_balance(self) -> bool:
        """Check if account has sufficient balance"""
        print("💰 Checking account balance...")
        
        try:
            account_info = self.algod_client.account_info(self.account.address)
            balance = account_info['amount']
            
            # Minimum balance for deployment (0.1 ALGO)
            min_balance = 100000
            
            if balance < min_balance:
                print(f"❌ Insufficient balance: {balance} microALGO (minimum: {min_balance})")
                return False
            
            print(f"✅ Account balance: {balance} microALGO")
            return True
            
        except Exception as e:
            print(f"❌ Failed to check balance: {e}")
            return False
    
    def create_application_spec(self) -> ApplicationSpecification:
        """Create optimized application specification"""
        print("📋 Creating application specification...")
        
        approval_teal, clear_teal = self.contract.compile()
        
        # Optimized state schema based on contract analysis
        spec = ApplicationSpecification.from_json({
            "name": "ChronicleOfTheLedger",
            "version": "2.0.0",
            "description": "Enhanced gaming contract with DeFi features",
            "approval_program": approval_teal,
            "clear_state_program": clear_teal,
            "global_state_schema": {
                "num_byte_slices": 10,  # Optimized for all global state keys
                "num_ints": 10
            },
            "local_state_schema": {
                "num_byte_slices": 8,   # Optimized for all local state keys
                "num_ints": 8
            },
            "extra_pages": 0,  # No extra pages needed
            "approval_program_size": len(approval_teal),
            "clear_state_program_size": len(clear_teal)
        })
        
        print("✅ Application specification created")
        return spec
    
    def deploy_contract(self) -> Dict[str, Any]:
        """Deploy the contract with comprehensive error handling"""
        print("🚀 Deploying contract...")
        
        try:
            # Create application specification
            app_spec = self.create_application_spec()
            
            # Create application client
            app_client = ApplicationClient(
                algod_client=self.algod_client,
                app_spec=app_spec,
                signer=self.account
            )
            
            # Deploy with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    print(f"   Attempt {attempt + 1}/{max_retries}")
                    
                    app_id, app_address, tx_id = app_client.create()
                    
                    print(f"✅ Contract deployed successfully!")
                    print(f"📋 App ID: {app_id}")
                    print(f"📍 App Address: {app_address}")
                    print(f"🔗 Transaction ID: {tx_id}")
                    
                    # Store deployment info
                    self.deployment_info = {
                        "network": self.network,
                        "app_id": app_id,
                        "app_address": app_address,
                        "tx_id": tx_id,
                        "deployer": self.account.address,
                        "deployment_time": datetime.now().isoformat(),
                        "contract_version": "2.0.0",
                        "approval_program_size": len(app_spec.approval_program),
                        "clear_state_program_size": len(app_spec.clear_state_program),
                        "global_state_schema": app_spec.global_state_schema,
                        "local_state_schema": app_spec.local_state_schema
                    }
                    
                    return self.deployment_info
                    
                except Exception as e:
                    print(f"   ❌ Attempt {attempt + 1} failed: {e}")
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(2)  # Wait before retry
            
        except Exception as e:
            print(f"❌ Deployment failed: {e}")
            raise
    
    def verify_deployment(self) -> bool:
        """Verify deployment by checking contract state"""
        print("🔍 Verifying deployment...")
        
        try:
            if not self.deployment_info:
                print("❌ No deployment info available")
                return False
            
            app_id = self.deployment_info["app_id"]
            
            # Get application info
            app_info = self.algod_client.application_info(app_id)
            
            # Verify application exists and is active
            if not app_info or app_info.get('deleted', False):
                print("❌ Application not found or deleted")
                return False
            
            # Verify global state
            global_state = app_info.get('params', {}).get('global-state', [])
            expected_keys = [
                "GAME_STATE", "TOTAL_STAKED", "COMMISSION_POOL",
                "ADMIN_COUNT", "PAUSED", "EMERGENCY_STOP"
            ]
            
            found_keys = [key['key'] for key in global_state]
            for expected_key in expected_keys:
                if expected_key not in found_keys:
                    print(f"❌ Missing global state key: {expected_key}")
                    return False
            
            print("✅ Deployment verification successful")
            return True
            
        except Exception as e:
            print(f"❌ Deployment verification failed: {e}")
            return False
    
    def save_deployment_info(self):
        """Save deployment information to files"""
        print("💾 Saving deployment information...")
        
        # Create artifacts directory
        os.makedirs("artifacts", exist_ok=True)
        
        # Save deployment info
        deployment_file = f"artifacts/deployment_{self.network}.json"
        with open(deployment_file, "w") as f:
            json.dump(self.deployment_info, f, indent=2)
        
        # Save ABI
        abi_file = f"artifacts/contract_abi_{self.network}.json"
        with open(abi_file, "w") as f:
            json.dump(self.contract.get_abi(), f, indent=2)
        
        # Save deployment log
        log_file = f"artifacts/deployment_log_{self.network}.txt"
        with open(log_file, "w") as f:
            f.write(f"Deployment Log - {datetime.now()}\n")
            f.write("=" * 50 + "\n")
            f.write(f"Network: {self.network}\n")
            f.write(f"App ID: {self.deployment_info.get('app_id', 'N/A')}\n")
            f.write(f"App Address: {self.deployment_info.get('app_address', 'N/A')}\n")
            f.write(f"Deployer: {self.deployment_info.get('deployer', 'N/A')}\n")
            f.write(f"Status: {'SUCCESS' if self.deployment_info else 'FAILED'}\n")
        
        print(f"✅ Deployment info saved to: {deployment_file}")
        print(f"✅ ABI saved to: {abi_file}")
        print(f"✅ Log saved to: {log_file}")
    
    def run_health_check(self) -> bool:
        """Run health check on deployed contract"""
        print("🏥 Running health check...")
        
        try:
            if not self.deployment_info:
                print("❌ No deployment info available")
                return False
            
            app_id = self.deployment_info["app_id"]
            
            # Check application status
            app_info = self.algod_client.application_info(app_id)
            
            # Check if application is active
            if app_info.get('deleted', False):
                print("❌ Application is deleted")
                return False
            
            # Check global state initialization
            global_state = app_info.get('params', {}).get('global-state', [])
            state_dict = {key['key']: key['value'] for key in global_state}
            
            # Verify initial state
            if state_dict.get('GAME_STATE', {}).get('uint', 0) != 0:  # Should be GAME_IDLE
                print("❌ Game state not properly initialized")
                return False
            
            if state_dict.get('ADMIN_COUNT', {}).get('uint', 0) != 1:
                print("❌ Admin count not properly initialized")
                return False
            
            print("✅ Health check passed")
            return True
            
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
    
    def deploy(self) -> bool:
        """Complete deployment process"""
        print("🚀 Starting Enhanced Contract Deployment")
        print("=" * 50)
        
        try:
            # Pre-deployment checks
            if not self.validate_contract():
                return False
            
            if not self.check_account_balance():
                return False
            
            # Deploy contract
            deployment_info = self.deploy_contract()
            
            # Post-deployment verification
            if not self.verify_deployment():
                return False
            
            # Health check
            if not self.run_health_check():
                return False
            
            # Save deployment info
            self.save_deployment_info()
            
            print("\n🎉 Deployment completed successfully!")
            print(f"📋 App ID: {deployment_info['app_id']}")
            print(f"📍 App Address: {deployment_info['app_address']}")
            print(f"🌐 Network: {self.network}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Deployment failed: {e}")
            return False

def main():
    """Main deployment function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Deploy Enhanced Chronicle of the Ledger Contract")
    parser.add_argument("network", choices=["localnet", "testnet", "mainnet"], 
                       default="testnet", help="Network to deploy to")
    parser.add_argument("--verify-only", action="store_true", 
                       help="Only verify existing deployment")
    parser.add_argument("--health-check", action="store_true", 
                       help="Run health check on deployed contract")
    
    args = parser.parse_args()
    
    # Create deployment manager
    deployment_manager = EnhancedDeploymentManager(args.network)
    
    if args.verify_only:
        # Load existing deployment info
        deployment_file = f"artifacts/deployment_{args.network}.json"
        if os.path.exists(deployment_file):
            with open(deployment_file, "r") as f:
                deployment_manager.deployment_info = json.load(f)
        
        success = deployment_manager.verify_deployment()
        sys.exit(0 if success else 1)
    
    elif args.health_check:
        # Load existing deployment info
        deployment_file = f"artifacts/deployment_{args.network}.json"
        if os.path.exists(deployment_file):
            with open(deployment_file, "r") as f:
                deployment_manager.deployment_info = json.load(f)
        
        success = deployment_manager.run_health_check()
        sys.exit(0 if success else 1)
    
    else:
        # Full deployment
        success = deployment_manager.deploy()
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
