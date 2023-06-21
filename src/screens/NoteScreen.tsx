import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Share, Text } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
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
  const [images, setImages] = useState<string[]>([]);
  const [actionSheetIndex, setActionSheetIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(-1);

  const updateNote = useStore((state) => state.updateNote);
  const deleteNote = useStore((state) => state.deleteNote);
  const getNote = useStore((state) => state.getNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);
  const addEmptyNote = useStore((state) => state.addEmptyNote);
  const addImages = useStore((state) => state.addImages);

  const imagesUris: ImageSource[] = images.map((id) => ({
    uri: FileSystem.documentDirectory + id,
  }));

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
      const uris = assets.map((asset) => asset.uri);
      addImages(id, uris);

      const ids: string[] = [];
      uris.map((uri) => {
        const cut = uri.lastIndexOf('/');
        const id = uri.substring(cut + 1);
        ids.push(id);
      });

      setImages((current) => [...ids, ...current]);
    }
  };

  const handleAddImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (assets) {
      const uris = assets.map((asset) => asset.uri);
      addImages(id, uris);

      const ids: string[] = [];
      uris.map((uri) => {
        const cut = uri.lastIndexOf('/');
        const id = uri.substring(cut + 1);
        ids.push(id);
      });

      setImages((current) => [...ids, ...current]);
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
      setImages(note.images);
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
    <View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        {imagesUris.map((source, index) => (
          <Image
            key={index}
            source={source}
            contentFit="contain"
            style={{ minWidth: 100, minHeight: 100 }}
            onTouchEnd={() => setImageIndex(index)}
          />
        ))}
      </View>

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

        {images.map((x, i) => (
          <Text key={i}>{x}</Text>
        ))}

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
          images={imagesUris}
          imageIndex={imageIndex}
          visible={imageIndex > -1}
          onRequestClose={() => setImageIndex(-1)}
        />
      </View>
    </View>
  );
};
