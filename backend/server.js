require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createAuthenticatedClient, createUnauthenticatedClient } = require('@interledger/open-payments');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load configuration from environment variables
function loadConfig() {
  const requiredEnvVars = [
    'OPEN_PAYMENTS_CLIENT_ADDRESS',
    'OPEN_PAYMENTS_KEY_ID',
    'OPEN_PAYMENTS_SECRET_KEY_PATH'
  ];

  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('💡 Please create a .env file in the backend directory with your Open Payments credentials');
    process.exit(1);
  }

  return {
    // Customer wallet (for sending payments)
    walletAddressUrl: process.env.OPEN_PAYMENTS_CLIENT_ADDRESS,
    keyId: process.env.OPEN_PAYMENTS_KEY_ID,
    privateKeyPath: path.isAbsolute(process.env.OPEN_PAYMENTS_SECRET_KEY_PATH) 
      ? process.env.OPEN_PAYMENTS_SECRET_KEY_PATH 
      : path.join(__dirname, '..', process.env.OPEN_PAYMENTS_SECRET_KEY_PATH),
    
    // Merchant wallet (for receiving payments) 
    merchantWalletUrl: process.env.MERCHANT_WALLET_ADDRESS || process.env.OPEN_PAYMENTS_CLIENT_ADDRESS
  };
}

const CONFIG = loadConfig();

let authenticatedClient;
let unauthenticatedClient;

// Initialize Open Payments clients
async function initialize() {
  try {
    console.log('🔧 Initializing Open Payments Backend for Direla...');
    
    // Check if private key file exists
    if (!fs.existsSync(CONFIG.privateKeyPath)) {
      throw new Error(`Private key file not found at: ${CONFIG.privateKeyPath}`);
    }
    
    // Load private key
    const privateKey = fs.readFileSync(CONFIG.privateKeyPath, 'utf8').trim();
    console.log('✅ Private key loaded from:', CONFIG.privateKeyPath);
    
    // Create unauthenticated client for public operations
    unauthenticatedClient = await createUnauthenticatedClient({
      requestTimeoutMs: 10000,
      validateResponses: true
    });
    console.log('✅ Unauthenticated client created');
    
    // Create authenticated client for payment operations
    authenticatedClient = await createAuthenticatedClient({
      keyId: CONFIG.keyId,
      privateKey: privateKey,
      walletAddressUrl: CONFIG.walletAddressUrl
    });
    console.log('✅ Authenticated client created');
    
    console.log(`✅ Direla Backend ready:
   Customer Wallet (sends): ${CONFIG.walletAddressUrl}
   Merchant Wallet (receives): ${CONFIG.merchantWalletUrl}
   Key ID: ${CONFIG.keyId}
   Port: ${PORT}
   Environment: ${process.env.NODE_ENV || 'development'}`);

  } catch (error) {
    console.error('❌ Failed to initialize:', error.message);
    throw error;
  }
}

// Utility function to get local IP address
function getLocalIPAddress() {
  // Use environment variable if specified
  if (process.env.BACKEND_HOST) {
    return process.env.BACKEND_HOST;
  }

  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Direla Backend',
    customerWallet: CONFIG.walletAddressUrl,
    merchantWallet: CONFIG.merchantWalletUrl,
    keyId: CONFIG.keyId,
    mode: 'REAL_PAYMENTS',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Server info endpoint for dynamic IP discovery
app.get('/api/server/info', (req, res) => {
  const localIP = getLocalIPAddress();
  res.json({
    success: true,
    server: {
      ip: localIP,
      port: PORT,
      baseUrl: `http://${localIP}:${PORT}`,
      status: 'online',
      mode: 'REAL_PAYMENTS',
      environment: process.env.NODE_ENV || 'development',
      customerWallet: CONFIG.walletAddressUrl,
      merchantWallet: CONFIG.merchantWalletUrl,
      endpoints: {
        health: `/health`,
        wallet: `/api/wallet/:address`,
        payment: {
          incoming: `/api/payment/incoming`,
          quote: `/api/payment/quote`,
          send: `/api/payment/send`,
          qr: `/api/qr/generate`
        }
      },
      timestamp: new Date().toISOString()
    }
  });
});

// Test wallet connection
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const walletAddress = decodeURIComponent(req.params.address);
    console.log('🔍 Testing wallet connection:', walletAddress);

    const wallet = await unauthenticatedClient.walletAddress.get({
      url: walletAddress
    });

    res.json({
      success: true,
      wallet: {
        id: wallet.id,
        displayName: wallet.publicName || 'Wallet',
        assetCode: wallet.assetCode,
        assetScale: wallet.assetScale,
        authServer: wallet.authServer,
        resourceServer: wallet.resourceServer
      }
    });

  } catch (error) {
    console.error('Failed to get wallet:', error.message);
    res.status(500).json({
      success: false,
      error: 'Wallet not found',
      message: error.message
    });
  }
});

