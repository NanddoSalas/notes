import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import Animated, { Layout, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Card, Colors } from 'react-native-ui-lib';
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

  const sortNotesBy = useStore((state) => state.sortNotesBy);
  const discardEmptyNote = useStore((state) => state.discardEmptyNote);
  const presentation = useStore((store) => store.notesPresentation);

  const date =
    sortNotesBy === 'CREATION_DATE' ? note.createdAt : note.updatedAt;
  const dateString = new Date(date).toLocaleTimeString();
  const { id, title, text, assets, isSelected } = note;

  useEffect(() => {
    if (!title && !text) {
      if (assets.length === 0 && isFocused) {
        discardEmptyNote(note.id);
      }
    }
  }, [note, isFocused]);

  if (!title && !text && assets.length === 0) return <View />;

  return (
    <Animated.View
      entering={ZoomIn.delay(500)}
      exiting={ZoomOut}
      layout={Layout.delay(100)}
      style={{
        zIndex: 5,
        width: presentation === 'GRID' ? (width - 45) / 2 : width - 30,
      }}
    >
      <Card
        selected={isSelected}
        onPress={() => onPress(id)}
        onLongPress={() => onLongPress(id)}
      >
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 26,
              color: title ? 'black' : 'gray',
            }}
            numberOfLines={1}
          >
            {title ? title : 'Title'}
          </Text>

          <Text numberOfLines={1}>
            {text
              ? text.split('\n')[0]
              : assets.length > 0
              ? 'image note'
              : 'empty note'}
          </Text>

          <Text style={{}}>
            {dateString}

            {note.isPinned && (
              <>
                {' '}
                <MaterialCommunityIcons
                  name="pin"
                  color={Colors.$iconPrimary}
                />
              </>
            )}

            {assets[0] && (
              <>
                {' '}
                <MaterialCommunityIcons
                  name="image"
                  color={Colors.$iconPrimary}
                />
              </>
            )}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

export default React.memo(NoteItem);
