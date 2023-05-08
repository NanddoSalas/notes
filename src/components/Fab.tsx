import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Button, View } from 'react-native-ui-lib';
import { NativeStackParams } from '../types';

export const Fab = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<NativeStackParams, 'Note'>>();

  return (
    <View
      width={64}
      height={64}
      style={{ position: 'absolute', zIndex: 5, bottom: 16, right: 16 }}
      reanimated
      // @ts-ignore
      entering={ZoomIn}
      exiting={ZoomOut}
    >
      <Button
        iconSource={() => (
          <MaterialIcons name="add" size={32} color={'white'} />
        )}
        onPress={() => navigation.push('Note', { noteId: '' })}
        round
      />
    </View>
  );
};
