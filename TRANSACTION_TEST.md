# 🧪 Testing CryptoBot Donations

## Before Testing

1. **Verify Environment Variables**
   - Check `.env.local` has all values
   - Restart dev server after adding variables

2. **Fund Your Wallet**
   - Connect your Sui wallet
   - Get testnet SUI from faucet

3. **Fund CryptoBot**
   - Get testnet SUI for CryptoBot's address
   - This ensures the address is active on-chain

## Test Donation Flow

### Step 1: Small Donation (0.001 SUI)
```
1. Go to Home page or Donate page
2. Connect your wallet
3. Enter amount: 0.001
4. Click "Send"
5. Approve in wallet popup
6. Wait for success message
```

### Step 2: Verify in Supabase
```
1. Open Supabase dashboard
2. Go to Table Editor → ledger_table
3. Look for new row with your transaction
4. Check: sender_id, reciever_id, type, sending, date
```

### Step 3: Check Activity Page
```
1. Navigate to Activity tab
2. Click "Refresh" button
3. Your transaction should appear in the table
4. Verify: Time, Sender ID, Receiver ID, Type, Direction
```

### Step 4: Test Various Amounts
Try these amounts:
- ✅ 0.000001 (minimum)
- ✅ 0.001
- ✅ 0.5
- ✅ 1.234567
- ✅ 10

## Common Issues

### "Supabase not configured"
- Check `.env.local` exists in `robotdapp/` folder
- Verify SUPABASE_URL and SUPABASE_API are set
- Restart dev server

### "CryptoBot wallet not configured"
- Run: `node scripts/generateRobotWallet.js`
- Add NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS to `.env.local`
- Add CRYPTOBOT_PRIVATE_KEY to `.env.local`
- Restart dev server

### Transaction not showing in ledger
- Check browser console for errors
- Verify Supabase table schema matches:
  - transaction_id (NUMERIC)
  - sender_id (NUMERIC)
  - reciever_id (NUMERIC)
  - type (TEXT)
  - sending (BOOLEAN)
  - date (TIMESTAMP)
- Check Supabase dashboard for the transaction

### Wallet won't connect
- Install Sui Wallet extension
- Switch to testnet in wallet settings
- Refresh page and try again

## Success Checklist
- [ ] Wallet connects successfully
- [ ] Can enter decimal amounts (0.001, 0.5, etc)
- [ ] Transaction executes and shows success message
- [ ] Transaction appears in Supabase ledger_table
- [ ] Transaction shows in Activity page
- [ ] Refresh button updates the list
- [ ] CryptoBot balance updates in Robot Dashboard

## Next: Autonomous Transactions
Once donations work, test CryptoBot sending transactions:
```bash
curl -X POST http://localhost:3000/api/robot/execute \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send",
    "recipient": "YOUR_WALLET_ADDRESS",
    "amount": "0.001"
  }'
```

