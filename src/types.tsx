export interface Note {
  id: string;
  title: string;
  text: string;
  createdAt: number;
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
};
