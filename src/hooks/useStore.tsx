import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Note } from '../types';

type State = {
  _hasHydrated: boolean;
  notes: Note[];
  selectedNotes: string[];
};

type Actions = {
  setHasHydrated: (value: boolean) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, title: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  getNote: (noteId: string) => Note | undefined;
  handleSelection: (noteId: string) => void;
  deselectNotes: () => void;
  deleteSelectedNotes: () => void;
  pinNotes: () => void;
  unpinNotes: () => void;
};

const initialState: State = {
  _hasHydrated: false,
  notes: [],
  selectedNotes: [],
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasHydrated: (value) => {
        set({
          _hasHydrated: value,
        });
      },

      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),

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

      handleSelection: (noteId) =>
        set((state) => {
          const isSelected = state.selectedNotes.find(
            (item) => item === noteId,
          );

          if (isSelected) {
            return {
              ...state,
              selectedNotes: state.selectedNotes.filter(
                (item) => item !== noteId,
              ),
              notes: state.notes.map((note) =>
                note.id === noteId
                  ? { ...note, isSelected: !isSelected }
                  : note,
              ),
            };
          }

          return {
            ...state,
            selectedNotes: [...state.selectedNotes, noteId],
            notes: state.notes.map((note) =>
              note.id === noteId ? { ...note, isSelected: !isSelected } : note,
            ),
          };
        }),

      deselectNotes: () =>
        set((store) => ({
          ...store,
          selectedNotes: [],
          notes: store.notes.map((note) => ({ ...note, isSelected: false })),
        })),

      deleteSelectedNotes: () =>
        set((store) => ({
          ...store,
          selectedNotes: [],
          notes: store.notes.filter((note) => !note.isSelected),
        })),

      pinNotes: () =>
        set((store) => ({
          ...store,
          selectedNotes: [],
          notes: store.notes.map((note) =>
            note.isSelected
              ? { ...note, isSelected: false, isPinned: true }
              : note,
          ),
        })),

      unpinNotes: () =>
        set((store) => ({
          ...store,
          selectedNotes: [],
          notes: store.notes.map((note) =>
            note.isSelected
              ? { ...note, isSelected: false, isPinned: false }
              : note,
          ),
        })),
    }),

    {
      name: 'store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state!.setHasHydrated(true);
      },
    },
  ),
);