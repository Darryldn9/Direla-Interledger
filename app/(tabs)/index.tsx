import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Gift,
  Shield,
  Wifi,
  WifiOff,
  CreditCard,
  Smartphone,
  MapPin,
  X,
  ArrowRight,
  Building,
  Banknote,
} from 'lucide-react-native';

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'offline';
}

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [showBalance, setShowBalance] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(2847.50);
  const [rewardPoints, setRewardPoints] = useState(1250);
  
  // Add Money Flow States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Bank payment states
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  
  // Mobile money states
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('');
  
  // Cash deposit states
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Withdraw Flow States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);
  
  // Withdraw method states
  const [withdrawBankAccount, setWithdrawBankAccount] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('');
  const [atmLocation, setAtmLocation] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'received',
      amount: 150.00,
      description: 'From Thabo M.',
      timestamp: '2 hours ago',
      status: 'completed',
    },
    {
      id: '2',
      type: 'sent',
      amount: -45.50,
      description: 'Spaza Shop - Groceries',
      timestamp: '5 hours ago',
      status: 'completed',
    },
    {
      id: '3',
      type: 'deposit',
      amount: 500.00,
      description: 'Cash Deposit - ATM',
      timestamp: 'Yesterday',
      status: 'completed',
    },
    {
      id: '4',
      type: 'sent',
      amount: -25.00,
      description: 'Electricity Bill Split',
      timestamp: '2 days ago',
      status: 'offline',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // Payment Methods Data
  const paymentMethods = [
    {
      id: 'bank',
      title: 'Bank Transfer',
      subtitle: 'Transfer from your bank account',
      icon: Building,
      color: '#3498DB',
    },
    {
      id: 'mobile',
      title: 'Mobile Money',
      subtitle: 'M-Pesa, MTN, Airtel, Vodacom',
      icon: Smartphone,
      color: '#E74C3C',
    },
    {
      id: 'cash',
      title: 'Cash Deposit',
      subtitle: 'Deposit at local agents',
      icon: MapPin,
      color: '#F39C12',
    },
  ];

  // Mobile Money Providers
  const mobileProviders = [
    { id: 'mpesa', name: 'M-Pesa', color: '#00A651' },
    { id: 'mtn', name: 'MTN MoMo', color: '#FFCC00' },
    { id: 'airtel', name: 'Airtel Money', color: '#E60012' },
    { id: 'vodacom', name: 'VodaPay', color: '#E60000' },
  ];

  // Banks List
  const banks = [
    'Standard Bank', 'FNB', 'ABSA', 'Nedbank', 'Capitec Bank', 
    'Discovery Bank', 'African Bank', 'Investec', 'TymeBank'
  ];

  // Cash Deposit Locations
  const cashLocations = [
    'Pick n Pay', 'Shoprite', 'Checkers', 'Spar', 'OK Foods',
    'Post Office', 'Pep Stores', 'Boxer', 'Cambridge Foods'
  ];

  // Withdraw Methods Data
  const withdrawMethods = [
    {
      id: 'atm',
      title: 'ATM Withdrawal',
      subtitle: 'Withdraw cash from any ATM',
      icon: CreditCard,
      color: '#E74C3C',
    },
    {
      id: 'bank',
      title: 'Bank Transfer',
      subtitle: 'Transfer to your bank account',
      icon: Building,
      color: '#3498DB',
    },
    {
      id: 'pickup',
      title: 'Cash Pickup',
      subtitle: 'Collect cash at partner locations',
      icon: MapPin,
      color: '#F39C12',
    },
  ];

  // ATM Locations
  const atmLocations = [
    'Standard Bank ATM', 'FNB ATM', 'ABSA ATM', 'Nedbank ATM', 'Capitec ATM',
    'Pick n Pay ATM', 'Shoprite ATM', 'Checkers ATM'
  ];

  // Cash Pickup Locations
  const pickupLocations = [
    'Pick n Pay Money Market', 'Shoprite Money Market', 'Pep Cell',
    'Post Office', 'Spar Express', 'BoxerPay', 'OK MobiMoney'
  ];

  const handleAddMoney = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    // Reset form data
    setAmount('');
    setBankAccount('');
    setBankName('');
    setMobileNumber('');
    setMobileProvider('');
    setSelectedLocation('');
  };

  const processPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate different processing times for different methods
      const processingTime = selectedPaymentMethod === 'bank' ? 3000 : 
                           selectedPaymentMethod === 'mobile' ? 2000 : 1500;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Success - add money to wallet and show confirmation
      const addedAmount = parseFloat(amount);
      addMoneyToWallet(addedAmount, selectedPaymentMethod);
      
      const pointsEarned = Math.floor(addedAmount);
      
      Alert.alert(
        'Money Added Successfully! 🎉',
        `R${amount} has been added to your wallet via ${
          selectedPaymentMethod === 'bank' ? 'bank transfer' : 
          selectedPaymentMethod === 'mobile' ? 'mobile money' : 
          'cash deposit'
        }.\n\nNew Balance: R${(balance + addedAmount).toFixed(2)}\nReward Points Earned: +${pointsEarned} points`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPaymentModal(false);
              setSelectedPaymentMethod('');
              // Refresh to show new transaction
              onRefresh();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
    setAmount('');
  };

  const addMoneyToWallet = (amount: number, paymentMethod: string) => {
    const newAmount = parseFloat(amount.toFixed(2));
    
    // Update balance
    setBalance(prevBalance => prevBalance + newAmount);
    
    // Add reward points (1 point per ZAR)
    const pointsEarned = Math.floor(newAmount);
    setRewardPoints(prevPoints => prevPoints + pointsEarned);
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount: newAmount,
      description: `${paymentMethod === 'bank' ? 'Bank Transfer' : 
                    paymentMethod === 'mobile' ? 'Mobile Money' : 
                    'Cash Deposit'} - Add Money`,
      timestamp: 'Just now',
      status: 'completed',
    };
    
    // Add to transactions list (at the beginning)
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleWithdrawMethodSelect = (methodId: string) => {
    setSelectedWithdrawMethod(methodId);
    // Reset form data
    setWithdrawAmount('');
    setWithdrawBankAccount('');
    setWithdrawBankName('');
    setAtmLocation('');
    setPickupLocation('');
  };

  const processWithdrawal = async () => {
    const withdrawalAmount = parseFloat(withdrawAmount);
    
    if (!withdrawAmount || withdrawalAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > balance) {
      Alert.alert('Insufficient Funds', `You cannot withdraw more than your available balance of R${balance.toFixed(2)}`);
      return;
    }

    setIsWithdrawProcessing(true);

    try {
      // Simulate different processing times for different methods
      const processingTime = selectedWithdrawMethod === 'atm' ? 1000 : 
                           selectedWithdrawMethod === 'bank' ? 2500 : 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Success - deduct money from wallet and show confirmation
      withdrawMoneyFromWallet(withdrawalAmount, selectedWithdrawMethod);
      
      Alert.alert(
        'Withdrawal Initiated! 💸',
        `R${withdrawAmount} withdrawal request has been processed.\n\n${
          selectedWithdrawMethod === 'atm' ? 'Your withdrawal code will be sent via SMS. Valid for 24 hours.' : 
          selectedWithdrawMethod === 'bank' ? 'Funds will be transferred to your bank account within 2-24 hours.' : 
          'Your pickup reference will be sent via SMS. Collect within 30 days.'
        }\n\nNew Balance: R${(balance - withdrawalAmount).toFixed(2)}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowWithdrawModal(false);
              setSelectedWithdrawMethod('');
              // Refresh to show new transaction
              onRefresh();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Withdrawal Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsWithdrawProcessing(false);
    }
  };

  const withdrawMoneyFromWallet = (amount: number, withdrawMethod: string) => {
    const withdrawalAmount = parseFloat(amount.toFixed(2));
    
    // Update balance (subtract money)
    setBalance(prevBalance => prevBalance - withdrawalAmount);
    
    // Create new transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount: -withdrawalAmount, // Negative for withdrawal
      description: `${withdrawMethod === 'atm' ? 'ATM Withdrawal' : 
                    withdrawMethod === 'bank' ? 'Bank Transfer' : 
                    'Cash Pickup'} - Withdraw`,
      timestamp: 'Just now',
      status: 'completed',
    };
    
    // Add to transactions list (at the beginning)
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setSelectedWithdrawMethod('');
    setWithdrawAmount('');
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'offline') {
      return <WifiOff size={20} color="#F39C12" />;
    }
    
    switch (type) {
      case 'sent':
        return <ArrowUp size={20} color="#E74C3C" />;
      case 'received':
        return <ArrowDown size={20} color="#0C7C59" />;
      case 'deposit':
        return <Plus size={20} color="#3498DB" />;
      case 'withdrawal':
        return <Minus size={20} color="#E67E22" />;
      default:
        return <ArrowUp size={20} color="#95A5A6" />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Sawubona, Nomsa!</Text>
            <View style={styles.statusContainer}>
              {isOnline ? (
                <Wifi size={20} color="#0C7C59" />
              ) : (
                <WifiOff size={20} color="#F39C12" />
              )}
              <Text style={[styles.statusText, { color: isOnline ? '#0C7C59' : '#F39C12' }]}>
                {isOnline ? 'Online' : 'Offline Mode'}
              </Text>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <EyeOff size={24} color="#FFFFFF" />
              ) : (
                <Eye size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {showBalance ? `R ${balance.toFixed(2)}` : 'R ••••••'}
          </Text>
          <View style={styles.rewardsContainer}>
            <Gift size={16} color="#F1C40F" />
            <Text style={styles.rewardsText}>{rewardPoints} Reward Points</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddMoney}>
            <Plus size={24} color="#0C7C59" />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleWithdraw}>
            <Minus size={24} color="#E67E22" />
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/pay')}>
            <ArrowUp size={24} color="#3498DB" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Shield size={24} color="#9B59B6" />
            <Text style={styles.actionText}>Secure</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.slice(0, 6).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type, transaction.status)}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionTime}>
                  {transaction.timestamp}
                  {transaction.status === 'offline' && ' • Syncing...'}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.amount > 0 ? '#0C7C59' : '#E74C3C',
                  },
                ]}
              >
                {transaction.amount > 0 ? '+' : ''}R {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Interledger Status */}
        <View style={styles.interledgerStatus}>
          <Text style={styles.statusTitle}>Interledger Network</Text>
          <Text style={styles.statusDescription}>
            Connected to 5 payment networks • Low fees guaranteed
          </Text>
          <View style={styles.networkIndicators}>
            {['Visa', 'M-Pesa', 'PayFast', 'Bank', 'Cash'].map((network, index) => (
              <View key={network} style={styles.networkDot}>
                <Text style={styles.networkText}>{network}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Bottom Safe Area Spacer */}
        <View style={{ height: insets.bottom + 10 }} />
      </ScrollView>

      {/* Add Money Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.modalTitle}>Add Money</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <X size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {!selectedPaymentMethod ? (
              // Payment Method Selection
              <View>
                <Text style={styles.sectionTitle}>Choose Payment Method</Text>
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={styles.paymentMethodCard}
                      onPress={() => handlePaymentMethodSelect(method.id)}
                    >
                      <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                        <IconComponent size={24} color={method.color} />
                      </View>
                      <View style={styles.methodDetails}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                      </View>
                      <ArrowRight size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              // Payment Form
              <View>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedPaymentMethod('')}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                  {selectedPaymentMethod === 'bank' && 'Bank Transfer'}
                  {selectedPaymentMethod === 'mobile' && 'Mobile Money'}
                  {selectedPaymentMethod === 'cash' && 'Cash Deposit'}
                </Text>

                {/* Amount Input - Common for all methods */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholderTextColor="#BDC3C7"
                  />
                  <Text style={styles.currencyLabel}>ZAR</Text>
                </View>

                {/* Bank Transfer Form */}
                {selectedPaymentMethod === 'bank' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select Bank</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                        {banks.map((bank) => (
                          <TouchableOpacity
                            key={bank}
                            style={[
                              styles.optionChip,
                              bankName === bank && styles.selectedOptionChip
                            ]}
                            onPress={() => setBankName(bank)}
                          >
                            <Text style={[
                              styles.optionText,
                              bankName === bank && styles.selectedOptionText
                            ]}>
                              {bank}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Account Number</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your account number"
                        value={bankAccount}
                        onChangeText={setBankAccount}
                        keyboardType="numeric"
                        placeholderTextColor="#BDC3C7"
                      />
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        🏦 Funds will be transferred instantly. Processing time: 2-3 minutes.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Mobile Money Form */}
                {selectedPaymentMethod === 'mobile' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select Provider</Text>
                      <View style={styles.providersGrid}>
                        {mobileProviders.map((provider) => (
                          <TouchableOpacity
                            key={provider.id}
                            style={[
                              styles.providerCard,
                              mobileProvider === provider.id && styles.selectedProviderCard
                            ]}
                            onPress={() => setMobileProvider(provider.id)}
                          >
                            <View 
                              style={[styles.providerDot, { backgroundColor: provider.color }]} 
                            />
                            <Text style={[
                              styles.providerText,
                              mobileProvider === provider.id && styles.selectedProviderText
                            ]}>
                              {provider.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        keyboardType="phone-pad"
                        placeholderTextColor="#BDC3C7"
                      />
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        📱 You'll receive an SMS to authorize the payment. Standard rates apply.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Cash Deposit Form */}
                {selectedPaymentMethod === 'cash' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select Location</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                        {cashLocations.map((location) => (
                          <TouchableOpacity
                            key={location}
                            style={[
                              styles.optionChip,
                              selectedLocation === location && styles.selectedOptionChip
                            ]}
                            onPress={() => setSelectedLocation(location)}
                          >
                            <Text style={[
                              styles.optionText,
                              selectedLocation === location && styles.selectedOptionText
                            ]}>
                              {location}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        💰 Visit the selected location with cash and your reference number. Available 24/7.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Continue Button */}
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (!amount || 
                     (selectedPaymentMethod === 'bank' && (!bankName || !bankAccount)) ||
                     (selectedPaymentMethod === 'mobile' && (!mobileProvider || !mobileNumber)) ||
                     (selectedPaymentMethod === 'cash' && !selectedLocation)
                    ) && styles.disabledButton
                  ]}
                  onPress={processPayment}
                  disabled={
                    isProcessing ||
                    !amount || 
                    (selectedPaymentMethod === 'bank' && (!bankName || !bankAccount)) ||
                    (selectedPaymentMethod === 'mobile' && (!mobileProvider || !mobileNumber)) ||
                    (selectedPaymentMethod === 'cash' && !selectedLocation)
                  }
                >
                  <Text style={styles.continueButtonText}>
                    {isProcessing ? 'Processing...' : `Add R${amount || '0'}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeWithdrawModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.modalTitle}>Withdraw Money</Text>
            <TouchableOpacity onPress={closeWithdrawModal} style={styles.closeButton}>
              <X size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {!selectedWithdrawMethod ? (
              // Withdraw Method Selection
              <View>
                <Text style={styles.sectionTitle}>Choose Withdrawal Method</Text>
                {withdrawMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={styles.paymentMethodCard}
                      onPress={() => handleWithdrawMethodSelect(method.id)}
                    >
                      <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                        <IconComponent size={24} color={method.color} />
                      </View>
                      <View style={styles.methodDetails}>
                        <Text style={styles.methodTitle}>{method.title}</Text>
                        <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                      </View>
                      <ArrowRight size={20} color="#BDC3C7" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              // Withdraw Form
              <View>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedWithdrawMethod('')}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>
                  {selectedWithdrawMethod === 'atm' && 'ATM Withdrawal'}
                  {selectedWithdrawMethod === 'bank' && 'Bank Transfer'}
                  {selectedWithdrawMethod === 'pickup' && 'Cash Pickup'}
                </Text>

                {/* Available Balance */}
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceInfoLabel}>Available Balance</Text>
                  <Text style={styles.balanceInfoAmount}>R {balance.toFixed(2)}</Text>
                </View>

                {/* Amount Input - Common for all methods */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Withdrawal Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    keyboardType="numeric"
                    placeholderTextColor="#BDC3C7"
                  />
                  <Text style={styles.currencyLabel}>ZAR</Text>
                </View>

                {/* ATM Withdrawal Form */}
                {selectedWithdrawMethod === 'atm' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select ATM Location</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                        {atmLocations.map((location) => (
                          <TouchableOpacity
                            key={location}
                            style={[
                              styles.optionChip,
                              atmLocation === location && styles.selectedOptionChip
                            ]}
                            onPress={() => setAtmLocation(location)}
                          >
                            <Text style={[
                              styles.optionText,
                              atmLocation === location && styles.selectedOptionText
                            ]}>
                              {location}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        💳 You'll receive an SMS with a withdrawal code. Valid for 24 hours. Daily limit: R3,000.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Bank Transfer Form */}
                {selectedWithdrawMethod === 'bank' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select Bank</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                        {banks.map((bank) => (
                          <TouchableOpacity
                            key={bank}
                            style={[
                              styles.optionChip,
                              withdrawBankName === bank && styles.selectedOptionChip
                            ]}
                            onPress={() => setWithdrawBankName(bank)}
                          >
                            <Text style={[
                              styles.optionText,
                              withdrawBankName === bank && styles.selectedOptionText
                            ]}>
                              {bank}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Account Number</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your account number"
                        value={withdrawBankAccount}
                        onChangeText={setWithdrawBankAccount}
                        keyboardType="numeric"
                        placeholderTextColor="#BDC3C7"
                      />
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        🏦 Funds will be transferred within 2-24 hours. Small processing fee may apply.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Cash Pickup Form */}
                {selectedWithdrawMethod === 'pickup' && (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Select Pickup Location</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                        {pickupLocations.map((location) => (
                          <TouchableOpacity
                            key={location}
                            style={[
                              styles.optionChip,
                              pickupLocation === location && styles.selectedOptionChip
                            ]}
                            onPress={() => setPickupLocation(location)}
                          >
                            <Text style={[
                              styles.optionText,
                              pickupLocation === location && styles.selectedOptionText
                            ]}>
                              {location}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.infoBox}>
                      <Text style={styles.infoText}>
                        📍 Visit the selected location with your ID and reference number. Available for 30 days.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Continue Button */}
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (!withdrawAmount || 
                     (selectedWithdrawMethod === 'atm' && !atmLocation) ||
                     (selectedWithdrawMethod === 'bank' && (!withdrawBankName || !withdrawBankAccount)) ||
                     (selectedWithdrawMethod === 'pickup' && !pickupLocation)
                    ) && styles.disabledButton
                  ]}
                  onPress={processWithdrawal}
                  disabled={
                    isWithdrawProcessing ||
                    !withdrawAmount || 
                    (selectedWithdrawMethod === 'atm' && !atmLocation) ||
                    (selectedWithdrawMethod === 'bank' && (!withdrawBankName || !withdrawBankAccount)) ||
                    (selectedWithdrawMethod === 'pickup' && !pickupLocation)
                  }
                >
                  <Text style={styles.continueButtonText}>
                    {isWithdrawProcessing ? 'Processing...' : `Withdraw R${withdrawAmount || '0'}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#0C7C59',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  balanceCard: {
    backgroundColor: '#0C7C59',
    marginHorizontal: 20,
    marginTop: -10,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  rewardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F1C40F',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  transactionItem: {
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
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  interledgerStatus: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  networkIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  networkDot: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  networkText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#0C7C59',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4F8',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F4F8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  backButton: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#0C7C59',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0C7C59',
  },
  currencyLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 8,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8F4F8',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  optionsScroll: {
    marginTop: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8F4F8',
    marginRight: 8,
  },
  selectedOptionChip: {
    backgroundColor: '#0C7C59',
    borderColor: '#0C7C59',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8F4F8',
    backgroundColor: '#F8F9FA',
    gap: 8,
  },
  selectedProviderCard: {
    borderColor: '#0C7C59',
    backgroundColor: '#E8F5E8',
  },
  providerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  providerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
  },
  selectedProviderText: {
    color: '#0C7C59',
  },
  infoBox: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0C7C59',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#0C7C59',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: '#BDC3C7',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  balanceInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  balanceInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6C757D',
    marginBottom: 4,
  },
  balanceInfoAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
  },
});