// Create incoming payment (for QR code generation)
app.post('/api/payment/incoming', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'Direla Payment' } = req.body;
    
    console.log('💰 Creating incoming payment request for MERCHANT wallet:', { amount, currency, description });

    // Get MERCHANT wallet address info (for receiving payments)
    const walletAddress = await unauthenticatedClient.walletAddress.get({
      url: CONFIG.merchantWalletUrl
    });

    // Request grant for incoming payment using CUSTOMER wallet credentials
    const grant = await authenticatedClient.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              type: 'incoming-payment',
              actions: ['create', 'read', 'list']
            }
          ]
        }
      }
    );

    // Create incoming payment on MERCHANT wallet
    const incomingPayment = await authenticatedClient.incomingPayment.create(
      {
        url: walletAddress.resourceServer,
        accessToken: grant.access_token.value
      },
      {
        walletAddress: walletAddress.id,
        incomingAmount: {
          value: (amount * Math.pow(10, walletAddress.assetScale)).toString(),
          assetCode: walletAddress.assetCode,
          assetScale: walletAddress.assetScale
        },
        metadata: {
          description: description,
          source: 'Direla App'
        }
      }
    );

    res.json({
      success: true,
      payment: {
        id: incomingPayment.id,
        walletAddress: incomingPayment.walletAddress,
        incomingAmount: incomingPayment.incomingAmount,
        receivedAmount: incomingPayment.receivedAmount,
        metadata: incomingPayment.metadata,
        createdAt: incomingPayment.createdAt,
        expiresAt: incomingPayment.expiresAt
      }
    });

  } catch (error) {
    console.error('Failed to create incoming payment:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment request',
      message: error.message
    });
  }
});

