import {
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActionSheet } from 'react-native-ui-lib';
import { BaseHeader } from '../../components/BaseHeader';
import { useStore } from '../../hooks/useStore';
import { Asset, NativeStackParams } from '../../types';

interface Props {
  noteId: string;
  pinned: boolean;
}

export const NoteScreenHeader: React.FC<Props> = ({ noteId, pinned }) => {
  const [actionSheetIndex, setActionSheetIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(pinned);
  const deleteNote = useStore((state) => state.deleteNote);
  const addAssets = useStore((state) => state.addAssets);
  const shareNote = useStore((state) => state.shareNote);
  const toggleNotePin = useStore((state) => state.toggleNotePin);
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Note'>>();

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

      addAssets(noteId, newAssets);

      // setAssets((current) => [...newAssets, ...current]);
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

      addAssets(noteId, newAssets);

      // setAssets((current) => [...newAssets, ...current]);
    }
  };

  const handleBackPress = () => navigation.goBack();

  const handlePinPress = () => {
    setIsPinned((current) => !current);
    toggleNotePin(noteId);
  };

  const handleAddBoxPress = () => setActionSheetIndex(2);

  const handleMorePress = () => setActionSheetIndex(1);

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
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="black"
            onPress={handleBackPress}
          />

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <MaterialCommunityIcons
              name={isPinned ? 'pin' : 'pin-outline'}
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={handlePinPress}
            />

            <Octicons
              name="diff-added"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={handleAddBoxPress}
            />

            <MaterialIcons
              name="more-vert"
              size={24}
              color="black"
              style={{ marginLeft: 15 }}
              onPress={handleMorePress}
            />
          </View>
        </View>
      </BaseHeader>

      <ActionSheet
        visible={actionSheetIndex}
        onDismiss={() => setActionSheetIndex(0)}
        options={
          actionSheetIndex === 1
            ? [
                {
                  label: 'Share',
                  onPress: () => {
                    shareNote(noteId);
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
    </>
  );
};
