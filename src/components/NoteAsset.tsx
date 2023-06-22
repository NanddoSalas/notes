import { Image } from 'expo-image';
import { useWindowDimensions } from 'react-native';
import { Asset } from '../types';

interface Props {
  asset: Asset;
  onPress: () => void;
}

export const NoteAsset: React.FC<Props> = ({ asset, onPress }) => {
  const { height, width } = useWindowDimensions();

  const imageHeight = (width / asset.width) * asset.height;

  return (
    <Image
      source={{ uri: asset.uri }}
      contentFit="contain"
      style={{ height: imageHeight }}
      onTouchEnd={onPress}
    />
  );
};
