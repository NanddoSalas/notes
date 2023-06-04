import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
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
  const [id, setId] = useState(noteId);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const getNote = useStore((state) => state.getNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);
  const addEmptyNote = useStore((state) => state.addEmptyNote);

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

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeText = (value: string) => {
    setText(value);
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
    } else {
      const newNoteId = addEmptyNote();

      setId(newNoteId);
    }
  }, []);

  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      updateNote(id, title, text);

      return;
    });
  }, [navigation, id, title, text]);

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
          {
            label: 'Delete',
            onPress: () => {
              deleteNote(noteId);
              navigation.goBack();
            },
          },
        ]}
      />
    </View>
  );
};