// Generate QR code data for payment
app.post('/api/qr/generate', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'Direla Payment' } = req.body;
    
    console.log('📱 Generating QR code for payment:', { amount, currency });

    // Create incoming payment first
    const paymentResponse = await fetch(`http://196.47.226.189:${PORT}/api/payment/incoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, description })
    });

    const paymentData = await paymentResponse.json();

    if (!paymentData.success) {
      throw new Error(paymentData.message || 'Failed to create payment');
    }

    // Generate QR code data
    const qrData = {
      type: 'open-payments',
      paymentId: paymentData.payment.id,
      walletAddress: CONFIG.merchantWalletUrl,  // QR points to MERCHANT wallet
      amount: amount,
      currency: currency,
      description: description,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      qrData: JSON.stringify(qrData),
      payment: paymentData.payment,
      displayInfo: {
        merchantName: 'Direla Merchant',
        amount: `${currency} ${amount}`,
        description: description
      }
    });

  } catch (error) {
    console.error('Failed to generate QR code:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code',
      message: error.message
    });
  }
});

// Create payment quote
app.post('/api/payment/quote', async (req, res) => {
  try {
    const { walletAddress: recipientWallet, amount, assetCode = 'USD', assetScale = 2, incomingPaymentId } = req.body;
    
    console.log('💱 Creating payment quote:', { recipientWallet, amount, assetCode, incomingPaymentId });

    // Get recipient wallet info
    const recipientWalletAddress = await unauthenticatedClient.walletAddress.get({
      url: recipientWallet
    });

    // Get our sender wallet info
    const senderWallet = await unauthenticatedClient.walletAddress.get({
      url: CONFIG.walletAddressUrl
    });

    let receiver = incomingPaymentId;

    // If no incoming payment ID provided, we need to create one
    if (!incomingPaymentId) {
      console.log('Creating incoming payment for quote...');
      
      // Request grant for incoming payment creation
      const incomingGrant = await authenticatedClient.grant.request(
        { url: recipientWalletAddress.authServer },
        {
          access_token: {
            access: [
              {
                type: 'incoming-payment',
                actions: ['create', 'read']
              }
            ]
          }
        }
      );

      // Create incoming payment
      const incomingPayment = await authenticatedClient.incomingPayment.create(
        {
          url: recipientWalletAddress.resourceServer,
          accessToken: incomingGrant.access_token.value
        },
        {
          walletAddress: recipientWalletAddress.id,
          incomingAmount: {
            value: (amount * Math.pow(10, recipientWalletAddress.assetScale)).toString(),
            assetCode: recipientWalletAddress.assetCode,
            assetScale: recipientWalletAddress.assetScale
          },
          metadata: {
            source: 'Direla App',
            description: `Payment of ${assetCode} ${amount}`
          }
        }
      );

      receiver = incomingPayment.id;
      console.log('✅ Created incoming payment:', receiver);
    }

    // Request grant for quotes
    const quoteGrant = await authenticatedClient.grant.request(
      { url: senderWallet.authServer },
      {
        access_token: {
          access: [
            {
              type: 'quote',
              actions: ['create', 'read']
            }
          ]
        }
      }
    );

    // Create quote using debitAmount (what sender will pay)
    const quote = await authenticatedClient.quote.create(
      {
        url: senderWallet.resourceServer,
        accessToken: quoteGrant.access_token.value
      },
      {
        walletAddress: senderWallet.id,
        receiver: receiver,
        method: 'ilp',
        // debitAmount: {
        //   value: (amount * Math.pow(10, recipientWallet.assetScale)).toString(),
        //   assetCode: senderWallet.assetCode,
        //   assetScale: senderWallet.assetScale
        // }
      }
    );

    console.log('✅ Quote created successfully:', quote.id);

    res.json({
      success: true,
      quote: {
        id: quote.id,
        walletAddress: quote.walletAddress,
        receiver: quote.receiver,
        sendAmount: quote.debitAmount,
        receiveAmount: quote.receiveAmount,
        createdAt: quote.createdAt,
        expiresAt: quote.expiresAt
      },
      incomingPaymentId: receiver
    });

  } catch (error) {
    console.error('Failed to create quote:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment quote',
      message: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Store completed authorizations temporarily
const completedAuthorizations = new Map();

// Send payment with proper interactive authorization
app.post('/api/payment/send', async (req, res) => {
  try {
    const { quoteId, incomingPaymentId } = req.body;
    
    console.log('🚀 Sending payment with quote:', quoteId);
    console.log('📦 Request body:', { quoteId, incomingPaymentId });

    // Get our wallet info
    const walletAddress = await unauthenticatedClient.walletAddress.get({
      url: CONFIG.walletAddressUrl
    });
    console.log('✅ Wallet address retrieved:', walletAddress.id);

    // Generate a unique nonce for this payment
    const crypto = require('crypto');
    const nonce = crypto.randomBytes(16).toString('hex');
    const localIP = getLocalIPAddress();

    // Get quote details for authorization context
    const quoteGrant = await authenticatedClient.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              type: 'quote',
              actions: ['read']
            }
          ]
        }
      }
    );

    const quote = await authenticatedClient.quote.get({
      url: quoteId,
      accessToken: quoteGrant.access_token.value
    });

    // Request grant for outgoing payments with INTERACTIVE authorization
    console.log('🔐 Requesting outgoing payment grant with interactive auth...');
    const grant = await authenticatedClient.grant.request(
      { url: walletAddress.authServer },
      {
        access_token: {
          access: [
            {
              type: 'outgoing-payment',
              actions: ['create', 'read'],
              identifier: walletAddress.id,
              limits: {
                debitAmount: quote.debitAmount
              }
            }
          ]
        },
        interact: {
          start: ['redirect'],
          finish: {
            method: 'redirect',
            uri: `http://${localIP}:${PORT}/payment/complete?quoteId=${encodeURIComponent(quoteId)}&amount=${quote.debitAmount.value}&currency=${quote.debitAmount.assetCode}`,
            nonce: nonce
          }
        },
        client: {
          name: 'Direla Mobile App',
          uri: CONFIG.walletAddressUrl
        }
      }
    );

    // Check if interactive authorization is required
    if (grant.interact) {
      console.log('🔐 Interactive authorization required');
      console.log('📱 Authorization URL:', grant.interact.redirect);
      
      // Return the authorization URL for the user to approve
      return res.json({
        success: false,
        requiresAuth: true,
        authUrl: grant.interact.redirect,
        continueToken: grant.continue.access_token.value,
        continueUri: grant.continue.uri,
        nonce: nonce,
        message: 'Payment requires user authorization. Please visit the authorization URL.'
      });
    }

    console.log('✅ Grant received without interactive auth:', grant.access_token.value.substring(0, 20) + '...');

    // Create outgoing payment if no auth required
    console.log('💸 Creating outgoing payment...');
    const paymentRequest = {
      walletAddress: walletAddress.id,
      quoteId: quoteId,
      metadata: {
        description: 'Direla QR Payment',
        source: 'Direla App'
      }
    };

    const outgoingPayment = await authenticatedClient.outgoingPayment.create(
      {
        url: walletAddress.resourceServer,
        accessToken: grant.access_token.value
      },
      paymentRequest
    );

    console.log('✅ Payment created successfully:', {
      id: outgoingPayment.id,
      state: outgoingPayment.state,
      sentAmount: outgoingPayment.sentAmount
    });

    res.json({
      success: true,
      outgoingPayment: {
        id: outgoingPayment.id,
        walletAddress: outgoingPayment.walletAddress,
        quoteId: outgoingPayment.quoteId,
        receiveAmount: outgoingPayment.receiveAmount,
        debitAmount: outgoingPayment.debitAmount,
        sentAmount: outgoingPayment.sentAmount,
        state: outgoingPayment.state,
        createdAt: outgoingPayment.createdAt
      },
      incomingPaymentId: incomingPaymentId
    });

  } catch (error) {
    console.error('❌ Failed to send payment:', error.message);
    console.error('❌ Full error details:', error);
    if (error.response) {
      console.error('❌ Error response:', error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to send payment',
      message: error.message,
      details: error.response?.data || 'No additional error details'
    });
  }
});

