#!/usr/bin/env python3
"""
Script to compile the Chronicle of the Ledger smart contract
"""

import os
import sys

# Add the contracts directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'contracts'))

try:
    from game_contract import approval_program, clear_state_program
    from pyteal import compileTeal, Mode
    
    print("🔨 Compiling Chronicle of the Ledger Smart Contract...")
    
    # Compile approval program
    approval_teal = compileTeal(approval_program(), mode=Mode.Application, version=8)
    
    # Compile clear state program
    clear_teal = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
    
    # Create contracts directory if it doesn't exist
    contracts_dir = os.path.join(os.path.dirname(__file__), '..', 'contracts')
    os.makedirs(contracts_dir, exist_ok=True)
    
    # Write approval program
    approval_path = os.path.join(contracts_dir, 'game_contract_approval.teal')
    with open(approval_path, 'w') as f:
        f.write(approval_teal)
    
    # Write clear state program
    clear_path = os.path.join(contracts_dir, 'game_contract_clear.teal')
    with open(clear_path, 'w') as f:
        f.write(clear_teal)
    
    print("✅ Smart contract compiled successfully!")
    print(f"📁 Approval program: {approval_path}")
    print(f"📁 Clear state program: {clear_path}")
    print("\n🎯 Contract Features:")
    print("   - Stake management (1 ALGO per game)")
    print("   - Automatic slashing (transaction fees + 5% commission)")
    print("   - Reward distribution (stake + 10% bonus)")
    print("   - Score tracking")
    print("   - Commission pool management")
    
except ImportError as e:
    print("❌ Error: Missing dependencies")
    print("Please install PyTeal:")
    print("   pip install pyteal")
    print(f"Import error: {e}")
except Exception as e:
    print(f"❌ Compilation error: {e}")
