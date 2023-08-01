import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { TextField } from 'react-native-ui-lib';
import { AssetGrid } from '../../components/AssetGrid';
import { useStore } from '../../hooks/useStore';
import { Asset, NativeStackParams } from '../../types';
import { ImageViewHeader } from './ImageViewHeader';
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
  const deleteAsset = useStore((state) => state.deleteAsset);

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeText = (value: string) => {
    setText(value);
  };

  const handleNewAssets = (assets: Asset[]) => {
    setAssets((current) => [...assets, ...current]);
  };

  const handleImageViewClose = () => setAssetIndex(-1);

  const handleAssetDelete = (index: number) => {
    setAssetIndex(-1);
    deleteAsset(noteId, assets[index].id);
    setAssets((current) =>
      current.filter((asset, i) => {
        if (i !== index) return true;

        return false;
      }),
    );
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
          <NoteScreenHeader
            noteId={note.id}
            pinned={note.isPinned}
            onNewAssets={handleNewAssets}
          />
        ),
      });
    } else {
      const newNoteId = addEmptyNote();

      setId(newNoteId);

      navigation.setOptions({
        header: () => (
          <NoteScreenHeader
            noteId={newNoteId}
            pinned={false}
            onNewAssets={handleNewAssets}
          />
        ),
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
      <AssetGrid assets={assets} onPress={(index) => setAssetIndex(index)} />

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
        onRequestClose={handleImageViewClose}
        HeaderComponent={({ imageIndex }) => (
          <ImageViewHeader
            imageIndex={imageIndex}
            onGoBack={handleImageViewClose}
            onDelete={handleAssetDelete}
          />
        )}
      />
    </ScrollView>
  );
};
