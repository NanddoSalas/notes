import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View } from 'react-native-ui-lib';
import { ActionsSheet } from '../components/ActionsSheet';
import { Fab } from '../components/Fab';
import { NoteList } from '../components/NoteList';

import { CloseButton } from '../components/header/CloseButton';
import { MoreVertButton } from '../components/header/MoreVertButton';
import { SettingsButton } from '../components/header/SettingsButton copy';
import { useStore } from '../hooks/useStore';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Main'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const selectedNotesCount = useStore((state) => state.selectedNotesCount);
  const deselectNotes = useStore((state) => state.deselectNotes);

  const toggleActionSheet = () => setIsVisible((current) => !current);

  useEffect(() => {
    if (selectedNotesCount === 1) {
      navigation.setOptions({
        headerTitle: '1 Selected Note',
        headerLeft: () => <CloseButton onPress={deselectNotes} />,
        headerRight: () => <MoreVertButton onPress={toggleActionSheet} />,
      });
    } else if (selectedNotesCount > 1) {
      navigation.setOptions({
        headerTitle: `${selectedNotesCount} Selected Notes`,
        headerLeft: () => <CloseButton onPress={deselectNotes} />,
        headerRight: () => <MoreVertButton onPress={toggleActionSheet} />,
      });
    } else {
      navigation.setOptions({
        headerTitle: '',
        headerTitleAlign: 'center',
        headerLeft: undefined,
        headerRight: () => (
          <SettingsButton onPress={() => navigation.navigate('Settings')} />
        ),
      });
    }
  }, [selectedNotesCount, deselectNotes]);

  return (
    <View flex>
      <NoteList />

      <Fab />

      <ActionsSheet visible={isVisible} onDismiss={toggleActionSheet} />
    </View>
  );
};
