import { Image } from 'expo-image';
import { View } from 'react-native';
import { Asset } from '../types';

interface Props {
  asset: Asset;
  onPress: () => void;
}

export const AssetItem: React.FC<Props> = ({ asset, onPress }) => {
  const { id, width, height, uri } = asset;

  return (
    <View
      key={id}
      style={{
        flexBasis: 0,
        aspectRatio: width / height,
        flexGrow: width / height,
      }}
      onTouchEnd={onPress}
    >
      <Image
        source={{ uri }}
        style={{ flex: 1 }}
        // cachePolicy={'memory'}
        priority={'low'}
        contentFit="fill"
      />
    </View>
  );
};
