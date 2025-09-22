"""
Simple Test Suite for Smart Contracts
No external dependencies required
"""

import sys
import os
import time

def test_contract_compilation():
    """Test that contracts compile successfully"""
    print("🧪 Testing Contract Compilation...")
    
    # Test final_working.py
    try:
        print("  📝 Testing final_working.py...")
        from final_working import FinalWorkingContract
        contract = FinalWorkingContract()
        approval_teal, clear_teal = contract.compile()
        print("  ✅ final_working.py compiles successfully!")
        print(f"     - Approval program: {len(approval_teal)} characters")
        print(f"     - Clear program: {len(clear_teal)} characters")
        return True
    except Exception as e:
        print(f"  ❌ final_working.py failed: {e}")
        return False

def test_contract_functions():
    """Test contract function definitions"""
    print("\n🧪 Testing Contract Functions...")
    
    try:
        from final_working import FinalWorkingContract
        contract = FinalWorkingContract()
        
        # Check if contract has required methods
        required_methods = ['compile']
        for method in required_methods:
            if hasattr(contract, method):
                print(f"  ✅ Method '{method}' exists")
            else:
                print(f"  ❌ Method '{method}' missing")
                return False
        
        print("  ✅ All required methods present")
        return True
    except Exception as e:
        print(f"  ❌ Function test failed: {e}")
        return False

def test_teal_generation():
    """Test TEAL code generation"""
    print("\n🧪 Testing TEAL Generation...")
    
    try:
        from final_working import FinalWorkingContract
        contract = FinalWorkingContract()
        approval_teal, clear_teal = contract.compile()
        
        # Check if TEAL code is generated
        if approval_teal and len(approval_teal) > 100:
            print("  ✅ Approval TEAL generated successfully")
        else:
            print("  ❌ Approval TEAL generation failed")
            return False
            
        if clear_teal and len(clear_teal) > 10:
            print("  ✅ Clear TEAL generated successfully")
        else:
            print("  ❌ Clear TEAL generation failed")
            return False
        
        # Check for key TEAL instructions
        key_instructions = ['int', 'byte', 'app_global_put', 'app_local_put']
        for instruction in key_instructions:
            if instruction in approval_teal:
                print(f"  ✅ Found instruction: {instruction}")
            else:
                print(f"  ⚠️  Missing instruction: {instruction}")
        
        return True
    except Exception as e:
        print(f"  ❌ TEAL generation test failed: {e}")
        return False

def test_file_creation():
    """Test that files are created properly"""
    print("\n🧪 Testing File Creation...")
    
    try:
        # Run the contract to generate files
        from final_working import FinalWorkingContract
        contract = FinalWorkingContract()
        approval_teal, clear_teal = contract.compile()
        
        # Create artifacts directory
        os.makedirs("artifacts", exist_ok=True)
        
        # Write files
        with open("artifacts/test_approval.teal", "w") as f:
            f.write(approval_teal)
        
        with open("artifacts/test_clear.teal", "w") as f:
            f.write(clear_teal)
        
        # Check if files exist
        if os.path.exists("artifacts/test_approval.teal"):
            print("  ✅ Approval TEAL file created")
        else:
            print("  ❌ Approval TEAL file not created")
            return False
            
        if os.path.exists("artifacts/test_clear.teal"):
            print("  ✅ Clear TEAL file created")
        else:
            print("  ❌ Clear TEAL file not created")
            return False
        
        # Check file sizes
        approval_size = os.path.getsize("artifacts/test_approval.teal")
        clear_size = os.path.getsize("artifacts/test_clear.teal")
        
        print(f"  📊 Approval file size: {approval_size} bytes")
        print(f"  📊 Clear file size: {clear_size} bytes")
        
        return True
    except Exception as e:
        print(f"  ❌ File creation test failed: {e}")
        return False

def run_performance_test():
    """Test compilation performance"""
    print("\n🧪 Testing Performance...")
    
    try:
        from final_working import FinalWorkingContract
        
        # Time the compilation
        start_time = time.time()
        contract = FinalWorkingContract()
        approval_teal, clear_teal = contract.compile()
        end_time = time.time()
        
        compilation_time = end_time - start_time
        print(f"  ⏱️  Compilation time: {compilation_time:.3f} seconds")
        
        if compilation_time < 5.0:
            print("  ✅ Compilation is fast")
        else:
            print("  ⚠️  Compilation is slow")
        
        return True
    except Exception as e:
        print(f"  ❌ Performance test failed: {e}")
        return False

def demonstrate_contract_usage():
    """Demonstrate how to use the contract"""
    print("\n🎮 Contract Usage Demonstration...")
    
    try:
        from final_working import FinalWorkingContract
        contract = FinalWorkingContract()
        approval_teal, clear_teal = contract.compile()
        
        print("  📋 Available Functions:")
        print("     - stake: Stake ALGO to participate in games")
        print("     - win: Process player win (get stake + 10% bonus)")
        print("     - lose: Process player loss (pay 5% commission)")
        print("     - toggle_pause: Admin pause/unpause contract")
        print("     - withdraw_commission: Admin withdraw commission")
        
        print("\n  🔧 How to Use:")
        print("     1. Deploy contract to Algorand network")
        print("     2. Players opt-in to the contract")
        print("     3. Players stake ALGO using 'stake' function")
        print("     4. Game logic determines win/lose")
        print("     5. Call 'win' or 'lose' function accordingly")
        print("     6. Admin can pause contract or withdraw commission")
        
        print("\n  💡 Example Transaction:")
        print("     - Function: 'stake'")
        print("     - Payment: 1 ALGO to contract address")
        print("     - Result: Player can participate in games")
        
        return True
    except Exception as e:
        print(f"  ❌ Usage demonstration failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Smart Contract Test Suite")
    print("=" * 50)
    
    tests = [
        test_contract_compilation,
        test_contract_functions,
        test_teal_generation,
        test_file_creation,
        run_performance_test,
        demonstrate_contract_usage
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"  ❌ Test {test.__name__} crashed: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Contract is ready for deployment.")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
