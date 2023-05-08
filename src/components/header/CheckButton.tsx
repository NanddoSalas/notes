import { MaterialIcons } from '@expo/vector-icons';
import { Button, Colors } from 'react-native-ui-lib';

interface Props {
  onPress: () => void;
}

export const CheckButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Button
      size={Button.sizes.medium}
      backgroundColor={Colors.red30}
      onPress={onPress}
      iconSource={() => <MaterialIcons name="check" size={24} color="black" />}
      link
    />
  );
};
