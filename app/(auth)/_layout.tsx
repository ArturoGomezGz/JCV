import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { FooterLogo, HeaderLogo } from '../../components';
import { colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
        {/* <HeaderLogo /> */}
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="create-account" />
        </Stack>
        {/* <FooterLogo /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }
});