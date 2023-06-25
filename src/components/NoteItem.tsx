import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Card, Text, View } from 'react-native-ui-lib';
import { Note } from '../types';

interface Props {
  note: Note;
  onPress: (noteId: string) => void;
  onLongPress: (noteId: string) => void;
}

const NoteItem: React.FC<Props> = ({ note, onPress, onLongPress }) => {
  const { height, width } = useWindowDimensions();
  const cardWidth = width - 30;
  const { title, text } = note;

  const imageHeight = useMemo(() => {
    const asset = note.assets[0];

    if (!asset) return -1;

    return (cardWidth / asset.width) * asset.height;
  }, [note]);

  return (
    <Card
      key={note.id}
      style={{ marginBottom: 15 }}
      selected={note.isSelected}
      onPress={() => onPress(note.id)}
      onLongPress={() => onLongPress(note.id)}
    >
      {note.assets[0] && (
        <Card.Section
          imageSource={{ uri: note.assets[0].uri }}
          imageStyle={{ height: imageHeight }}
        />
      )}

      {title || text ? (
        <View padding-20>
          {note.title && (
            <Text text40 $textDefault>
              {note.title}
            </Text>
          )}

          {note.text && (
            <Text text70 $textDefault>
              {note.text.split('\n')[0]}
            </Text>
          )}
        </View>
      ) : undefined}
    </Card>
  );
};

export default React.memo(NoteItem);
