export interface Note {
  id: string;
  title: string;
  text: string;
  isSelected: boolean;
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
};
