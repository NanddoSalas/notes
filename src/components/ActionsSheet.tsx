import { ActionSheet } from 'react-native-ui-lib';
import { useStore } from '../hooks/useStore';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export const ActionsSheet: React.FC<Props> = ({ visible, onDismiss }) => {
  const pinNotes = useStore((state) => state.pinNotes);
  const unpinNotes = useStore((state) => state.unpinNotes);
  const deleteSelectedNotes = useStore((state) => state.deleteSelectedNotes);

  return (
    <ActionSheet
      visible={visible}
      onDismiss={onDismiss}
      options={[
        { label: 'Pin', onPress: pinNotes },
        { label: 'Unpin', onPress: unpinNotes },
        { label: 'Delete', onPress: deleteSelectedNotes },
      ]}
    />
  );
};
