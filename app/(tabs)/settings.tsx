import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { User, Shield, Bell, Globe, CircleHelp as HelpCircle, LogOut, CreditCard, Smartphone, Lock, Eye, FileText, Phone, Mail, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={20} color="#BDC3C7" />}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <SectionHeader title="Profile" />
          <SettingItem
            icon={<User size={20} color="#0C7C59" />}
            title="Personal Information"
            subtitle="Nomsa Khumalo • +27 12 345 6789"
            onPress={() => Alert.alert('Profile', 'Edit profile functionality')}
          />
          <SettingItem
            icon={<CreditCard size={20} color="#3498DB" />}
            title="Payment Methods"
            subtitle="Manage cards and bank accounts"
            onPress={() => Alert.alert('Payment Methods', 'Manage payment methods')}
          />
          <SettingItem
            icon={<Eye size={20} color="#9B59B6" />}
            title="Transaction History"
            subtitle="View all your transactions"
            onPress={() => Alert.alert('History', 'View transaction history')}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <SectionHeader title="Security & Privacy" />
          <SettingItem
            icon={<Lock size={20} color="#E74C3C" />}
            title="Change PIN"
            subtitle="Update your security PIN"
            onPress={() => Alert.alert('PIN', 'Change PIN functionality')}
          />
          <SettingItem
            icon={<Smartphone size={20} color="#F39C12" />}
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#E5E5E5', true: '#0C7C59' }}
                thumbColor={biometricEnabled ? '#FFFFFF' : '#BDC3C7'}
              />
            }
          />
          <SettingItem
            icon={<Shield size={20} color="#2ECC71" />}
            title="Privacy Settings"
            subtitle="Control data sharing and visibility"
            onPress={() => Alert.alert('Privacy', 'Privacy settings')}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" />
          <SettingItem
            icon={<Bell size={20} color="#F1C40F" />}
            title="Push Notifications"
            subtitle="Get notified about transactions"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5E5', true: '#0C7C59' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#BDC3C7'}
              />
            }
          />
          <SettingItem
            icon={<Mail size={20} color="#3498DB" />}
            title="Email Notifications"
            subtitle="Receive updates via email"
            onPress={() => Alert.alert('Email', 'Email notification settings')}
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <SectionHeader title="App Settings" />
          <SettingItem
            icon={<Globe size={20} color="#16A085" />}
            title="Language"
            subtitle="English (South Africa)"
            onPress={() => Alert.alert('Language', 'Language selection')}
          />
          <SettingItem
            icon={<Globe size={20} color="#8E44AD" />}
            title="Offline Mode"
            subtitle="Allow transactions without internet"
            rightElement={
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#E5E5E5', true: '#0C7C59' }}
                thumbColor={offlineMode ? '#FFFFFF' : '#BDC3C7'}
              />
            }
          />
          <SettingItem
            icon={<Globe size={20} color="#E67E22" />}
            title="Auto Sync"
            subtitle="Sync data when connected"
            rightElement={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: '#E5E5E5', true: '#0C7C59' }}
                thumbColor={autoSync ? '#FFFFFF' : '#BDC3C7'}
              />
            }
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <SectionHeader title="Support" />
          <SettingItem
            icon={<HelpCircle size={20} color="#3498DB" />}
            title="Help Center"
            subtitle="Get help and find answers"
            onPress={() => Alert.alert('Help', 'Help center functionality')}
          />
          <SettingItem
            icon={<Phone size={20} color="#27AE60" />}
            title="Contact Support"
            subtitle="Speak to our support team"
            onPress={() => Alert.alert('Support', 'Contact: +27 11 123 4567')}
          />
          <SettingItem
            icon={<FileText size={20} color="#7F8C8D" />}
            title="Terms & Privacy Policy"
            subtitle="Read our terms and privacy policy"
            onPress={() => Alert.alert('Legal', 'Terms and privacy policy')}
          />
        </View>

        {/* Interledger Information */}
        <View style={styles.interledgerSection}>
          <Text style={styles.interledgerTitle}>🌐 Interledger Network</Text>
          <Text style={styles.interledgerDescription}>
            Your payments are secured and optimized through the Interledger Protocol:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• End-to-end encryption for all transactions</Text>
            <Text style={styles.featureItem}>• Automatic routing for lowest fees</Text>
            <Text style={styles.featureItem}>• Real-time settlement across networks</Text>
            <Text style={styles.featureItem}>• Cross-currency support</Text>
            <Text style={styles.featureItem}>• Offline transaction capability</Text>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>SA Payment Solution</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <Text style={styles.appInfoDescription}>
            Bridging the digital-cash divide in South Africa
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
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
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 20,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2C3E50',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginTop: 2,
  },
  interledgerSection: {
    backgroundColor: '#E8F4FD',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  interledgerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2980B9',
    marginBottom: 8,
  },
  interledgerDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2980B9',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureList: {
    gap: 4,
  },
  featureItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2980B9',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0C7C59',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  appInfoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2C3E50',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E74C3C',
  },
});