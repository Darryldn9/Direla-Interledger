import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { TrendingUp, Shield, Clock, Users, DollarSign, Award, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ArrowRight } from 'lucide-react-native';

interface LoanOffer {
  id: string;
  amount: number;
  interestRate: number;
  term: string;
  monthlyPayment: number;
  lender: string;
  rating: number;
}

interface LendingOpportunity {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: string;
  creditScore: number;
  risk: 'Low' | 'Medium' | 'High';
}

export default function LendingScreen() {
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend'>('borrow');
  const [loanAmount, setLoanAmount] = useState('');
  const [creditScore] = useState(742); // Based on transaction history

  const loanOffers: LoanOffer[] = [
    {
      id: '1',
      amount: 5000,
      interestRate: 12.5,
      term: '12 months',
      monthlyPayment: 447.92,
      lender: 'Community Bank',
      rating: 4.8,
    },
    {
      id: '2',
      amount: 5000,
      interestRate: 14.2,
      term: '12 months',
      monthlyPayment: 455.83,
      lender: 'Peer Lender Group',
      rating: 4.6,
    },
    {
      id: '3',
      amount: 5000,
      interestRate: 16.8,
      term: '12 months',
      monthlyPayment: 469.25,
      lender: 'Quick Cash SA',
      rating: 4.2,
    },
  ];

  const lendingOpportunities: LendingOpportunity[] = [
    {
      id: '1',
      borrower: 'Small Business Owner',
      amount: 2500,
      purpose: 'Stock for spaza shop',
      interestRate: 15.0,
      term: '6 months',
      creditScore: 680,
      risk: 'Low',
    },
    {
      id: '2',
      borrower: 'Taxi Driver',
      amount: 8000,
      purpose: 'Vehicle repairs',
      interestRate: 18.5,
      term: '12 months',
      creditScore: 620,
      risk: 'Medium',
    },
    {
      id: '3',
      borrower: 'Market Vendor',
      amount: 1200,
      purpose: 'Equipment purchase',
      interestRate: 12.8,
      term: '4 months',
      creditScore: 725,
      risk: 'Low',
    },
  ];

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return '#0C7C59';
    if (score >= 600) return '#F1C40F';
    return '#E74C3C';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#0C7C59';
      case 'Medium': return '#F1C40F';
      case 'High': return '#E74C3C';
      default: return '#7F8C8D';
    }
  };

  const handleLoanApplication = () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid loan amount');
      return;
    }

    Alert.alert(
      'Loan Application',
      `Application for R${loanAmount} submitted. Your credit score of ${creditScore} qualifies you for competitive rates. You'll receive offers within 24 hours.`,
      [{ text: 'OK', onPress: () => setLoanAmount('') }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lending Hub</Text>
          <Text style={styles.headerSubtitle}>Powered by community trust</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'borrow' && styles.activeTab]}
            onPress={() => setActiveTab('borrow')}
          >
            <Text style={[styles.tabText, activeTab === 'borrow' && styles.activeTabText]}>
              Borrow Money
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'lend' && styles.activeTab]}
            onPress={() => setActiveTab('lend')}
          >
            <Text style={[styles.tabText, activeTab === 'lend' && styles.activeTabText]}>
              Lend Money
            </Text>
          </TouchableOpacity>
        </View>

        {/* Credit Score Card */}
        <View style={styles.creditScoreCard}>
          <View style={styles.creditScoreHeader}>
            <View>
              <Text style={styles.creditScoreLabel}>Your Credit Score</Text>
              <Text style={[styles.creditScoreValue, { color: getCreditScoreColor(creditScore) }]}>
                {creditScore}
              </Text>
            </View>
            <View style={styles.creditScoreIcon}>
              <TrendingUp size={24} color={getCreditScoreColor(creditScore)} />
            </View>
          </View>
          <Text style={styles.creditScoreDescription}>
            Based on your transaction history and payment behavior
          </Text>
          <View style={styles.creditFactors}>
            <View style={styles.factorItem}>
              <CheckCircle size={16} color="#0C7C59" />
              <Text style={styles.factorText}>Regular payments</Text>
            </View>
            <View style={styles.factorItem}>
              <CheckCircle size={16} color="#0C7C59" />
              <Text style={styles.factorText}>Good spending habits</Text>
            </View>
            <View style={styles.factorItem}>
              <Clock size={16} color="#F1C40F" />
              <Text style={styles.factorText}>Account age: 2 years</Text>
            </View>
          </View>
        </View>

        {activeTab === 'borrow' ? (
          <>
            {/* Loan Application */}
            <View style={styles.applicationContainer}>
              <Text style={styles.sectionTitle}>Apply for a Loan</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.amountLabel}>How much do you need?</Text>
                <View style={styles.amountInput}>
                  <Text style={styles.currencySymbol}>R</Text>
                  <TextInput
                    style={styles.input}
                    value={loanAmount}
                    onChangeText={setLoanAmount}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#BDC3C7"
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.applyButton} onPress={handleLoanApplication}>
                <Text style={styles.applyButtonText}>Get Loan Offers</Text>
              </TouchableOpacity>
            </View>

            {/* Loan Offers */}
            <View style={styles.offersContainer}>
              <Text style={styles.sectionTitle}>Available Loan Offers</Text>
              {loanOffers.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerAmount}>R {offer.amount.toLocaleString()}</Text>
                    <View style={styles.lenderInfo}>
                      <Text style={styles.lenderName}>{offer.lender}</Text>
                      <Text style={styles.lenderRating}>⭐ {offer.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.offerDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Interest Rate</Text>
                      <Text style={styles.detailValue}>{offer.interestRate}% p.a.</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Term</Text>
                      <Text style={styles.detailValue}>{offer.term}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Monthly Payment</Text>
                      <Text style={styles.detailValue}>R {offer.monthlyPayment.toFixed(2)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.selectOfferButton}>
                    <Text style={styles.selectOfferText}>Select This Offer</Text>
                    <ArrowRight size={16} color="#0C7C59" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Lending Stats */}
            <View style={styles.lendingStats}>
              <View style={styles.statCard}>
                <DollarSign size={24} color="#0C7C59" />
                <Text style={styles.statValue}>R 12,450</Text>
                <Text style={styles.statLabel}>Currently Lent</Text>
              </View>
              <View style={styles.statCard}>
                <Award size={24} color="#F1C40F" />
                <Text style={styles.statValue}>15.2%</Text>
                <Text style={styles.statLabel}>Avg Return</Text>
              </View>
              <View style={styles.statCard}>
                <Shield size={24} color="#3498DB" />
                <Text style={styles.statValue}>98.5%</Text>
                <Text style={styles.statLabel}>Repayment Rate</Text>
              </View>
            </View>

            {/* Lending Opportunities */}
            <View style={styles.opportunitiesContainer}>
              <Text style={styles.sectionTitle}>Lending Opportunities</Text>
              {lendingOpportunities.map((opportunity) => (
                <View key={opportunity.id} style={styles.opportunityCard}>
                  <View style={styles.opportunityHeader}>
                    <View>
                      <Text style={styles.borrowerType}>{opportunity.borrower}</Text>
                      <Text style={styles.loanPurpose}>{opportunity.purpose}</Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: getRiskColor(opportunity.risk) + '20' }]}>
                      <Text style={[styles.riskText, { color: getRiskColor(opportunity.risk) }]}>
                        {opportunity.risk} Risk
                      </Text>
                    </View>
                  </View>
                  <View style={styles.opportunityDetails}>
                    <Text style={styles.loanAmount}>R {opportunity.amount.toLocaleString()}</Text>
                    <Text style={styles.returnRate}>{opportunity.interestRate}% return</Text>
                  </View>
                  <View style={styles.creditInfo}>
                    <Text style={styles.creditLabel}>Credit Score: </Text>
                    <Text style={[styles.creditValue, { color: getCreditScoreColor(opportunity.creditScore) }]}>
                      {opportunity.creditScore}
                    </Text>
                    <Text style={styles.termInfo}> • {opportunity.term}</Text>
                  </View>
                  <TouchableOpacity style={styles.lendButton}>
                    <Text style={styles.lendButtonText}>Lend Money</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Risk Warning */}
            <View style={styles.riskWarning}>
              <AlertTriangle size={20} color="#E67E22" />
              <Text style={styles.warningText}>
                Lending involves risk. Only lend what you can afford to lose. All loans are facilitated through secure Interledger smart contracts.
              </Text>
            </View>
          </>
        )}
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
    paddingTop: 50,
    paddingBottom: 20,
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
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#0C7C59',
  },
  creditScoreCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  creditScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditScoreLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#7F8C8D',
  },
  creditScoreValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  creditScoreIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditScoreDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginBottom: 12,
  },
  creditFactors: {
    gap: 8,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  factorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2C3E50',
  },
  applicationContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  amountInputContainer: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  currencySymbol: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
    paddingVertical: 16,
  },
  applyButton: {
    backgroundColor: '#0C7C59',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  offersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
  },
  lenderInfo: {
    alignItems: 'flex-end',
  },
  lenderName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
  },
  lenderRating: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  offerDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
  },
  selectOfferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
  },
  selectOfferText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0C7C59',
  },
  lendingStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2C3E50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 4,
  },
  opportunitiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  opportunityCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  borrowerType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
  },
  loanPurpose: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  opportunityDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
  },
  returnRate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F1C40F',
  },
  creditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creditLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  creditValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  termInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
  },
  lendButton: {
    backgroundColor: '#0C7C59',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  lendButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  riskWarning: {
    flexDirection: 'row',
    backgroundColor: '#FDF2E9',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E67E22',
    lineHeight: 20,
  },
});