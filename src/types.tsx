export interface Note {
  id: string;
  title: string;
  text: string;
  isSelected: boolean;
  createdAt: number;
  isPinned: boolean;
  updatedAt: number;
  images: string[];
}

export type NativeStackParams = {
  Main: undefined;
  Note: { noteId: string };
  Settings: undefined;
};

export type SortNotesBy = 'CREATION_DATE' | 'UPDATION_DATE';
