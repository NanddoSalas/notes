import { create } from 'zustand';
import { Note } from '../types';

interface NotesStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (noteId: string, title: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  getNote: (noteId: string) => Note | undefined;
}

export const useNotes = create<NotesStore>((set, get) => ({
  notes: [],
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (noteId, title, text) =>
    set((state) => ({
      notes: state.notes.map((item) => {
        if (item.id === noteId) {
          return { ...item, title, text };
        }

        return item;
      }),
    })),
  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((item) => item.id !== noteId),
    })),
  getNote: (noteId) => get().notes.find((item) => item.id === noteId),
}));
