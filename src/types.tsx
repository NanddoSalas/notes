export interface Note {
  id: string;
  title: string;
  text: string;
  isSelected: boolean;
  createdAt: number;
  isPinned: boolean;
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
  Settings: undefined;
};
