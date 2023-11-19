import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Text } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';
import { NativeStackParams } from '../types';
import NoteItem from './NoteItem';

export const NoteList = () => {
  const notes = useStore((state) => state.notes);
  const handleSelection = useStore((state) => state.handleSelection);
  const selectedNotesCount = useStore((state) => state.selectedNotesCount);
  const presentation = useStore((state) => state.notesPresentation);
  const NOTES = [
    ...notes.filter(({ isPinned }) => isPinned),
    ...notes.filter(({ isPinned }) => !isPinned),
  ];

  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Main'>>();

  const handlePress = (noteId: string) => {
    if (selectedNotesCount > 0) {
      handleSelection(noteId);
      Haptics.selectionAsync();
    } else {
      navigation.navigate('Note', { noteId });
    }
  };

  const handleLongPress = (noteId: string) => {
    handleSelection(noteId);
    Haptics.selectionAsync();
  };

  if (notes.length === 0)
    return (
      <Animated.View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        entering={FadeIn}
      >
        <MaterialCommunityIcons
          name="notebook-edit"
          size={72}
          color={Colors.$textPrimary}
          style={{ opacity: 0.5 }}
        />
        <Text text60 color="gray">
          No notes here yet
        </Text>
      </Animated.View>
    );

  return (
    <Animated.ScrollView
      contentContainerStyle={{
        padding: 15,
        flexGrow: 1,
        gap: 15,
        flexWrap: 'wrap',
        flexDirection: presentation === 'GRID' ? 'row' : 'column',
      }}
    >
      {NOTES.map((note) => (
        <NoteItem
          key={presentation + note.id}
          note={note}
          onPress={handlePress}
          onLongPress={handleLongPress}
        />
      ))}
    </Animated.ScrollView>
  );
};
