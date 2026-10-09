import { create } from 'zustand';

import { onEvent } from '@/api/events';
import type { Item } from '@/types/item.types';
import { createItemsSlice } from './slices/itemsSlice';
import { createSelectedSlice } from './slices/selectedSlice';
import { createSyncSlice } from './slices/syncSlice';
import type { Store } from './types';

export const useItemsStore = create<Store>()((...args) => ({
  ...createItemsSlice(...args),
  ...createSelectedSlice(...args),
  ...createSyncSlice(...args),
}));

useItemsStore.getState().loadMoreItems();
useItemsStore.getState().loadMoreSelected();

onEvent<{ added?: Item[]; removed?: Item[] }>('selected:changed', (data) => {
  useItemsStore.getState().applyRemote(data.added ?? [], data.removed ?? []);
});
onEvent<{ order?: number[] }>('selected:reordered', (data) => {
  if (data.order) useItemsStore.getState().applyReorderRemote(data.order);
});
onEvent('add:done', () => {
  useItemsStore.getState().reloadItems();
});
