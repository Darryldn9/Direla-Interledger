# Direla - South African Payment Solution

A comprehensive mobile payment solution designed for South African communities, featuring wallet management, peer-to-peer lending, merchant tools, and multiple payment methods with offline support.

## 🌟 Features

### 💰 Digital Wallet
- **Balance Management**: View and manage your digital wallet balance
- **Transaction History**: Track all payments, receipts, and transfers
- **Reward Points**: Earn points through transactions and activities
- **Offline Support**: Continue using core features even without internet connection
- **Multi-language Support**: Local greetings and South African context

### 🤝 Community Lending
- **Borrow Money**: Apply for loans with community-based credit scoring
- **Lend Money**: Earn interest by lending to community members
- **Credit Score Tracking**: Build your creditworthiness through payment history
- **Risk Assessment**: Transparent risk ratings for all lending opportunities
- **Peer-to-Peer Network**: Direct lending between community members

### 🏪 Merchant Dashboard
- **Business Analytics**: Track daily, weekly, and monthly revenue
- **Payment Acceptance**: Toggle payment acceptance on/off
- **QR Code Generation**: Create instant payment QR codes
- **Transaction Management**: Monitor all customer transactions
- **Offline Mode**: Accept payments even without internet connectivity

### 💳 Multiple Payment Methods
- **QR Code Payments**: Scan to pay instantly
- **WhatsApp Pay**: Send payments via WhatsApp messages
- **Tap to Pay**: NFC contactless payments
- **Contact Payments**: Send money directly to phone numbers
- **Nearby Merchants**: Discover and pay local businesses

### 🌐 Interledger Integration
- **Cross-Network Payments**: Connect to multiple payment networks
- **Low Fees**: Guaranteed competitive transaction fees
- **Optimal Routing**: Automatic best-path payment routing
- **Network Resilience**: Fallback options for failed transactions

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **Language**: TypeScript
- **UI Components**: Custom components with Lucide React Native icons
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet
- **Platform Support**: iOS, Android, and Web

## 📱 Screenshots & App Structure

The app consists of five main tabs:

1. **Home/Wallet** (`index.tsx`) - Main dashboard with balance and transactions
2. **Lending** (`lending.tsx`) - Borrowing and lending interface
3. **Merchant** (`merchant.tsx`) - Business tools and analytics
4. **Pay** (`pay.tsx`) - Payment methods and money transfer
5. **Settings** (`settings.tsx`) - App configuration and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Direla
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

### Available Scripts

- `npm run dev` - Start the development server with Expo
- `npm run build:web` - Build the app for web deployment
- `npm run lint` - Run ESLint for code quality checks

## 🎯 Target Audience

This app is specifically designed for:

- **South African Communities**: Local language support and cultural context
- **Spaza Shop Owners**: Small business payment solutions
- **Community Members**: Peer-to-peer financial services
- **Unbanked/Underbanked**: Alternative financial services
- **Mobile-First Users**: Optimized for smartphone usage

## 🔧 Configuration

### Environment Setup

The app uses Expo configuration in `app.json`. Key settings include:

- **App Name**: Currently set to "bolt-expo-nativewind" (can be updated)
- **Slug**: bolt-expo-nativewind
- **Platform Support**: iOS, Android, Web
- **New Architecture**: Enabled for better performance

### Customization

To customize the app for your specific use case:

1. Update `app.json` with your app name and branding
2. Modify currency symbols and language in component files
3. Adjust color schemes in StyleSheet definitions
4. Configure payment provider integrations
5. Set up your Interledger network connections

## 🔒 Security Features

- **Offline Transaction Storage**: Secure local transaction queuing
- **Payment Verification**: Multiple confirmation steps for transactions
- **Community Trust Scoring**: Reputation-based lending decisions
- **Secure Payment Routing**: Interledger protocol security standards

## 🌍 Localization

The app includes South African-specific features:

- Zulu greeting: "Sawubona" 
- South African Rand (ZAR) currency
- Local business scenarios (spaza shops, taxi services)
- Community-focused financial services

## 📈 Future Enhancements

- Integration with South African banks
- Government ID verification
- Expanded offline capabilities
- Additional local payment methods
- Enhanced merchant analytics
- Group saving schemes (stokvels)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the Expo documentation for framework-related questions

## 🙏 Acknowledgments

- Expo team for the excellent React Native framework
- Lucide for beautiful open-source icons
- South African fintech community for inspiration and feedback
- Interledger Foundation for payment protocol standards

---

**Note**: This app is designed for demonstration purposes. For production use, ensure proper security audits, regulatory compliance, and integration with licensed financial service providers. 