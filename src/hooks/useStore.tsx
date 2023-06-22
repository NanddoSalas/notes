import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Asset, Note, SortNotesBy } from '../types';

type State = {
  _hasHydrated: boolean;
  notes: Note[];
  selectedNotesCount: number;
  sortNotesBy: SortNotesBy;
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
  toggleSortNotesBy: () => void;
  toggleNotePin: (noteId: string) => void;
  addAssets: (noteId: string, assets: Asset[]) => void;
  addEmptyNote: () => string;
};

const initialState: State = {
  _hasHydrated: false,
  notes: [],
  selectedNotesCount: 0,
  sortNotesBy: 'CREATION_DATE',
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
              return { ...item, title, text, updatedAt: Date.now() };
            }

            return item;
          }),
        })),

      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((item) => {
            if (item.id !== noteId) return true;

            item.assets.map((asset) => {
              FileSystem.deleteAsync(asset.uri, { idempotent: true });
            });

            return false;
          }),
        })),

      getNote: (noteId) => get().notes.find((item) => item.id === noteId),

      handleSelection: (noteId) =>
        set((state) => {
          const isSelected = state.notes.find(
            (note) => note.id === noteId && note.isSelected,
          );

          if (isSelected) {
            return {
              selectedNotesCount: state.selectedNotesCount - 1,
              notes: state.notes.map((note) =>
                note.id === noteId
                  ? { ...note, isSelected: !isSelected }
                  : note,
              ),
            };
          }

          return {
            selectedNotesCount: state.selectedNotesCount + 1,
            notes: state.notes.map((note) =>
              note.id === noteId ? { ...note, isSelected: !isSelected } : note,
            ),
          };
        }),

      deselectNotes: () =>
        set((state) => ({
          selectedNotesCount: 0,
          notes: state.notes.map((note) => ({ ...note, isSelected: false })),
        })),

      deleteSelectedNotes: () =>
        set((state) => ({
          selectedNotesCount: 0,
          notes: state.notes.filter((note) => !note.isSelected),
        })),

      pinNotes: () =>
        set((state) => ({
          selectedNotesCount: 0,
          notes: state.notes.map((note) =>
            note.isSelected
              ? { ...note, isSelected: false, isPinned: true }
              : note,
          ),
        })),

      unpinNotes: () =>
        set((state) => ({
          selectedNotesCount: 0,
          notes: state.notes.map((note) =>
            note.isSelected
              ? { ...note, isSelected: false, isPinned: false }
              : note,
          ),
        })),

      toggleSortNotesBy: () =>
        set((state) => {
          if (state.sortNotesBy === 'CREATION_DATE') {
            const notes = [...state.notes].sort(
              (a, b) => b.updatedAt - a.updatedAt,
            );

            return { sortNotesBy: 'UPDATION_DATE', notes };
          } else {
            const notes = [...state.notes].sort(
              (a, b) => b.createdAt - a.createdAt,
            );

            return { sortNotesBy: 'CREATION_DATE', notes };
          }
        }),

      toggleNotePin: (noteId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
          ),
        })),

      addAssets: (noteId, assets) => {
        const ids: string[] = [];

        assets.map((asset) => {
          const cut = asset.uri.lastIndexOf('/');
          const id = asset.uri.substring(cut + 1);
          ids.push(id);

          FileSystem.copyAsync({
            from: asset.uri,
            to: FileSystem.documentDirectory + id,
          });
        });

        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  assets: [
                    ...assets.map((asset, index) => ({
                      ...asset,
                      uri: FileSystem.documentDirectory + ids[index],
                    })),
                    ...note.assets,
                  ],
                }
              : note,
          ),
        }));
      },

      addEmptyNote: () => {
        const newNoteId = nanoid(10);
        const date = Date.now();

        const newNote: Note = {
          id: newNoteId,
          title: '',
          text: '',
          isPinned: false,
          isSelected: false,
          createdAt: date,
          updatedAt: date,
          assets: [],
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
        }));

        return newNoteId;
      },
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
