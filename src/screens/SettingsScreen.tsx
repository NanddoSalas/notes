import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';

export const SettingsScreen = () => {
  const sortNotesBy = useStore((state) => state.sortNotesBy);
  const toggleSortNotesBy = useStore((state) => state.toggleSortNotesBy);

  return (
    <View>
      <TouchableOpacity onPress={toggleSortNotesBy}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            margin: 15,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text text40 $textDefault>
            Sort Notes By
          </Text>

          <Text text70 $textDefault>
            {sortNotesBy === 'CREATION_DATE'
              ? 'Creation Date'
              : 'Updation Date'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
