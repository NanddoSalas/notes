import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native-ui-lib';
import { Fab } from '../components/Fab';
import { NoteItem } from '../components/NoteItem';
import { useNotes } from '../hooks/useNotes';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Main'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const store = useNotes();

  const handlePress = (noteId: string) => {
    navigation.navigate('Note', { noteId });
  };

  return (
    <View flex>
      <FlatList
        data={store.notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteItem note={item} onPress={handlePress} />
        )}
        contentContainerStyle={{ padding: 15 }}
      />

      <Fab />
    </View>
  );
};
