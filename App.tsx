import { NavigationContainer } from '@react-navigation/native';
import { polyfillWebCrypto } from 'expo-standard-web-crypto';
import { Navigation } from './src/Navigation';

polyfillWebCrypto();

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
