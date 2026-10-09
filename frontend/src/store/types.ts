import type { StateCreator } from 'zustand';

import type { Item } from '@/types/item.types';

export interface Filter {
  min: number | null;
  max: number | null;
}

export interface ItemsSlice {
  items: Item[];
  itemsCursor: number;
  itemsHasMore: boolean;
  itemsFilter: Filter;
  itemsLoading: boolean;
  loadMoreItems: () => Promise<void>;
  reloadItems: () => Promise<void>;
  setItemsFilter: (f: Filter) => Promise<void>;
}

export interface SelectedSlice {
  selected: Item[];
  selectedCursor: number;
  selectedHasMore: boolean;
  selectedFilter: Filter;
  selectedLoading: boolean;
  loadMoreSelected: () => Promise<void>;
  setSelectedFilter: (f: Filter) => Promise<void>;
  reorder: (order: number[]) => Promise<void>;
}

export interface SyncSlice {
  select: (item: Item) => Promise<void>;
  deselect: (item: Item) => Promise<void>;
  addItem: (id: number) => Promise<void>;
  applyRemote: (added: Item[], removed: Item[]) => void;
  applyReorderRemote: (order: number[]) => void;
}

export type Store = ItemsSlice & SelectedSlice & SyncSlice;
export type SliceCreator<T> = StateCreator<Store, [], [], T>;
