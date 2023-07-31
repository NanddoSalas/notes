import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseHeader } from '../../components/BaseHeader';
import { HeaderIconButton } from '../../components/HeaderIconButton';
import { useStore } from '../../hooks/useStore';
import { Asset, NativeStackParams } from '../../types';

interface Props {
  noteId: string;
  pinned: boolean;
  onNewAssets: (assets: Asset[]) => void;
}

export const NoteScreenHeader: React.FC<Props> = ({
  noteId,
  pinned,
  onNewAssets,
}) => {
  const [isPinned, setIsPinned] = useState(pinned);
  const deleteNote = useStore((state) => state.deleteNote);
  const addAssets = useStore((state) => state.addAssets);
  const shareNote = useStore((state) => state.shareNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Note'>>();

  const handleTakePhoto = async () => {
    const { assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (assets) {
      const newAssets: Asset[] = assets.map((asset) => ({
        id: nanoid(10),
        uri: asset.uri,
        height: asset.height,
        width: asset.width,
      }));

      addAssets(noteId, newAssets);

      onNewAssets(newAssets);
    }
  };

  const handleAddImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (assets) {
      const newAssets: Asset[] = assets.map((asset) => ({
        id: nanoid(10),
        uri: asset.uri,
        height: asset.height,
        width: asset.width,
      }));

      addAssets(noteId, newAssets);

      onNewAssets(newAssets);
    }
  };

  const handleBackPress = () => navigation.goBack();

  const handlePinPress = () => {
    setIsPinned((current) => !current);
    toggleNotePin(noteId);
  };

  const handleShareNote = () => {
    shareNote(noteId);
  };

  const handleDeleteNote = () => {
    deleteNote(noteId);
    navigation.goBack();
  };

  return (
    <>
      <BaseHeader>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <HeaderIconButton
            icon={<MaterialIcons name="arrow-back" size={24} color="black" />}
            label="Go back"
            onPress={handleBackPress}
          />

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <HeaderIconButton
              icon={
                <MaterialCommunityIcons
                  name={isPinned ? 'pin' : 'pin-outline'}
                  size={24}
                  color="black"
                />
              }
              label={isPinned ? 'Unpin' : 'Pin'}
              onPress={handlePinPress}
            />

            <View style={{ width: 15 }} />

            <HeaderIconButton
              icon={
                <MaterialIcons name="add-a-photo" size={24} color="black" />
              }
              label="Take photo"
              onPress={handleTakePhoto}
            />

            <View style={{ width: 15 }} />

            <HeaderIconButton
              icon={
                <MaterialIcons
                  name="add-photo-alternate"
                  size={24}
                  color="black"
                />
              }
              label="Add image"
              onPress={handleAddImage}
            />

            <View style={{ width: 15 }} />

            <HeaderIconButton
              icon={
                <MaterialCommunityIcons name="share" size={24} color="black" />
              }
              label="Share note"
              onPress={handleShareNote}
            />

            <View style={{ width: 15 }} />

            <HeaderIconButton
              icon={<MaterialIcons name="delete" size={24} color="black" />}
              label="Delete"
              onPress={handleDeleteNote}
            />
          </View>
        </View>
      </BaseHeader>
    </>
  );
};
