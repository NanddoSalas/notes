import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Card, Colors, Text, View } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';
import { Note } from '../types';

interface Props {
  note: Note;
  onPress: (noteId: string) => void;
  onLongPress: (noteId: string) => void;
}

const NoteItem: React.FC<Props> = ({ note, onPress, onLongPress }) => {
  const sortNotesBy = useStore((state) => state.sortNotesBy);
  const date =
    sortNotesBy === 'CREATION_DATE' ? note.createdAt : note.updatedAt;
  const dateString = new Date(date).toLocaleString();

  return (
    <Card
      key={note.id}
      style={{ marginBottom: 15 }}
      selected={note.isSelected}
      onPress={() => onPress(note.id)}
      onLongPress={() => onLongPress(note.id)}
    >
      <View padding-20>
        {note.title ? (
          <Text text40 $textDefault>
            {note.title}
          </Text>
        ) : note.text ? (
          <Text text40 $textDefault>
            {note.text.split('\n')[0]}
          </Text>
        ) : null}

        {note.title && note.text ? (
          <Text text70 $textDefault>
            {note.text.split('\n')[0]}
          </Text>
        ) : null}

        <Text text90 $textDefault>
          {dateString}
          {note.isPinned && (
            <MaterialCommunityIcons name="pin" color={Colors.$iconPrimary} />
          )}
        </Text>
      </View>
    </Card>
  );
};

export default React.memo(NoteItem);
