# Direla - QR Code Payment Solution with Open Payments

A React Native/Expo mobile payment app featuring QR code generation and scanning with real Open Payments integration via Interledger Protocol. Perfect for merchants and customers to exchange payments seamlessly.

## 🌟 Features

### 💰 Digital Wallet Dashboard
- **Balance Overview**: View digital wallet balance and transaction history
- **Real-time Updates**: Live transaction tracking
- **Payment History**: Comprehensive transaction logs

### 🏪 Merchant Tools
- **QR Code Generation**: Create instant payment QR codes with real Open Payments IDs
- **Business Analytics**: Revenue tracking and sales overview
- **Payment Status**: Toggle payment acceptance on/off
- **Transaction Management**: Monitor incoming payments

### 📱 Customer Payment
- **QR Code Scanning**: Scan merchant QR codes to pay instantly
- **Payment Confirmation**: Secure authorization flow via browser
- **Multiple Payment Methods**: QR, WhatsApp, NFC, and Contacts
- **Nearby Merchants**: Discover local businesses

### 🌐 Open Payments Integration
- **Real Money Transfers**: Actual Interledger Protocol transactions
- **Interactive Authorization**: Secure browser-based payment approval
- **Cross-Network Support**: Connect to multiple payment providers
- **Real Wallet Integration**: Uses live Open Payments test wallet

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo (TypeScript)
- **Backend**: Node.js with Express (JavaScript)
- **Payment Protocol**: Open Payments SDK (@interledger/open-payments)
- **QR Codes**: react-native-qrcode-svg + expo-camera
- **Navigation**: Expo Router
- **UI Components**: Lucide React icons
- **SMS/Communications**: Twilio
- **Languages**: TypeScript (frontend), JavaScript (backend)
- **Environment**: dotenv for secure configuration
- **Authentication**: Open Payments key-based authentication
- **Network**: Auto IP detection utilities
- **Development**: Metro bundler, Expo CLI

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Mobile Device or iOS Simulator/Android Emulator
- Two Interledger test wallets (customer and merchant)

### Step 1: Clone & Install
```bash
git clone <repository-url>
cd Direla
npm install
```

### Step 2: Backend Configuration

#### Create Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your Open Payments credentials:
```env
# Direla Backend Configuration
PORT=3001
NODE_ENV=development

# Customer/Sender Wallet (for outgoing payments)
OPEN_PAYMENTS_CLIENT_ADDRESS="https://ilp.interledger-test.dev/your-customer-wallet"
OPEN_PAYMENTS_SECRET_KEY_PATH="private.key"
OPEN_PAYMENTS_KEY_ID="your-key-id"

# Merchant/Receiver Wallet (for incoming payments)
MERCHANT_WALLET_ADDRESS="https://ilp.interledger-test.dev/your-merchant-wallet"

# Network Configuration (auto-detected if not specified)
# BACKEND_HOST=192.168.x.x
```

#### Install Backend Dependencies
```bash
cd backend
npm install dotenv
```

### Step 3: Configure Frontend Network

**Option A: Auto-Detection (Recommended)**
- Backend auto-detects your IP address
- No manual configuration needed

**Option B: Manual Configuration**
If auto-detection doesn't work, update `config/api.config.js`:
```javascript
// Find your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1  // macOS/Linux
ipconfig | findstr "IPv4"                    // Windows

// Update api.config.js
return 'http://YOUR_IP_ADDRESS:3001';
```

### Step 4: Start Backend Server
```bash
cd backend
npm start
```

**Expected output:**
```
✅ Direla Backend ready:
   Customer Wallet (sends): https://ilp.interledger-test.dev/your-customer-wallet
   Merchant Wallet (receives): https://ilp.interledger-test.dev/your-merchant-wallet
   Key ID: your-key-id
🚀 Direla Backend running on:
   Local: http://localhost:3001
   Network: http://192.168.x.x:3001
```

### Step 5: Start Frontend
```bash
# In the main directory (not backend/)
npx expo start --clear
```

### Step 6: Test the Complete Payment Flow

1. **Generate QR Code**: Merchant tab → "Generate QR" → Enter amount (e.g., 100 ZAR) → Generate
2. **Scan QR Code**: Pay tab → "QR Code" → Scan the generated code
3. **Authorize Payment**: Browser opens automatically → Approve payment
4. **Complete Payment**: Return to app → See success message
5. **Verify Transfer**: Real money moves from customer wallet → merchant wallet

## 📱 App Structure

```
Direla/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Wallet Dashboard (demo balance + real transactions)
│   │   ├── pay.tsx        # Payment Methods & QR Scanner
│   │   ├── merchant.tsx   # QR Generation & Business Tools  
│   │   ├── lending.tsx    # Lending Features
│   │   └── settings.tsx   # App Settings
│   └── _layout.tsx        # Root Layout
├── backend/
│   ├── server.js          # Express API with Open Payments
│   ├── .env              # Environment variables (create from .env.example)
│   ├── .env.example      # Environment template
│   └── package.json      # Backend dependencies
├── components/
│   ├── QRCodeGenerator.tsx  # QR code creation
│   └── QRCodeScanner.tsx    # QR code scanning
├── config/
│   └── api.config.js      # API configuration
└── private.key           # Your Open Payments private key
```

## 🔧 Configuration Details

### Two-Wallet Architecture

**Customer Wallet (Sender):**
- Configured in `OPEN_PAYMENTS_CLIENT_ADDRESS`
- Used for sending payments (when scanning QR codes)
- Requires private key and key ID for authentication

