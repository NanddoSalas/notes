import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { HeaderIconButton } from '../../components/HeaderIconButton';

interface Props {
  imageIndex: number;
  onGoBack: () => void;
  onDelete: (index: number) => void;
}

export const ImageViewHeader: React.FC<Props> = ({
  imageIndex,
  onGoBack,
  onDelete,
}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        elevation: 4,
      }}
    >
      <View
        style={{
          padding: 15,
          height: 60,
        }}
      >
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
            onPress={onGoBack}
          />

          <Text style={{ fontSize: 20, fontWeight: '600' }}>
            {imageIndex + 1}
          </Text>

          <HeaderIconButton
            icon={<MaterialIcons name="delete" size={24} color="black" />}
            label="Delete asset"
            onPress={() => onDelete(imageIndex)}
          />
        </View>
      </View>
    </View>
  );
};
