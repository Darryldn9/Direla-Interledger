import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Dynamic IP detection for Expo development
function getApiBaseUrl() {
  if (__DEV__) {
    // Force use the network IP for mobile device connectivity
    return 'http://192.168.10.56:3001';
  }
  
  // In production, use your deployed backend URL
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
}

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    health: '/health',
    serverInfo: '/api/server/info',
    wallet: '/api/wallet',
    payment: {
      incoming: '/api/payment/incoming',
      quote: '/api/payment/quote',
      send: '/api/payment/send',
      qr: '/api/qr/generate'
    }
  },
  
  // Open Payments configuration
  OPEN_PAYMENTS: {
    walletAddressUrl: 'https://ilp.interledger-test.dev/daddyd',
    keyId: '2498c668-28a2-44e4-8d89-4cd29e886901'
  }
};

export default API_CONFIG; 