import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { polyfillWebCrypto } from 'expo-standard-web-crypto';
import { useEffect } from 'react';
import { Navigation } from './src/Navigation';
import { useNotes } from './src/hooks/useNotes';

polyfillWebCrypto();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const hasHydrated = useNotes((state) => state._hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
