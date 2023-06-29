import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ActionsSheet } from '../../components/ActionsSheet';
import { BaseHeader } from '../../components/BaseHeader';
import { HeaderIconButton } from '../../components/HeaderIconButton';
import { useStore } from '../../hooks/useStore';
import { NativeStackParams } from '../../types';

export const MainScreenHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const selectedNotesCount = useStore((state) => state.selectedNotesCount);
  const deselectNotes = useStore((state) => state.deselectNotes);
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Main'>>();

  const toggleActionSheet = () => setIsVisible((current) => !current);

  const handleSettingsPress = () => navigation.navigate('Settings');

  return (
    <>
      <BaseHeader>
        {selectedNotesCount > 0 ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <HeaderIconButton
              icon={<MaterialIcons name="close" size={24} color="black" />}
              label="Close"
              onPress={deselectNotes}
            />

            <Text style={{ fontSize: 20, fontWeight: '600' }}>
              {selectedNotesCount === 1
                ? '1 Selected Note'
                : `${selectedNotesCount} Selected Notes`}
            </Text>

            <HeaderIconButton
              icon={<MaterialIcons name="more-vert" size={24} color="black" />}
              label="More options"
              onPress={toggleActionSheet}
            />
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Notes</Text>

            <HeaderIconButton
              icon={<MaterialIcons name="settings" size={24} color="black" />}
              label="Settings"
              onPress={handleSettingsPress}
            />
          </View>
        )}
      </BaseHeader>

      <ActionsSheet visible={isVisible} onDismiss={toggleActionSheet} />
    </>
  );
};
