export interface Asset {
  id: string;
  uri: string;
  width: number;
  height: number;
}

export interface Note {
  id: string;
  title: string;
  text: string;
  isSelected: boolean;
  createdAt: number;
  isPinned: boolean;
  updatedAt: number;
  assets: Asset[];
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
  Settings: undefined;
};

export type SortNotesBy = 'CREATION_DATE' | 'UPDATION_DATE';

export type NotesPresentation = 'LIST' | 'GRID';
