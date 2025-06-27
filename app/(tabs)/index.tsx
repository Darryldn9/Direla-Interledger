import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
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
  const [showBalance, setShowBalance] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance] = useState(2847.50);
  const [rewardPoints] = useState(1250);

  const transactions: Transaction[] = [
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
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
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
        <View style={styles.header}>
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
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={24} color="#0C7C59" />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Minus size={24} color="#E67E22" />
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
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
          {transactions.map((transaction) => (
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
    backgroundColor: '#0C7C59',
    paddingTop: 50,
    paddingBottom: 20,
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
});