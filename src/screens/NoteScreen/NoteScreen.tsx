import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { TextField } from 'react-native-ui-lib';
import { AssetsGrid } from '../../components/AssetsGrid';
import { useStore } from '../../hooks/useStore';
import { Asset, NativeStackParams } from '../../types';
import { NoteScreenHeader } from './NoteScreenHeader';

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
  const [assetIndex, setAssetIndex] = useState(-1);
  const [assets, setAssets] = useState<Asset[]>([]);

  const updateNote = useStore((state) => state.updateNote);
  const getNote = useStore((state) => state.getNote);
  const addEmptyNote = useStore((state) => state.addEmptyNote);

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeText = (value: string) => {
    setText(value);
  };

  useEffect(() => {
    const note = getNote(noteId);

    if (note) {
      setId(note.id);
      setTitle(note.title);
      setText(note.text);
      setAssets(note.assets);

      navigation.setOptions({
        header: () => (
          <NoteScreenHeader noteId={note.id} pinned={note.isPinned} />
        ),
      });
    } else {
      const newNoteId = addEmptyNote();

      setId(newNoteId);

      navigation.setOptions({
        header: () => <NoteScreenHeader noteId={newNoteId} pinned={false} />,
      });
    }
  }, []);

  useEffect(() => {
    return navigation.addListener('beforeRemove', () => {
      updateNote(id, title, text);

      return;
    });
  }, [navigation, id, title, text]);

  return (
    <ScrollView>
      <AssetsGrid assets={assets} onPress={(index) => setAssetIndex(index)} />

      <View style={{ padding: 15 }}>
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
          numberOfLines={8}
          textAlignVertical="top"
        />
      </View>

      <ImageView
        images={assets}
        imageIndex={assetIndex}
        visible={assetIndex > -1}
        onRequestClose={() => setAssetIndex(-1)}
      />
    </ScrollView>
  );
};
