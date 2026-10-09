import { itemsService } from '@/services/items.service';

import type { Filter, ItemsSlice, SliceCreator } from '../types';

export const createItemsSlice: SliceCreator<ItemsSlice> = (set, get) => ({
  items: [],
  itemsCursor: 0,
  itemsHasMore: true,
  itemsFilter: { min: null, max: null },
  itemsLoading: false,

  loadMoreItems: async () => {
    const state = get();
    if (!state.itemsHasMore || state.itemsLoading) return;
    set({ itemsLoading: true });
    try {
      const res = await itemsService.getItems({ ...state.itemsFilter, cursor: state.itemsCursor });
      set({
        items: [...get().items, ...res.items],
        itemsCursor: res.nextCursor ?? state.itemsCursor,
        itemsHasMore: res.nextCursor != null,
      });
    } finally {
      set({ itemsLoading: false });
    }
  },

  reloadItems: async () => {
    const state = get();
    const res = await itemsService.getItems({ ...state.itemsFilter, cursor: 0 });
    set({
      items: res.items,
      itemsCursor: res.nextCursor ?? 0,
      itemsHasMore: res.nextCursor != null,
    });
  },

  setItemsFilter: async (f: Filter) => {
    set({ itemsFilter: f, items: [], itemsCursor: 0, itemsHasMore: true });
    await get().loadMoreItems();
  },
});
