import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Card, Colors, Text, View } from 'react-native-ui-lib';
import { Note } from '../types';

interface Props {
  note: Note;
  onPress: (noteId: string) => void;
  onLongPress: (noteId: string) => void;
}

const NoteItem: React.FC<Props> = ({ note, onPress, onLongPress }) => {
  const date = new Date(note.createdAt).toLocaleString();

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
          {date}
          {note.isPinned && (
            <MaterialCommunityIcons name="pin" color={Colors.$iconPrimary} />
          )}
        </Text>
      </View>
    </Card>
  );
};

export default React.memo(NoteItem);
