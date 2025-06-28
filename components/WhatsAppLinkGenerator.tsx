import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Share,
  Platform
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { CheckCircle, Share2, Copy } from 'lucide-react-native';
// Removed problematic import - using hardcoded URL

interface WhatsAppLinkGeneratorProps {
  onLinkGenerated?: (link: any, phoneNumber: string) => void;
}

export default function WhatsAppLinkGenerator({ onLinkGenerated }: WhatsAppLinkGeneratorProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency] = useState('ZAR');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const generateLink = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Generating QR code for amount:', amount);
      
      // Call backend to create real Open Payments incoming payment
      const response = await fetch(`http://196.47.226.189:3001/api/qr/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: currency,
          description: description || `Payment of ${currency} ${amount}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate QR code');
      }

      console.log('Link generated:', result);
      
      setPaymentInfo(result.payment);
      setGenerated(true);
      
      if (onLinkGenerated) {
        onLinkGenerated(result, phoneNumber);
      }

      Alert.alert(
        'Link Generated! 🎉',
        `Real Open Payments incoming payment created for ${currency} ${amount}.\n\nPayment ID: ${result.payment.id?.split('/').pop() || 'Generated'}\n\nCustomers can now scan this QR code to pay!`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('WhatsApp link generation failed:', error);
      Alert.alert(
        'WhatsApp Link Generation Failed',
        error instanceof Error ? error.message : 'Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (generated && paymentInfo) {
    return (
      <View style={styles.generatedContainer}>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => {
            setGenerated(false);
            setPaymentInfo(null);
            setAmount('');
            setDescription('');
          }}
        >
          <Text style={styles.generateButtonText}>Back</Text>
        </TouchableOpacity>
        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.amountText}>{currency} {amount}</Text>
          {description ? (
            <Text style={styles.descriptionText}>{description}</Text>
          ) : null}
          <View style={styles.statusContainer}>
            <CheckCircle size={16} color="#0C7C59" />
            <Text style={styles.statusText}>Ready for Payment</Text>
          </View>
        </View>

        {/* Instructions */}
        <Text style={styles.instructions}>
          🔍 Customer should use the link sent via WhatsApp to pay.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate Payment Link</Text>
      <Text style={styles.subtitle}>Create a link for customers to pay</Text>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Amount ({currency})</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>R</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor="#BDC3C7"
          />
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>WhatsApp Number</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>+27</Text>
          <TextInput
            style={styles.amountInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="712345678"
            keyboardType="phone-pad"
            placeholderTextColor="#BDC3C7"
          />
        </View>
      </View>

      {/* Description Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Description (Optional)</Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="What is this payment for?"
          placeholderTextColor="#BDC3C7"
          multiline
        />
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, loading && styles.generateButtonDisabled]}
        onPress={generateLink}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Link</Text>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 This will create a secure payment request using Open Payments protocol. 
          Customers can pay from anywhere in the world.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  generatedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0C7C59',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#2C3E50',
  },
  descriptionInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#0C7C59',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  generateButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentDetails: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C7C59',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D5F4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#0C7C59',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#3498DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  newQRButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newQRButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: '#E8F4FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2980B9',
    lineHeight: 20,
    textAlign: 'center',
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
}); 