import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Fab } from '../../components/Fab';
import { NoteList } from '../../components/NoteList';
import { NativeStackParams } from '../../types';

type Props = NativeStackScreenProps<NativeStackParams, 'Main'>;

export const MainScreen: React.FC<Props> = ({}) => {
  return (
    <View>
      <NoteList />

      <Fab />
    </View>
  );
};
