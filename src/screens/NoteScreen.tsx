import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { TextField, View } from 'react-native-ui-lib';
import { useNotes } from '../hooks/useNotes';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Note'>;

export const NoteScreen: React.FC<Props> = ({
  route: {
    params: { noteId },
  },
  navigation,
}) => {
  const store = useNotes();
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSave = () => {
    if (id) {
      if (title || text) {
        store.updateNote(id, title, text);
      } else {
        store.deleteNote(id);
      }
    } else if (title || text) {
      store.addNote({
        id: nanoid(10),
        createdAt: Date.now(),
        title,
        text,
      });
    }
  };

  useEffect(() => {
    const note = store.getNote(noteId);

    if (note) {
      setId(note.id);
      setTitle(note.title);
      setText(note.text);
    }
  }, []);

  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      handleSave();

      return;
    });
  }, [navigation, handleSave]);

  return (
    <View padding-15>
      <TextField
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        text40
      />

      <TextField
        placeholder="Start typing"
        value={text}
        onChangeText={setText}
        text70
        multiline
      />
    </View>
  );
};
