import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="acolhimento" options={{ title: 'Acolhimento' }} />
          <Stack.Screen name="respiracao" options={{ title: 'Respiração guiada' }} />
          <Stack.Screen name="aterramento" options={{ title: 'Técnica 5-4-3-2-1' }} />
          <Stack.Screen name="checkin" options={{ title: 'Como estou me sentindo' }} />
          <Stack.Screen name="diario" options={{ title: 'Meu diário' }} />
          <Stack.Screen name="apoio" options={{ title: 'Rede de apoio' }} />
          <Stack.Screen name="configuracoes" options={{ title: 'Preferências' }} />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
