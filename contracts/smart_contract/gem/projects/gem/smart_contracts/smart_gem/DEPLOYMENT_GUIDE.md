# 🚀 Smart Contract Deployment Guide

## 📋 Complete Step-by-Step Instructions

### **Step 1: Create Algorand Wallet**

1. **Go to MyAlgo Wallet:**
   - Visit: https://wallet.myalgo.com/
   - Click "Create New Wallet"

2. **Set up your wallet:**
   - Create a strong password
   - Write down your 25-word recovery phrase (KEEP THIS SECRET!)
   - Store it in a safe place

3. **Verify your wallet:**
   - Enter your recovery phrase to confirm
   - Your wallet is now created!

### **Step 2: Get Testnet ALGO (Free)**

1. **Copy your wallet address:**
   - In MyAlgo, click on your account
   - Copy the address (starts with letters/numbers)

2. **Get free testnet ALGO:**
   - Go to: https://testnet.algoexplorer.io/dispenser
   - Paste your wallet address
   - Click "Dispense"
   - You'll receive 10 ALGO for testing

### **Step 3: Get Your Private Key**

1. **In MyAlgo Wallet:**
   - Click on your account
   - Click "Export Account"
   - Enter your password
   - Copy the private key (long string of letters/numbers)

2. **Keep it secure:**
   - Never share your private key
   - Never commit it to code repositories
   - Store it safely

### **Step 4: Deploy Your Smart Contract**

1. **Edit the deployment script:**
   - Open `deploy_now.py`
   - Find the line: `private_key = "YOUR_PRIVATE_KEY_HERE"`
   - Replace `"YOUR_PRIVATE_KEY_HERE"` with your actual private key
   - Save the file

2. **Run the deployment:**
   ```bash
   python deploy_now.py
   ```

3. **Check the results:**
   - You'll get a transaction ID
   - Visit the Algorand Explorer link provided
   - Find your Application ID

### **Step 5: Test Your Contract**

1. **View your contract:**
   - Go to https://testnet.algoexplorer.io/
   - Search for your transaction ID
   - Find your Application ID

2. **Test functions:**
   - Opt-in to the contract
   - Stake ALGO
   - Test win/lose functions
   - Test admin functions

## 🔧 Available Contract Functions

### **Player Functions:**
- **`stake`** - Stake ALGO to participate in games
- **`win`** - Process player win (get stake + 10% bonus)
- **`lose`** - Process player loss (pay 5% commission)

### **Admin Functions:**
- **`toggle_pause`** - Pause/unpause contract
- **`withdraw_commission`** - Withdraw accumulated commission

## 📁 Files Created

- `deploy_now.py` - Main deployment script
- `deployment_config.json` - Contract configuration
- `artifacts/final_working_approval.teal` - Approval program
- `artifacts/final_working_clear.teal` - Clear program
- `deployment_info.json` - Deployment details (after deployment)

## ⚠️ Safety Reminders

- **NEVER** share your private key
- **NEVER** commit private keys to code repositories
- Use testnet for testing, mainnet for production
- Always test thoroughly before mainnet deployment

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Insufficient balance" error:**
   - Get more testnet ALGO from the dispenser
   - Make sure you have enough ALGO for transaction fees

2. **"Invalid private key" error:**
   - Check your private key is correct
   - Make sure there are no extra spaces or characters

3. **"Network error" error:**
   - Check your internet connection
   - Try again in a few minutes

4. **"TEAL files not found" error:**
   - Run `python final_working.py` first
   - Make sure you're in the correct directory

## 🎯 Next Steps After Deployment

1. **Test all functions:**
   - Stake ALGO
   - Test win/lose scenarios
   - Test admin functions

2. **Monitor your contract:**
   - Use Algorand Explorer
   - Check transaction logs
   - Monitor contract state

3. **Deploy to mainnet:**
   - When testing is complete
   - Use mainnet credentials
   - Deploy to production

## 📞 Support

If you need help:
1. Check the troubleshooting section above
2. Visit Algorand documentation: https://developer.algorand.org/
3. Join Algorand Discord community
4. Check Algorand Stack Overflow

---

**Good luck with your smart contract deployment! 🚀**
