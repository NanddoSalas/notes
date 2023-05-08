import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SequencedTransition,
} from 'react-native-reanimated';
import { ActionSheet, View } from 'react-native-ui-lib';
import { Fab } from '../components/Fab';
import { NoteItem } from '../components/NoteItem';
import { CloseButton } from '../components/header/CloseButton';
import { MoreVertButton } from '../components/header/MoreVertButton';
import { useNotes } from '../hooks/useNotes';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Main'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const store = useNotes();
  const isFocused = useIsFocused();
  const [isVisible, setIsVisible] = useState(false);

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

  const toggleActionSheet = () => setIsVisible((current) => !current);

  useEffect(() => {
    const selectedNotesCount = store.selectedNotes.length;

    if (selectedNotesCount === 1) {
      navigation.setOptions({
        headerTitle: '1 Selected Note',
        headerLeft: () => <CloseButton onPress={store.deselectNotes} />,
        headerRight: () => <MoreVertButton onPress={toggleActionSheet} />,
      });
    } else if (selectedNotesCount > 1) {
      navigation.setOptions({
        headerTitle: `${selectedNotesCount} Selected Notes`,
        headerLeft: () => <CloseButton onPress={store.deselectNotes} />,
        headerRight: () => <MoreVertButton onPress={toggleActionSheet} />,
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
      <Animated.ScrollView
        contentContainerStyle={{
          padding: 15,
          flexGrow: 1,
        }}
        layout={Layout}
        style={{}}
      >
        {store.notes
          .filter(({ isPinned }) => isPinned)
          .map((note) => (
            <Animated.View
              key={note.id}
              entering={FadeIn}
              exiting={FadeOut}
              layout={SequencedTransition}
              style={{ zIndex: 5 }}
            >
              <NoteItem
                note={note}
                onPress={handlePress}
                onLongPress={handleLongPress}
              />
            </Animated.View>
          ))}
        {store.notes
          .filter(({ isPinned }) => !isPinned)
          .map((note) => (
            <Animated.View
              key={note.id}
              entering={FadeIn}
              exiting={FadeOut}
              layout={SequencedTransition}
              style={{ zIndex: 5 }}
            >
              <NoteItem
                note={note}
                onPress={handlePress}
                onLongPress={handleLongPress}
              />
            </Animated.View>
          ))}
      </Animated.ScrollView>

      {isFocused && store.selectedNotes.length === 0 ? <Fab /> : null}

      <ActionSheet
        visible={isVisible}
        onDismiss={toggleActionSheet}
        options={[
          { label: 'Pin', onPress: store.pinNotes },
          { label: 'Unpin', onPress: store.unpinNotes },
          { label: 'Delete', onPress: store.deleteSelectedNotes },
        ]}
      />
    </View>
  );
};
