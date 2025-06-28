import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Dynamic IP detection for Expo development
function getApiBaseUrl() {
  if (__DEV__) {
    // Force use the network IP for mobile device connectivity
    return 'http://192.168.10.95:3001'; 
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
      complete: '/api/payment/complete',  // ← Add this missing endpoint
      qr: '/api/qr/generate'
    }
  }

};

export default API_CONFIG;