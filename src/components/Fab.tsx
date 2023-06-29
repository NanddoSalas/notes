import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable } from 'react-native';
import { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Colors, View } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';
import { NativeStackParams } from '../types';

export const Fab = () => {
  const isFocused = useIsFocused();
  const selectedNotesCount = useStore((state) => state.selectedNotesCount);
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Note'>>();

  if (!isFocused) return null;

  if (selectedNotesCount > 0) return null;

  return (
    <View
      width={64}
      height={64}
      style={{
        position: 'absolute',
        zIndex: 5,
        bottom: 16,
        right: 16,
        flexDirection: 'row-reverse',
      }}
      reanimated
      // @ts-ignore
      entering={ZoomIn}
      exiting={ZoomOut}
    >
      <Pressable
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: Colors.$backgroundPrimaryHeavy,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        android_ripple={{ borderless: true, radius: 32 }}
        onPress={() => navigation.push('Note', { noteId: '' })}
      >
        <MaterialIcons name="add" size={32} color={'white'} />
      </Pressable>
    </View>
  );
};
