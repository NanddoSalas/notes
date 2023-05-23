import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { Keyboard, Share } from 'react-native';
import { ActionSheet, Button, TextField, View } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';
import { NativeStackParams } from '../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Note'>;

export const NoteScreen: React.FC<Props> = ({
  route: {
    params: { noteId },
  },
  navigation,
}) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const addNote = useStore((state) => state.addNote);
  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const getNote = useStore((state) => state.getNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);

  const headerRight = () => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Button
        style={{ marginLeft: 15 }}
        size={Button.sizes.large}
        onPress={() => {
          setIsPinned((current) => !current);
          toggleNotePin(noteId);
        }}
        iconSource={() => (
          <MaterialCommunityIcons
            name={isPinned ? 'pin' : 'pin-outline'}
            size={24}
            color="black"
          />
        )}
        link
      />

      <Button
        style={{ marginLeft: 15 }}
        size={Button.sizes.large}
        onPress={() => setIsVisible(true)}
        iconSource={() => (
          <MaterialIcons name="more-vert" size={24} color="black" />
        )}
        link
      />
    </View>
  );

  const handleSave = () => {
    setIsModified(false);
    Keyboard.dismiss();
    if (id) {
      if (title || text) {
        if (isModified) {
          updateNote(id, title, text);
        }
      } else {
        deleteNote(id);
      }
    } else if (title || text) {
      const newId = nanoid(10);
      const newDate = Date.now();

      addNote({
        id: newId,
        isSelected: false,
        title,
        text,
        createdAt: newDate,
        isPinned: false,
        updatedAt: newDate,
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
    navigation.setOptions({
      headerRight,
    });
  }, [navigation, headerRight]);

  useEffect(() => {
    const note = getNote(noteId);

    if (note) {
      setId(note.id);
      setTitle(note.title);
      setText(note.text);
      setIsPinned(note.isPinned);
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

      <ActionSheet
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        options={[
          {
            label: 'Share',
            onPress: () => {
              Share.share({ message: text });
            },
          },
        ]}
      />
    </View>
  );
};
