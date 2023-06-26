import { Pressable, ToastAndroid } from 'react-native';

interface Props {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export const HeaderIconButton: React.FC<Props> = ({ icon, label, onPress }) => {
  const handleLongPress = () => {
    ToastAndroid.show(label, ToastAndroid.SHORT);
  };

  return (
    <Pressable
      style={{
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      android_ripple={{ borderless: true }}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      {icon}
    </Pressable>
  );
};
