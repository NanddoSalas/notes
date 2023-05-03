import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Colors, View } from 'react-native-ui-lib';
import { Fab } from '../components/Fab';
import { NoteItem } from '../components/NoteItem';
import { useNotes } from '../hooks/useNotes';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Main'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const store = useNotes();
  const isFocused = useIsFocused();

  const handlePress = (noteId: string) => {
    if (store.selectedNotes.length > 0) {
      store.handleSelection(noteId);
      Haptics.selectionAsync();
    } else {
      navigation.navigate('Note', { noteId });
    }
  };

  const handleLongPress = (noteId: string) => {
    store.handleSelection(noteId);
    Haptics.selectionAsync();
  };

  useEffect(() => {
    const selectedNotesCount = store.selectedNotes.length;
    // const selectedNotesCount = 1;

    if (selectedNotesCount === 1) {
      navigation.setOptions({
        headerTitle: '1 Selected Note',
        headerLeft: () => (
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.red30}
            onPress={store.deselectNotes}
            iconSource={() => (
              <MaterialIcons name="close" size={24} color="black" />
            )}
            link
          />
        ),
        headerRight: () => (
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.red30}
            onPress={store.deleteSelectedNotes}
            iconSource={() => (
              <MaterialIcons name="delete" size={24} color="black" />
            )}
            link
          />
        ),
      });
    } else if (selectedNotesCount > 1) {
      navigation.setOptions({
        headerTitle: `${selectedNotesCount} Selected Notes`,
        headerLeft: () => (
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.red30}
            onPress={store.deselectNotes}
            iconSource={() => (
              <MaterialIcons name="close" size={24} color="black" />
            )}
            link
          />
        ),
        headerRight: () => (
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.red30}
            onPress={store.deleteSelectedNotes}
            iconSource={() => (
              <MaterialIcons name="delete" size={24} color="black" />
            )}
            link
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: '',
        headerTitleAlign: 'center',
        headerLeft: undefined,
        headerRight: undefined,
      });
    }
  }, [store]);

  return (
    <View flex>
      <FlatList
        data={store.notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem
            note={item}
            onPress={handlePress}
            onLongPress={handleLongPress}
          />
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      {isFocused && store.selectedNotes.length === 0 ? <Fab /> : null}
    </View>
  );
};
