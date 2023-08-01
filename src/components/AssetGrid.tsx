import { View } from 'react-native';
import { Asset } from '../types';
import { AssetItem } from './AssetItem';

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

export const AssetGrid: React.FC<Props> = ({ assets, onPress }) => {
  const rows: Array<Asset[]> = sliceIntoChunks(assets, 3);

  return (
    <View style={{ display: 'flex', gap: 5 }}>
      {rows.map((assets, rowIndex) =>
        assets.length === 1 ? (
          <AssetItem
            key={assets[0].id}
            asset={assets[0]}
            onPress={() => onPress(rowIndex * 3)}
          />
        ) : (
          <View
            style={{ display: 'flex', flexDirection: 'row', gap: 5 }}
            key={rowIndex}
          >
            {assets.map((asset, columnIndex) => (
              <AssetItem
                key={asset.id}
                asset={asset}
                onPress={() => onPress(rowIndex * 3 + columnIndex)}
              />
            ))}
          </View>
        ),
      )}
    </View>
  );
};
