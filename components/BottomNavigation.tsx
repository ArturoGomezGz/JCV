import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../constants/Colors';

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabPress
}) => {

  const handleTabPress = (tabName: string) => {
    if (onTabPress) {
      onTabPress(tabName);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        {/* Tab izquierda 1 */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="home-outline"
            size={26}
            color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Tab izquierda 2 */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('stats')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="bar-chart-outline"
            size={26}
            color={activeTab === 'stats' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Tab derecha 1 */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('chat')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={26}
            color={activeTab === 'chat' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Tab derecha 2 */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={26}
            color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    width: '90%',
    borderRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
});

export default BottomNavigation;
