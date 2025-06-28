#!/bin/bash

# Direla Network Setup Helper
# This script helps configure your network IP addresses

echo "🔧 Direla Network Configuration Helper"
echo "======================================"

# Get the current IP address
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n1 | awk '{print $2}')

if [[ -z "$IP" ]]; then
    echo "❌ Could not automatically detect your IP address."
    echo "Please run: ifconfig | grep inet"
    echo "And manually update the IP in the files listed below."
    exit 1
fi

echo "📡 Detected IP address: $IP"
echo ""

# Check if files exist
PAY_FILE="app/(tabs)/pay.tsx"
QR_FILE="components/QRCodeGenerator.tsx"

if [[ ! -f "$PAY_FILE" ]]; then
    echo "❌ File not found: $PAY_FILE"
    echo "Make sure you're running this from the Direla project root."
    exit 1
fi

if [[ ! -f "$QR_FILE" ]]; then
    echo "❌ File not found: $QR_FILE"
    echo "Make sure you're running this from the Direla project root."
    exit 1
fi

# Find current IP in files
CURRENT_IP=$(grep -o "http://[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*:3001" "$PAY_FILE" | head -n1 | sed 's/http:\/\///' | sed 's/:3001//')

if [[ -z "$CURRENT_IP" ]]; then
    echo "❌ Could not find existing IP configuration in $PAY_FILE"
    echo "Please update manually."
    exit 1
fi

echo "🔍 Current IP in config: $CURRENT_IP"

if [[ "$IP" == "$CURRENT_IP" ]]; then
    echo "✅ IP address is already correct! No changes needed."
    echo "Your backend should be accessible at: http://$IP:3001"
    exit 0
fi

echo ""
echo "📝 Updating configuration files..."

# Backup original files
cp "$PAY_FILE" "$PAY_FILE.backup"
cp "$QR_FILE" "$QR_FILE.backup"

# Replace IP addresses
sed -i.tmp "s|http://$CURRENT_IP:3001|http://$IP:3001|g" "$PAY_FILE"
sed -i.tmp "s|http://$CURRENT_IP:3001|http://$IP:3001|g" "$QR_FILE"

# Clean up temporary files
rm "$PAY_FILE.tmp" "$QR_FILE.tmp" 2>/dev/null

echo "✅ Updated $PAY_FILE"
echo "✅ Updated $QR_FILE"
echo ""

# Verify changes
NEW_COUNT_PAY=$(grep -c "http://$IP:3001" "$PAY_FILE")
NEW_COUNT_QR=$(grep -c "http://$IP:3001" "$QR_FILE")

echo "📊 Configuration Summary:"
echo "   Pay file updates: $NEW_COUNT_PAY locations"
echo "   QR Generator updates: $NEW_COUNT_QR locations"
echo "   Backend URL: http://$IP:3001"
echo ""

echo "🚀 Next Steps:"
echo "1. Start the backend: cd backend && npm start"
echo "2. Start the frontend: npx expo start --clear"
echo "3. Test on your mobile device or simulator"
echo ""

echo "💡 Tip: Your mobile device must be on the same WiFi network!"
echo "📱 Backend will be accessible at: http://$IP:3001"
echo ""

echo "🔄 To revert changes, restore from backup files:"
echo "   mv $PAY_FILE.backup $PAY_FILE"
echo "   mv $QR_FILE.backup $QR_FILE" 