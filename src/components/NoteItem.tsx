import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';
import { Note } from '../types';

interface Props {
  note: Note;
  onPress: (noteId: string) => void;
  onLongPress: (noteId: string) => void;
}

const NoteItem: React.FC<Props> = ({ note, onPress, onLongPress }) => {
  const { height, width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const discardEmptyNote = useStore((state) => state.discardEmptyNote);
  const cardWidth = width - 30;
  const { id, title, text, assets, isSelected } = note;

  const imageHeight = useMemo(() => {
    const asset = note.assets[0];

    if (!asset) return -1;

    return (cardWidth / asset.width) * asset.height;
  }, [note]);

  useEffect(() => {
    if (!title && !text) {
      if (assets.length === 0 && isFocused) {
        discardEmptyNote(note.id);
      }
    }
  }, [note, isFocused]);

  if (!title && !text && assets.length === 0) return <View />;

  return (
    <Card
      key={id}
      style={{ marginBottom: 15 }}
      selected={isSelected}
      onPress={() => onPress(id)}
      onLongPress={() => onLongPress(id)}
    >
      {assets[0] && (
        <Card.Section
          imageSource={{ uri: assets[0].uri }}
          imageStyle={{ height: imageHeight }}
        />
      )}

      {title || text ? (
        <View style={{ padding: 20 }}>
          {title && (
            <Text text40 $textDefault>
              {title}
            </Text>
          )}

          {text &&
            text.split('\n').map((row, index, rows) => {
              if (index > 9) return undefined;

              if (index === 9 && rows.length > 9) {
                return <Text key={index}>{row}...</Text>;
              }

              return <Text key={index}>{row}</Text>;
            })}
        </View>
      ) : undefined}
    </Card>
  );
};

export default React.memo(NoteItem);
