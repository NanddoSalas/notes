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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
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
          ) : (
            <Text text40 style={{ color: 'gray' }}>
              Empty Note
            </Text>
          )}

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

        {note.assets[0] && (
          <Card.Section
            imageSource={{ uri: note.assets[0].uri }}
            imageStyle={{ width: 128, flex: 1 }}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
        )}
      </View>
    </Card>
  );
};

export default React.memo(NoteItem);
