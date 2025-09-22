"""
Check Private Key Format
Helps verify your private key is in the correct format
"""

from algosdk import account, mnemonic
import base64

def check_private_key_format(private_key):
    """Check if private key is in correct format"""
    
    print("🔍 Checking Private Key Format")
    print("=" * 35)
    
    try:
        # Try to get address from private key
        address = account.address_from_private_key(private_key)
        print(f"✅ Private key is valid!")
        print(f"📱 Your address: {address}")
        return True, address
    except Exception as e:
        print(f"❌ Private key format error: {e}")
        return False, None

def suggest_fixes():
    """Suggest how to get correct private key format"""
    
    print("\n🔧 How to get correct private key from Lute:")
    print("=" * 50)
    
    print("\n1️⃣  Method 1 - Export as Base64:")
    print("   - In Lute, go to your account")
    print("   - Look for 'Export' or 'Show Private Key'")
    print("   - Make sure it's in Base64 format")
    print("   - Should be a long string of letters/numbers")
    
    print("\n2️⃣  Method 2 - Export as Mnemonic:")
    print("   - In Lute, look for 'Export Mnemonic' or 'Recovery Phrase'")
    print("   - Copy the 25-word phrase")
    print("   - We can convert it to private key")
    
    print("\n3️⃣  Method 3 - Check Lute Settings:")
    print("   - Go to Settings in Lute")
    print("   - Look for 'Advanced' or 'Developer' options")
    print("   - Try different export formats")
    
    print("\n💡 Common Private Key Formats:")
    print("   - Base64: Long string (like: AAAA...)")
    print("   - Hex: String with letters/numbers (like: 2HYM5FI67XY4WUW36UGG7WBILEUSTD257DJQCXEACNQNHDYOXZDXAMRQX4)")
    print("   - Mnemonic: 25 words separated by spaces")

def convert_mnemonic_to_private_key(mnemonic_phrase):
    """Convert mnemonic phrase to private key"""
    
    try:
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        address = account.address_from_private_key(private_key)
        print(f"✅ Mnemonic converted successfully!")
        print(f"📱 Your address: {address}")
        print(f"🔑 Private key: {private_key}")
        return private_key, address
    except Exception as e:
        print(f"❌ Mnemonic conversion failed: {e}")
        return None, None

def main():
    """Main function"""
    
    print("🔑 Private Key Format Checker")
    print("=" * 30)
    
    # Test the current private key
    current_key = "2HYM5FI67XY4WUW36UGG7WBILEUSTD257DJQCXEACNQNHDYOXZDXAMRQX4"
    
    print(f"Testing current private key: {current_key}")
    is_valid, address = check_private_key_format(current_key)
    
    if not is_valid:
        suggest_fixes()
        
        print("\n🤔 Do you have your mnemonic phrase (25 words)?")
        print("If yes, we can convert it to the correct private key format.")
        print("Enter your mnemonic phrase below (or press Enter to skip):")
        
        # Uncomment the following lines if you want to input mnemonic
        """
        mnemonic_input = input("Mnemonic phrase: ").strip()
        if mnemonic_input:
            private_key, address = convert_mnemonic_to_private_key(mnemonic_input)
            if private_key:
                print(f"\n✅ Use this private key in your deployment script:")
                print(f'private_key = "{private_key}"')
        """

if __name__ == "__main__":
    main()
