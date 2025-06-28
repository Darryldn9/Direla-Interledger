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

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Payment Protocol**: Open Payments SDK (@interledger/open-payments)
- **QR Codes**: react-native-qrcode-svg + expo-camera
- **Navigation**: Expo Router
- **Language**: TypeScript
- **Database**: Supabase

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ 
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Mobile Device** or iOS Simulator/Android Emulator

### Step 1: Clone & Install

```bash
git clone <repository-url>
cd Dinela
npm install
```

### Step 2: Configure Network IP (IMPORTANT!)

**⚠️ This is the most common setup issue!**

The app currently uses hardcoded IP `192.168.10.56:3001`. You MUST update this to your machine's IP address.

#### Option A: Automated Setup (Recommended)

```bash
# Run the setup helper script (macOS/Linux)
./scripts/setup-network.sh
```

This script will:
- ✅ Auto-detect your IP address
- ✅ Update all necessary files
- ✅ Create backups
- ✅ Verify the changes

**Note**: Windows users should use Option B (manual setup)

#### Option B: Manual Setup

1. **Find your IP address:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig | findstr "IPv4"
   ```

2. **Update frontend API calls** (replace `192.168.10.56` with YOUR IP):
   ```bash
   # Search and replace in all files
   grep -r "192.168.10.56" app/ components/
   ```
   
   Update these files:
   - `app/(tabs)/pay.tsx` (multiple fetch calls)
   - `components/QRCodeGenerator.tsx` (1 fetch call)

3. **Alternative: Use localhost** (if testing on same machine):
   - Replace `http://192.168.10.56:3001` with `http://localhost:3001`
   - This only works for web version, not mobile device

### Step 3: Start Backend Server

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Dinela Backend ready:
   Wallet: https://ilp.interledger-test.dev/daddyd
   Key ID: 2498c668-28a2-44e4-8d89-4cd29e886901
   Port: 3001
🚀 Dinela Backend running on:
   Local: http://localhost:3001
   Network: http://YOUR_IP:3001
```

### Step 4: Start Frontend

```bash
# In the main directory (not backend/)
npx expo start --clear
```

### Step 5: Test the App

1. **Open the app** on your device/simulator
2. **Generate QR Code**: Go to Merchant tab → "Generate QR"
3. **Scan QR Code**: Go to Pay tab → "QR Code" → Scan the generated code
4. **Authorize Payment**: Browser will open for authorization
5. **Complete Payment**: Return to app to see success message

## 📱 App Structure

```
Dinela/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx      # Wallet Dashboard
│   │   ├── pay.tsx        # Payment Methods & QR Scanner
│   │   ├── merchant.tsx   # QR Generation & Business Tools
│   │   ├── lending.tsx    # Lending Features
│   │   └── settings.tsx   # App Settings
│   └── _layout.tsx        # Root Layout
├── backend/
│   ├── server.js          # Express API with Open Payments
│   └── package.json       # Backend dependencies
├── components/
│   ├── QRCodeGenerator.tsx  # QR code creation
│   └── QRCodeScanner.tsx    # QR code scanning
└── config/
    └── api.config.js      # API configuration
```

## 🔧 Configuration

### Open Payments Credentials

The app uses **real Open Payments test credentials**:

- **Wallet**: `https://ilp.interledger-test.dev/daddyd`
- **Key ID**: `2498c668-28a2-44e4-8d89-4cd29e886901`
- **Environment**: Interledger testnet

These are already configured in `backend/server.js`. For production, you'd replace with your own wallet credentials.

### Network Configuration

**For Mobile Device Testing:**
1. Ensure your computer and phone are on the same WiFi network
2. Update IP addresses as described in Step 2 above
3. Your phone can then connect to your computer's backend

**For Web Testing:**
- Use `http://localhost:3001` in the frontend code
- Only works when testing in browser

## 🐛 Troubleshooting

### Common Issues

**1. "Network request failed" when scanning QR**
- ✅ **Solution**: Update IP addresses in frontend code
- ✅ **Check**: Backend is running on correct port (3001)
- ✅ **Verify**: Phone and computer on same WiFi

**2. "Route merchant.tsx missing required default export"**
- ✅ **Solution**: Run `npx expo start --clear` to clear Metro cache
- ✅ **Check**: No import errors in merchant.tsx

**3. QR Scanner fires multiple times**
- ✅ **Fixed**: Latest code includes debouncing protection
- ✅ **Update**: Pull latest changes if still occurring

**4. Camera permission denied**
- ✅ **iOS**: Allow camera access in Settings → Expo Go
- ✅ **Android**: Grant camera permission when prompted

**5. Backend won't start**
- ✅ **Check**: Node.js v16+ installed
- ✅ **Install**: Run `npm install` in backend directory
- ✅ **Port**: Ensure port 3001 is available

### Testing Checklist

Before reporting issues, verify:

- [ ] Backend server is running (`npm start` in backend/)
- [ ] Frontend IP addresses match your machine's IP
- [ ] Both devices on same WiFi network
- [ ] Camera permissions granted
- [ ] Port 3001 is not blocked by firewall

## 🔒 Security & Payments

### Real Money Warning

⚠️ **This app processes REAL payments** on Interledger testnet. While amounts are small, the transactions are actual value transfers.

### Open Payments Flow

1. **QR Generation**: Creates real incoming payment request
2. **QR Scanning**: Parses payment details from QR code
3. **Quote Creation**: Gets real exchange rates and fees
4. **Authorization**: Browser-based interactive consent
5. **Payment Execution**: Actual money transfer via Interledger

### Test Safely

- Use small amounts (under $1 USD equivalent)
- Test on Interledger testnet only
- Don't use production credentials

## 🚀 Deployment

### For Production

1. **Get Production Credentials**:
   - Register for Open Payments provider
   - Generate production wallet and keys
   - Update `backend/server.js` credentials

2. **Security Hardening**:
   - Use environment variables for secrets
   - Enable HTTPS/TLS
   - Add rate limiting
   - Implement proper error handling

3. **Mobile App Build**:
   ```bash
   npx expo build:ios
   npx expo build:android
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

---

**⚡ Quick Debug Commands:**

```bash
# Auto-configure network (macOS/Linux)
./scripts/setup-network.sh

# Check your IP
ifconfig | grep inet

# Restart backend
cd backend && npm start

# Clear Metro cache
npx expo start --clear

# Check backend health
curl http://YOUR_IP:3001/health
```

**Need Help?** Create an issue with:
- Your operating system
- Error messages (full text)
- Steps you tried
- Network configuration details 