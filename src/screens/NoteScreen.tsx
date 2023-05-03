import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { Button, Colors, TextField, View } from 'react-native-ui-lib';
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
  const [isModified, setIsModified] = useState(false);

  const handleSave = () => {
    setIsModified(false);
    Keyboard.dismiss();
    if (id) {
      if (title || text) {
        store.updateNote(id, title, text);
      } else {
        store.deleteNote(id);
      }
    } else if (title || text) {
      const newId = nanoid(10);
      store.addNote({
        id: newId,
        createdAt: Date.now(),
        isSelected: false,
        title,
        text,
      });
      setId(newId);
    }
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
    setIsModified(true);
  };

  const handleChangeText = (value: string) => {
    setText(value);
    setIsModified(true);
  };

  useEffect(() => {
    if (isModified) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            size={Button.sizes.medium}
            backgroundColor={Colors.red30}
            onPress={handleSave}
            iconSource={() => (
              <MaterialIcons name="check" size={24} color="black" />
            )}
            link
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: undefined,
      });
    }
  }, [navigation, isModified, handleSave]);

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
        onChangeText={handleChangeTitle}
        text40
      />

      <TextField
        placeholder="Start typing"
        value={text}
        onChangeText={handleChangeText}
        text70
        multiline
      />
    </View>
  );
};
