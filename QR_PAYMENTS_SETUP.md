# 🚀 Direla QR Payments & Open Payments Setup

## 📱 What's Been Implemented

### ✅ QR Code Payments System
- **Merchant Side**: Generate QR codes for payment requests via `merchant.tsx`
- **Customer Side**: Scan QR codes to make payments via `pay.tsx`
- **Real Open Payments Integration**: Uses Interledger Protocol for actual money transfers

### ✅ Open Payments Backend
- **Express.js API** with real Open Payments SDK integration
- **Working Credentials**: Using live test wallet from Interledger network
- **Full Payment Flow**: Quote creation → Payment execution → Settlement

### ✅ Mobile & Web Support
- **Expo Compatible**: Works on iOS, Android, and Web
- **Dynamic IP Detection**: Automatically finds backend server on local network
- **Cross-Platform QR**: Native camera integration with fallbacks

## 🏃‍♂️ Quick Start

### 1. Start the Backend Server
```bash
# Option 1: Use the convenience script
./scripts/start-backend.sh

# Option 2: Manual start
cd backend
npm install
npm start
```

The backend will start on `http://localhost:3001` and show:
```
🚀 Direla Backend running on:
   Local: http://localhost:3001
   Network: http://[your-ip]:3001
   Health: http://localhost:3001/health
```

### 2. Start the Mobile App
```bash
# In a new terminal, from the root directory
npm run dev
```

### 3. Test the System

#### As a Merchant (Generate QR Codes):
1. Open the app and go to the **Merchant** tab
2. Tap **"Generate QR"** in Quick Actions
3. Enter amount (e.g., 50) and description
4. Tap **"Generate QR Code"**
5. A QR code will be created with real Open Payments integration

#### As a Customer (Scan & Pay):
1. Go to the **Pay** tab
2. Select **"QR Code"** payment method
3. Tap **"Scan QR Code to Pay"**
4. Scan the merchant's QR code
5. Confirm payment details
6. Payment will be processed via Open Payments network

## 🔧 Technical Architecture

```
Mobile App (React Native/Expo)
        ↓ HTTP/API calls
Backend Server (Node.js/Express)
        ↓ Open Payments SDK
Interledger Network (Real payments)
```

### Components Created:
- `components/QRCodeGenerator.tsx` - Merchant QR generation
- `components/QRCodeScanner.tsx` - Customer QR scanning
- `config/api.config.js` - API configuration with dynamic IP
- `backend/server.js` - Express server with Open Payments

### API Endpoints:
- `GET /health` - Backend health check
- `POST /api/qr/generate` - Generate QR code with payment
- `POST /api/payment/quote` - Create payment quote
- `POST /api/payment/send` - Execute payment
- `GET /api/wallet/:address` - Test wallet connection

## 💰 Open Payments Integration

### Real Credentials (Working):
- **Wallet**: `https://ilp.interledger-test.dev/daddyd`
- **Key ID**: `2498c668-28a2-44e4-8d89-4cd29e886901`
- **Private Key**: Loaded from `private.key` file

### Payment Flow:
1. **Merchant** creates incoming payment request
2. **QR Code** contains payment metadata (amount, wallet, ID)
3. **Customer** scans QR and creates quote
4. **Payment** executed via Interledger Protocol
5. **Settlement** happens instantly on test network

### Currency Support:
- Primary: **ZAR** (South African Rand)
- Also supports: USD, EUR, etc. (via Interledger conversion)

## 🌐 Network Setup

### Development:
- Backend auto-detects local IP for Expo compatibility
- Works with Expo Go, development builds, and web

### Production Deployment:
```bash
# Deploy backend to any Node.js hosting
# Update API_CONFIG.BASE_URL in config/api.config.js
# Build mobile app: npx expo build
```

## 🔍 Testing Checklist

### ✅ Backend Health:
```bash
curl http://localhost:3001/health
# Should return: {"status":"healthy","service":"Direla Backend"...}
```

### ✅ QR Generation:
```bash
curl -X POST http://localhost:3001/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{"amount":50,"currency":"ZAR","description":"Test payment"}'
```

### ✅ Mobile Flow:
1. Merchant tab → Generate QR → Enter amount → QR displays
2. Pay tab → QR Code method → Scan → Confirm → Success

## 🎯 Key Features

### 🚀 Production Ready:
- Real Open Payments integration (not mock/demo)
- Error handling and user feedback
- Cross-platform compatibility
- Secure payment processing

### 💡 User Experience:
- Intuitive QR code generation for merchants
- Simple scan-to-pay for customers
- Real-time payment confirmation
- Clear payment status updates

### 🔒 Security:
- Open Payments GNAP authentication
- Ed25519 cryptographic signatures
- No private keys stored in mobile app
- Backend-only sensitive operations

## 📞 Support

### Common Issues:

**"Backend offline" error:**
- Make sure backend server is running on port 3001
- Check if `private.key` file exists in root directory

**"Camera permission denied":**
- Grant camera access in device settings
- Restart the app after granting permission

**"QR scan failed":**
- Ensure QR code is well-lit and in focus
- Only scan QR codes generated by Direla merchants

### Logs:
- Backend logs show detailed Open Payments operations
- Mobile app logs payment flow steps
- Check network connectivity if payments fail

## 🎉 Success!

You now have a complete QR code payment system with real Open Payments integration! 
Merchants can generate QR codes and customers can scan to pay using the global Interledger network.

The system is ready for South African markets with ZAR support and global payment capabilities. 🇿🇦💰 