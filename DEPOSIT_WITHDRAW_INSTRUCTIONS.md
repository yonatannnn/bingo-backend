# Deposit, Withdrawal, and Transfer Instructions

## 📥 How to Make a Deposit

### Step 1: Start the Deposit Process
1. Open the bot and type `/deposit` or click the "💰 Deposit" button
2. Make sure you are registered (if not, use `/register` first)

### Step 2: Choose Payment Method
You will see two payment options:
- **📱 Telebirr** - For Telebirr mobile money transfers
- **🏦 CBE** - For Commercial Bank of Ethiopia transfers

Click on your preferred payment method.

### Step 3: Enter Deposit Amount
1. The bot will ask you to enter the amount you want to deposit
2. **Minimum deposit:** 50 Birr
3. **Maximum deposit:** 1,000 Birr
4. Type the amount (numbers only, e.g., `100` for 100 Birr)
5. Press Enter or send the message

### Step 4: Make the Payment

#### If you chose **Telebirr**:
1. You will receive the Telebirr account number: **77280042**
2. Open your Telebirr app
3. Transfer the exact amount you specified to account number **77280042**
4. Copy the **Transaction ID** from your Telebirr app
   - Example format: `CDF8QQMTVE`
   - Transaction IDs are usually 6-20 characters (letters and numbers)

#### If you chose **CBE (Commercial Bank of Ethiopia)**:
1. You will receive the CBE account number: **100000000000**
2. Go to your bank or use CBE mobile banking
3. Transfer the exact amount you specified to account number **100000000000**
4. Copy the **Transaction ID** from your bank receipt or app
   - Example format: `FT25106S48WP`
   - Transaction IDs are usually 6-20 characters (letters and numbers)

### Step 5: Submit Transaction ID
1. The bot will ask you to enter your Transaction ID
2. Paste or type the Transaction ID exactly as it appears
3. Press Enter or send the message

### Step 6: Wait for Approval
1. You will receive a confirmation message: "✅ Transaction ID received!"
2. Your deposit request is now **pending** and waiting for admin approval
3. **Important:** Your balance will NOT be updated immediately
4. Wait for admin approval (this may take some time)
5. Once approved, the amount will be added to your balance
6. You can check your balance anytime using `/checkbalance`

### Important Notes:
- ⚠️ **Do not send money before completing all steps in the bot**
- ⚠️ **Make sure the amount matches exactly** what you entered in the bot
- ⚠️ **Copy the Transaction ID carefully** - it must be exact
- ⚠️ **Transaction IDs are case-sensitive** - enter them exactly as shown
- ⚠️ If your session expires, you'll need to start over with `/deposit`
- ✅ You can cancel the process anytime using `/cancel`

---

## 📤 How to Make a Withdrawal

### Step 1: Start the Withdrawal Process
1. Open the bot and type `/withdraw` or click the "💸 Withdraw" button
2. Make sure you are registered (if not, use `/register` first)

### Step 2: Check Your Balance
1. The bot will show your current balance
2. Make sure you have enough balance to withdraw
3. You can only withdraw up to your available balance

### Step 3: Enter Withdrawal Amount
1. The bot will ask: "ምን ያህል ማውጣት ይፈልጋሉ?" (How much do you want to withdraw?)
2. Type the amount you want to withdraw (numbers only, e.g., `50` for 50 Birr)
3. **Important:** The amount must be:
   - Greater than 0
   - Less than or equal to your current balance
4. Press Enter or send the message

### Step 4: Confirmation
1. The bot will immediately process your withdrawal request
2. **Important:** Your balance is **immediately deducted** when you submit the withdrawal
3. You will receive a confirmation message showing:
   - Amount withdrawn
   - Your new balance
   - Status: "የመውጫ ክፍያዎ እየተፀደቀ ነው፤ እባክዎ ይጠብቁ።" (Your withdrawal is being processed, please wait)

### Step 5: Wait for Admin Approval
1. Your withdrawal request is now **pending** and waiting for admin approval
2. **Important:** Your balance has already been deducted
3. If admin **approves**: The withdrawal is completed (money will be sent to you)
4. If admin **rejects**: Your balance will be **refunded** back to your account
5. You can check your balance anytime using `/checkbalance`

### Important Notes:
- ⚠️ **Balance is deducted immediately** when you submit a withdrawal
- ⚠️ **You cannot withdraw more than your available balance**
- ⚠️ **Withdrawals require admin approval** - this may take time
- ⚠️ If your withdrawal is rejected, your balance will be refunded
- ✅ You can check your withdrawal history using `/withdrawal_history`
- ✅ You can cancel the process before submitting using `/cancel`

---

## 💸 How to Transfer Money to a Friend

### Step 1: Start the Transfer Process
1. Open the bot and type `/transfer` or click the "🔄 Transfer" button
2. Make sure you are registered (if not, use `/register` first)

### Step 2: Check Your Balance
1. The bot will show your current balance
2. Make sure you have enough balance to transfer
3. You can only transfer up to your available balance

