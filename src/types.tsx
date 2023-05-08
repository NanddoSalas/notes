export interface Note {
  id: string;
  title: string;
  text: string;
  isSelected: boolean;
  createdAt: number;
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
};
