import { Image } from 'expo-image';
import { View } from 'react-native';
import { Asset } from '../types';

function sliceIntoChunks(arr: any[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

interface Props {
  assets: Asset[];
  onPress: (index: number) => void;
}

export const AssetsGrid: React.FC<Props> = ({ assets, onPress }) => {
  const rows: Array<Asset[]> = sliceIntoChunks(assets, 3);

  return (
    <View style={{ display: 'flex', gap: 5 }}>
      {rows.map((assets, rowIndex) =>
        assets.length === 1 ? (
          <Image
            key={assets[0].id}
            style={{
              flexBasis: 0,
              aspectRatio: assets[0].width / assets[0].height,
              flexGrow: assets[0].width / assets[0].height,
            }}
            source={{ uri: assets[0].uri }}
            onTouchEnd={() => onPress(rowIndex * 3)}
          />
        ) : (
          <View
            style={{ display: 'flex', flexDirection: 'row', gap: 5 }}
            key={rowIndex}
          >
            {assets.map(({ id, width, height, uri }, columnIndex) => (
              <Image
                key={id}
                style={{
                  flexBasis: 0,
                  aspectRatio: width / height,
                  flexGrow: width / height,
                }}
                source={{ uri: uri }}
                onTouchEnd={() => onPress(rowIndex * 3 + columnIndex)}
              />
            ))}
          </View>
        ),
      )}
    </View>
  );
};
