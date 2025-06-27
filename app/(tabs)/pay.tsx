import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  QrCode,
  MessageCircle,
  Nfc,
  Users,
  ShoppingCart,
  Zap,
  ArrowRight,
  MapPin,
} from 'lucide-react-native';

interface QuickContact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}

interface NearbyMerchant {
  id: string;
  name: string;
  distance: string;
  category: string;
  rating: number;
}

export default function PayScreen() {
  const insets = useSafeAreaInsets();
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'whatsapp' | 'tap' | 'contacts'>('qr');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const quickContacts: QuickContact[] = [
    { id: '1', name: 'Thabo', phone: '+27123456789', avatar: '👨🏾' },
    { id: '2', name: 'Lerato', phone: '+27123456790', avatar: '👩🏾' },
    { id: '3', name: 'Sipho', phone: '+27123456791', avatar: '👨🏾' },
    { id: '4', name: 'Nomsa', phone: '+27123456792', avatar: '👩🏾' },
  ];

  const nearbyMerchants: NearbyMerchant[] = [
    { id: '1', name: 'Mama Thandi\'s Spaza', distance: '0.2km', category: 'Groceries', rating: 4.8 },
    { id: '2', name: 'Bra Joe\'s Electronics', distance: '0.5km', category: 'Electronics', rating: 4.6 },
    { id: '3', name: 'Corner Store', distance: '0.8km', category: 'General', rating: 4.3 },
    { id: '4', name: 'Petrol Station Shop', distance: '1.2km', category: 'Fuel & Snacks', rating: 4.5 },
  ];

  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const paymentData = {
      method: paymentMethod,
      amount: parseFloat(amount),
      recipient,
      timestamp: new Date().toISOString(),
    };

    // Simulate Interledger processing
    Alert.alert(
      'Payment Initiated',
      `Processing R${amount} payment via ${paymentMethod.toUpperCase()}. Transaction will be processed through Interledger for optimal routing.`,
      [
        { text: 'OK', onPress: () => {
          setAmount('');
          setRecipient('');
        }}
      ]
    );
  };

  const PaymentMethodButton = ({ 
    method, 
    icon, 
    title, 
    description 
  }: { 
    method: typeof paymentMethod, 
    icon: React.ReactNode, 
    title: string, 
    description: string 
  }) => (
    <TouchableOpacity
      style={[
        styles.methodButton,
        paymentMethod === method && styles.methodButtonActive
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View style={[
        styles.methodIcon,
        paymentMethod === method && styles.methodIconActive
      ]}>
        {icon}
      </View>
      <View style={styles.methodInfo}>
        <Text style={[
          styles.methodTitle,
          paymentMethod === method && styles.methodTitleActive
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.methodDescription,
          paymentMethod === method && styles.methodDescriptionActive
        ]}>
          {description}
        </Text>
      </View>
      {paymentMethod === method && (
        <View style={styles.activeIndicator} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Send Payment</Text>
          <Text style={styles.headerSubtitle}>Choose your payment method</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          <PaymentMethodButton
            method="qr"
            icon={<QrCode size={24} color={paymentMethod === 'qr' ? '#2C3E50' : '#0C7C59'} />}
            title="QR Code"
            description="Scan to pay instantly"
          />
          <PaymentMethodButton
            method="whatsapp"
            icon={<MessageCircle size={24} color={paymentMethod === 'whatsapp' ? '#2C3E50' : '#25D366'} />}
            title="WhatsApp Pay"
            description="Send via WhatsApp message"
          />
          <PaymentMethodButton
            method="tap"
            icon={<Nfc size={24} color={paymentMethod === 'tap' ? '#2C3E50' : '#3498DB'} />}
            title="Tap to Pay"
            description="NFC contactless payment"
          />
          <PaymentMethodButton
            method="contacts"
            icon={<Users size={24} color={paymentMethod === 'contacts' ? '#2C3E50' : '#9B59B6'} />}
            title="Contacts"
            description="Send to phone number"
          />
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount (ZAR)</Text>
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

        {/* Quick Contacts - Show when contacts method is selected */}
        {paymentMethod === 'contacts' && (
          <View style={styles.quickContactsContainer}>
            <Text style={styles.sectionTitle}>Quick Contacts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.contactsList}>
                {quickContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={styles.contactItem}
                    onPress={() => setRecipient(contact.phone)}
                  >
                    <Text style={styles.contactAvatar}>{contact.avatar}</Text>
                    <Text style={styles.contactName}>{contact.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            {/* Manual Phone Number Input */}
            <TextInput
              style={styles.phoneInput}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#BDC3C7"
            />
          </View>
        )}

        {/* Nearby Merchants */}
        <View style={styles.merchantsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Merchants</Text>
            <TouchableOpacity>
              <MapPin size={20} color="#0C7C59" />
            </TouchableOpacity>
          </View>
          {nearbyMerchants.map((merchant) => (
            <TouchableOpacity key={merchant.id} style={styles.merchantItem}>
              <View style={styles.merchantIcon}>
                <ShoppingCart size={20} color="#0C7C59" />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <Text style={styles.merchantCategory}>
                  {merchant.category} • {merchant.distance} • ⭐ {merchant.rating}
                </Text>
              </View>
              <ArrowRight size={16} color="#BDC3C7" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bill Splitting Feature */}
        <View style={styles.billSplitContainer}>
          <TouchableOpacity style={styles.billSplitButton}>
            <Users size={20} color="#9B59B6" />
            <Text style={styles.billSplitText}>Split Bill with Friends</Text>
            <ArrowRight size={16} color="#9B59B6" />
          </TouchableOpacity>
        </View>

        {/* Payment Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Zap size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>
            {paymentMethod === 'qr' ? 'Generate QR Code' :
             paymentMethod === 'whatsapp' ? 'Send via WhatsApp' :
             paymentMethod === 'tap' ? 'Ready to Tap' :
             'Send Payment'}
          </Text>
        </TouchableOpacity>

        {/* Interledger Info */}
        <View style={styles.interledgerInfo}>
          <Text style={styles.infoTitle}>💡 Smart Routing</Text>
          <Text style={styles.infoText}>
            Payments are automatically routed through the most cost-effective network via Interledger Protocol, ensuring lowest fees and fastest settlement.
          </Text>
        </View>
        
        {/* Bottom Safe Area Spacer */}
        <View style={{ height: insets.bottom + 10 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  methodsContainer: {
    padding: 20,
    gap: 12,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  methodButtonActive: {
    backgroundColor: '#0C7C59',
    borderColor: '#0C7C59',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  methodTitleActive: {
    color: '#FFFFFF',
  },
  methodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  methodDescriptionActive: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  methodIconActive: {
    backgroundColor: '#FFFFFF',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1C40F',
  },
  amountContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    paddingVertical: 16,
  },
  quickContactsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  contactsList: {
    flexDirection: 'row',
    gap: 16,
  },
  contactItem: {
    alignItems: 'center',
    gap: 8,
  },
  contactAvatar: {
    fontSize: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  contactName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
  },
  phoneInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  merchantsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  merchantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  merchantCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  billSplitContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  billSplitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  billSplitText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9B59B6',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C7C59',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  payButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  interledgerInfo: {
    backgroundColor: '#FFF3CD',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#856404',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#856404',
    lineHeight: 20,
  },
});