**Merchant Wallet (Receiver):**
- Configured in `MERCHANT_WALLET_ADDRESS`  
- Used for receiving payments (when generating QR codes)
- Creates incoming payment requests

### Open Payments Credentials

The app uses real Open Payments credentials configured in environment variables:

- **Wallet Address**: Your Interledger test wallet URL
- **Key ID**: Your Open Payments authentication key ID
- **Private Key**: Your Open Payments private key file

**For production**, replace with your own wallet credentials from an Open Payments provider.

### Network Configuration

- **Auto-Detection**: Backend automatically finds your IP address
- **Manual Override**: Set `BACKEND_HOST` in `.env` if needed
- **Mobile Connectivity**: Ensure phone and computer on same WiFi network

## 🐛 Troubleshooting

### Common Issues

#### 1. "ERR_CONNECTION_REFUSED" when generating QR
**✅ Solutions:**
- Ensure backend is running (`npm start` in backend directory)
- Check IP address in `config/api.config.js` matches backend output
- Verify both devices on same WiFi network
- Test backend health: `curl http://YOUR_IP:3001/health`

#### 2. "Missing required environment variables"
**✅ Solutions:**
- Create `.env` file in backend directory
- Copy from `.env.example` and fill in your credentials
- Restart backend after creating `.env`

#### 3. "Failed to create quote: invalid amount"
**✅ Solutions:**
- This was fixed with receiveAmount approach
- Ensure you're using the latest server.js code
- Check both wallet currencies are compatible

#### 4. "Private key file not found"
**✅ Solutions:**
- Ensure `private.key` file exists in correct location
- Check `OPEN_PAYMENTS_SECRET_KEY_PATH` in `.env`
- Verify file permissions allow reading

#### 5. Backend won't start
**✅ Solutions:**
- Install dependencies: `npm install` in backend directory
- Check Node.js version: `node --version` (requires v16+)
- Verify port 3001 is available: `lsof -i :3001`

### Testing Checklist

Before reporting issues, verify:
- [ ] Backend server running (shows startup messages)
- [ ] Frontend IP addresses match backend IP  
- [ ] Both devices on same WiFi network
- [ ] Environment variables properly configured
- [ ] Private key file exists and is readable
- [ ] Port 3001 not blocked by firewall

### Debug Commands

```bash
# Check backend health
curl http://YOUR_IP:3001/health

# Test customer wallet connection  
curl "http://YOUR_IP:3001/api/wallet/CUSTOMER_WALLET_ENCODED"

# Test merchant wallet connection
curl "http://YOUR_IP:3001/api/wallet/MERCHANT_WALLET_ENCODED"

# Test QR generation
curl -X POST http://YOUR_IP:3001/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"amount": 5, "currency": "ZAR", "description": "Test"}'

# Check configuration
curl http://YOUR_IP:3001/api/debug/config
```

## 🔒 Security & Payments

### Real Money Warning
⚠️ **This app processes REAL payments on Interledger testnet.** While amounts are small, the transactions are actual value transfers between wallets.

### Open Payments Flow
1. **QR Generation**: Creates real incoming payment request on merchant wallet
2. **QR Scanning**: Parses payment details and creates quote using receiveAmount
3. **Quote Creation**: Gets real exchange rates and fees from Open Payments
4. **Authorization**: Browser-based interactive consent for the payment
5. **Payment Execution**: Actual money transfer via Interledger Protocol

### Test Safely
- Use small amounts (under $5 USD equivalent)
- Test on Interledger testnet only
- Don't use production credentials in development
- Verify transactions in your wallet provider's interface

## 🚀 Deployment

### For Production

**Get Production Credentials:**
1. Register with Open Payments provider
2. Generate production wallet and keys
3. Update environment variables with production values

**Security Hardening:**
- Use environment variables for all secrets
- Enable HTTPS/TLS in production
- Add rate limiting and input validation
- Implement proper error handling
- Use secure storage for private keys

**Mobile App Build:**
```bash
npx expo build:ios
npx expo build:android
```

## 💰 Balance System

### Demo Balance Approach
- **Starting Balance**: R 2,847.50 (simulated bank deposit)
- **Real Transactions**: Tracked via Open Payments API
- **Balance Updates**: Demo balance ± real Open Payments transactions
- **Future Enhancement**: Integrate with wallet provider balance APIs

### Balance Formula
```
Current Balance = Bank Deposit + (Received via OP) - (Sent via OP)
Example: R 2,847.50 + R 0 - R 50 = R 2,797.50
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Interledger Foundation** for Open Payments protocol
- **Expo** for React Native framework
- **Lucide** for beautiful icons
- **Test wallet providers** for development credentials

## ⚡ Quick Debug Commands

```bash
# Auto-configure network (if available)
./scripts/setup-network.sh

# Check your IP
ifconfig | grep inet

# Restart backend with logs
cd backend && npm start

# Clear Metro cache
npx expo start --clear

# Test complete flow
curl -X POST http://YOUR_IP:3001/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "ZAR", "description": "End-to-end test"}'
```

## 🆘 Need Help?

Create an issue with:
- Your operating system
- Error messages (full text)
- Steps you tried
- Network configuration details
- Backend console output

**Key Features Working:**
- ✅ Two-wallet architecture (customer ↔ merchant)
- ✅ Real Open Payments integration
- ✅ Currency-agnostic payments (ZAR, USD, etc.)
- ✅ QR code generation with receiveAmount logic
- ✅ Interactive payment authorization
- ✅ Environment variable configuration
- ✅ Auto-IP detection
- ✅ Real money transfers via Interledger
