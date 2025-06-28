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

export default function WhatsAppPaymentInitiator({ onSendWhatsAppPayment }: { onSendWhatsAppPayment: (amount: string, description: string, whatsappNumber: string) => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Payment OTP Via WhatsApp</Text>
      <Text style={styles.subtitle}>Send a payment OTP to a customer via WhatsApp</Text>

      {/* Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Amount (ZAR)</Text>
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

      {/* WhatsApp Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>WhatsApp Number</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>+27</Text>
          <TextInput
            style={styles.amountInput}
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            placeholder="712345678"
            keyboardType="numeric"
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
        onPress={() => onSendWhatsAppPayment(amount, description, whatsappNumber)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.generateButtonText}>Send Payment OTP</Text>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 This will create a secure payment request using Open Payments protocol. 
          Customers can scan and pay from anywhere in the world.
        </Text>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          💡 This will create a secure payment request using Open Payments protocol. 
          Customers can scan and pay from anywhere in the world.
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
}); 