### Step 3: Enter Receiver's Referral Code
1. The bot will ask: "እባክዎ ለማስተላለፍ የሚፈልጉትን የተጠቃሚ Referral Code ያስገቡ" (Please enter the Referral Code of the user you want to transfer to)
2. **Important:** You need the receiver's referral code
   - Ask your friend to share their referral code (they can get it using `/referal_code`)
   - Referral codes are usually 8 characters (letters and numbers)
   - Example format: `813d03b6`
3. Type or paste the referral code
4. Press Enter or send the message

### Step 4: Verify Receiver Information
1. The bot will search for the user with that referral code
2. If found, you will see:
   - ✅ "User found!"
   - Receiver's name
   - Receiver's phone number
   - Your current balance
3. **Important:** Verify this is the correct person before proceeding
4. If the referral code is not found, you'll get an error and need to try again

### Step 5: Enter Transfer Amount
1. The bot will ask: "እባክዎ ምን ያህል መላል ይፈልጋሉ?" (How much do you want to transfer?)
2. Type the amount you want to transfer (numbers only, e.g., `25` for 25 Birr)
3. **Important:** The amount must be:
   - Greater than 0
   - Less than or equal to your current balance
   - You cannot transfer to yourself
4. Press Enter or send the message

### Step 6: Transfer Confirmation
1. The transfer is **executed immediately** (atomic operation)
2. You will receive a success message showing:
   - ✅ "Transfer successful!"
   - Amount transferred
   - Receiver's name
   - Your new balance
3. **The receiver will also receive a notification** showing:
   - 💰 "You received a transfer!"
   - Amount received
   - Sender's name
   - Their new balance

### Important Notes:
- ⚠️ **Transfers are instant and cannot be reversed** - double-check before confirming
- ⚠️ **You cannot transfer to yourself** - the system will prevent this
- ⚠️ **You need the receiver's referral code** - ask them to share it with you
- ⚠️ **Make sure the referral code is correct** - wrong codes will result in "User not found"
- ⚠️ **Balance is deducted immediately** when transfer is completed
- ✅ **Both sender and receiver get notified** automatically
- ✅ **Transfers are completed instantly** - no admin approval needed
- ✅ You can check your transfer history using `/transfer_history`
- ✅ You can cancel the process before entering the amount using `/cancel`

### How to Get Your Referral Code:
- Use the command `/referal_code` to see your own referral code
- Share this code with friends who want to send you money

---

## 🔄 Transaction Status

### Deposit Status:
- **Pending** ⏳ - Waiting for admin approval, balance not updated yet
- **Completed** ✅ - Approved and added to your balance
- **Failed** ❌ - Rejected, no balance change

### Withdrawal Status:
- **Pending** ⏳ - Waiting for admin approval, balance already deducted
- **Completed** ✅ - Approved, money sent to you
- **Failed** ❌ - Rejected, balance refunded

### Transfer Status:
- **Completed** ✅ - Transfer executed successfully (instant, no approval needed)
- **Failed** ❌ - Transfer failed (e.g., insufficient balance, invalid referral code, self-transfer)

---

## 📋 View Transaction History

You can view your transaction history using these commands:
- `/deposit_history` - View all your deposits
- `/withdrawal_history` - View all your withdrawals
- `/transfer_history` - View all your transfers

---

## ❓ Troubleshooting

### Deposit Issues:
- **"Session expired"** - Start over with `/deposit`
- **"Invalid Transaction ID"** - Make sure you copied it exactly (case-sensitive)
- **"Invalid amount"** - Amount must be between 50 and 1,000 Birr
- **Deposit not showing in balance** - It's still pending approval, wait for admin

### Withdrawal Issues:
- **"Insufficient balance"** - You don't have enough balance to withdraw
- **"Invalid amount"** - Amount must be greater than 0
- **Balance deducted but withdrawal pending** - This is normal, wait for admin approval
- **Withdrawal rejected** - Your balance will be automatically refunded

### Transfer Issues:
- **"User not found"** - The referral code is incorrect, ask the receiver to share their code again
- **"Insufficient balance"** - You don't have enough balance to transfer
- **"Invalid amount"** - Amount must be greater than 0
- **"Cannot transfer to yourself"** - You cannot send money to your own account
- **"Session expired"** - Start over with `/transfer`
- **Transfer not received by friend** - Ask them to check their balance and notifications

### Need Help?
- Use `/support` to contact support channels
- Use `/cancel` to cancel any ongoing operation

---

## ⚠️ Important Reminders

1. **Always double-check amounts** before submitting
2. **Copy Transaction IDs exactly** - they are case-sensitive
3. **Deposits require admin approval** - balance updates after approval
4. **Withdrawals deduct balance immediately** - refunded if rejected
5. **Transfers are instant and irreversible** - verify receiver's referral code carefully
6. **Use `/cancel`** if you make a mistake during the process
7. **Check your balance** regularly using `/checkbalance`
8. **View transaction history** to track all your deposits, withdrawals, and transfers
9. **Get your referral code** using `/referal_code` to receive transfers from friends

