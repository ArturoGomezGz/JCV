import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { colors } from '../constants/Colors';

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'chat',
  onTabPress
}) => {
  const handleTabPress = (tabName: string) => {
    if (onTabPress) {
      onTabPress(tabName);
    }
  };

  const TabIcon: React.FC<{ 
    name: string; 
    isActive: boolean; 
    iconType: 'home' | 'clock' | 'chat' | 'share' | 'profile' 
  }> = ({ name, isActive, iconType }) => {
    const getIconSymbol = () => {
      switch (iconType) {
        case 'home':
          return '🏠';
        case 'clock':
          return '🕐';
        case 'chat':
          return '💬';
        case 'share':
          return '📤';
        case 'profile':
          return '👤';
        default:
          return '●';
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isActive && styles.activeTabButton
        ]}
        onPress={() => handleTabPress(name)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Text style={[
            styles.iconText,
            { color: isActive ? colors.surface : colors.textSecondary }
          ]}>
            {getIconSymbol()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        <TabIcon 
          name="home" 
          iconType="home" 
          isActive={activeTab === 'home'} 
        />
        <TabIcon 
          name="recent" 
          iconType="clock" 
          isActive={activeTab === 'recent'} 
        />
        <TabIcon 
          name="chat" 
          iconType="chat" 
          isActive={activeTab === 'chat'} 
        />
        <TabIcon 
          name="share" 
          iconType="share" 
          isActive={activeTab === 'share'} 
        />
        <TabIcon 
          name="profile" 
          iconType="profile" 
          isActive={activeTab === 'profile'} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0, // Safe area for iOS
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default BottomNavigation;