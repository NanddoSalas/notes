import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { ActionSheet, Button, TextField, View } from 'react-native-ui-lib';
import { NoteAsset } from '../components/NoteAsset';
import { useStore } from '../hooks/useStore';
import { Asset, NativeStackParams } from '../types';

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [actionSheetIndex, setActionSheetIndex] = useState(0);
  const [assetIndex, setAssetIndex] = useState(-1);

  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const getNote = useStore((state) => state.getNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);
  const addEmptyNote = useStore((state) => state.addEmptyNote);
  const addAssets = useStore((state) => state.addAssets);

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
        onPress={() => setActionSheetIndex(2)}
        iconSource={() => (
          <Octicons name="diff-added" size={24} color="black" />
        )}
        link
      />

      <Button
        style={{ marginLeft: 15 }}
        size={Button.sizes.large}
        onPress={() => setActionSheetIndex(1)}
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

  const handleTakePhoto = async () => {
    const { assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (assets) {
      const newAssets: Asset[] = assets.map((asset) => ({
        id: nanoid(10),
        uri: asset.uri,
        height: asset.height,
        width: asset.width,
      }));

      addAssets(id, newAssets);

      setAssets((current) => [...newAssets, ...current]);
    }
  };

  const handleAddImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (assets) {
      const newAssets: Asset[] = assets.map((asset) => ({
        id: nanoid(10),
        uri: asset.uri,
        height: asset.height,
        width: asset.width,
      }));

      addAssets(id, newAssets);

      setAssets((current) => [...newAssets, ...current]);
    }
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
      setAssets(note.assets);
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
    <ScrollView>
      {assets[0] && (
        <NoteAsset asset={assets[0]} onPress={() => setAssetIndex(0)} />
      )}

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
          numberOfLines={8}
          textAlignVertical="top"
        />

        <ActionSheet
          visible={actionSheetIndex}
          onDismiss={() => setActionSheetIndex(0)}
          options={
            actionSheetIndex === 1
              ? [
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
                ]
              : [
                  {
                    label: 'Take photo',
                    onPress: handleTakePhoto,
                  },
                  {
                    label: 'Add image',
                    onPress: handleAddImage,
                  },
                ]
          }
        />

        <ImageView
          images={assets}
          imageIndex={assetIndex}
          visible={assetIndex > -1}
          onRequestClose={() => setAssetIndex(-1)}
        />
      </View>
    </ScrollView>
  );
};
