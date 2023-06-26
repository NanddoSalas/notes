import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
}

export const BaseHeader: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: 'white',
      }}
    >
      <View
        style={{
          padding: 15,
          height: 60,
        }}
      >
        {children}
      </View>
    </View>
  );
};