// Complete the payment after user authorization
app.post('/api/payment/complete', async (req, res) => {
  try {
    const { continueToken, continueUri, quoteId, description = 'Direla QR Payment' } = req.body;

    if (!continueToken || !continueUri || !quoteId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required authorization parameters'
      });
    }

    // Check if we have a completed authorization for any interact_ref
    let authData = null;
    for (const [interactRef, data] of completedAuthorizations.entries()) {
      if (data.quoteId === quoteId || Date.now() - data.timestamp < 300000) { // 5 minutes
        authData = data;
        break;
      }
    }

    if (!authData) {
      return res.status(400).json({
        success: false,
        error: 'No completed authorization found. Please authorize the payment first.',
        needsAuth: true
      });
    }

    console.log('🔐 Completing authorized payment:', { quoteId, interactRef: authData.interact_ref });

    // Get our wallet address info
    const walletAddress = await unauthenticatedClient.walletAddress.get({
      url: CONFIG.walletAddressUrl
    });

    // Continue the grant with the authorization proof
    const finalizedGrant = await authenticatedClient.grant.continue(
      {
        url: continueUri,
        accessToken: continueToken
      },
      {
        interact_ref: authData.interact_ref
      }
    );

    // Clean up the used authorization
    completedAuthorizations.delete(authData.interact_ref);

    console.log('✅ Grant finalized after user authorization');

    // Create outgoing payment with finalized grant
    const outgoingPayment = await authenticatedClient.outgoingPayment.create(
      {
        url: walletAddress.resourceServer,
        accessToken: finalizedGrant.access_token.value
      },
      {
        walletAddress: walletAddress.id,
        quoteId: quoteId,
        metadata: {
          description: description
        }
      }
    );

    console.log('✅ Outgoing payment created successfully:', {
      id: outgoingPayment.id,
      sentAmount: outgoingPayment.sentAmount,
      receiveAmount: outgoingPayment.receiveAmount,
      failed: outgoingPayment.failed
    });

    res.json({
      success: true,
      outgoingPayment: {
        id: outgoingPayment.id,
        walletAddress: outgoingPayment.walletAddress,
        quoteId: outgoingPayment.quoteId,
        receiveAmount: outgoingPayment.receiveAmount,
        debitAmount: outgoingPayment.debitAmount,
        sentAmount: outgoingPayment.sentAmount,
        state: outgoingPayment.state,
        createdAt: outgoingPayment.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Failed to complete authorized payment:', error.message);
    console.error('❌ Full error details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete payment',
      message: error.message,
      details: error.response?.data || 'No additional error details'
    });
  }
});

// Payment authorization callback endpoint
app.get('/payment/complete', (req, res) => {
  const { hash, interact_ref, quoteId, amount, currency } = req.query;
  console.log('✅ Payment authorization callback:', { hash, interact_ref, quoteId, amount, currency });
  
  // Store the authorization details for the mobile app to pick up
  if (interact_ref) {
    completedAuthorizations.set(interact_ref, {
      hash,
      interact_ref,
      quoteId,
      amount,
      currency,
      timestamp: Date.now()
    });
    
    // Clean up old authorizations after 5 minutes
    setTimeout(() => {
      completedAuthorizations.delete(interact_ref);
    }, 5 * 60 * 1000);
  }
  
  res.send(`
    <html>
      <head><title>Payment Authorization</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>✅ Payment Authorization Complete!</h1>
        <p>Your payment has been authorized successfully.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Payment Details:</h3>
          <p><strong>Amount:</strong> ${currency || 'ZAR'} ${amount || 'N/A'}</p>
          <p><strong>Authorization ID:</strong> ${interact_ref}</p>
          <p><strong>Quote ID:</strong> ${quoteId ? quoteId.split('/').pop() : 'N/A'}</p>
        </div>
        
        <hr>
        <p><strong>✅ Return to your mobile app - payment will complete automatically!</strong></p>
        <p><em>You can close this window now.</em></p>
        <script>
          setTimeout(() => {
            try {
              window.close();
            } catch(e) {}
          }, 10000);
        </script>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
async function startServer() {
  try {
    await initialize();
    app.listen(PORT, () => {
      const localIP = getLocalIPAddress();
      console.log(`🚀 Direla Backend running on:`);
      console.log(`   Local: http://localhost:${PORT}`);
      console.log(`   Network: http://${localIP}:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();