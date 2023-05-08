import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from './screens/MainScreen';
import { NoteScreen } from './screens/NoteScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NativeStackParams } from './types';

const Stack = createNativeStackNavigator<NativeStackParams>();

export const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} />

      <Stack.Screen
        name="Note"
        component={NoteScreen}
        options={{ animation: 'fade_from_bottom' }}
      />

      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
