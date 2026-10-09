import { toast } from 'sonner';

import { selectedService } from '@/services/selected.service';
import type { Item } from '@/types/item.types';

import type { Filter, SelectedSlice, SliceCreator } from '../types';

const applyReorder = (fullList: Item[], order: number[]): Item[] => {
  const orderedItems = order
    .map((id) => fullList.find((item) => item.id === id))
    .filter((item): item is Item => item != null);

  if (orderedItems.length !== order.length) return fullList;

  const visibleIds = new Set(order);
  let cursor = 0;

  return fullList.map((item) => {
    if (!visibleIds.has(item.id)) return item;
    const next = orderedItems[cursor++];
    return next ?? item;
  });
};

export const createSelectedSlice: SliceCreator<SelectedSlice> = (set, get) => ({
  selected: [],
  selectedCursor: 0,
  selectedHasMore: true,
  selectedFilter: { min: null, max: null },
  selectedLoading: false,

  loadMoreSelected: async () => {
    const state = get();
    if (!state.selectedHasMore || state.selectedLoading) return;
    set({ selectedLoading: true });
    try {
      const page = await selectedService.getSelected({
        ...state.selectedFilter,
        cursor: state.selectedCursor,
      });
      set({
        selected: [...get().selected, ...page.items],
        selectedCursor: page.nextCursor ?? state.selectedCursor,
        selectedHasMore: page.nextCursor != null,
      });
    } finally {
      set({ selectedLoading: false });
    }
  },

  setSelectedFilter: async (filter: Filter) => {
    set({ selectedFilter: filter, selected: [], selectedCursor: 0, selectedHasMore: true });
    await get().loadMoreSelected();
  },

  reorder: async (order) => {
    const previous = get().selected;
    const next = applyReorder(previous, order);
    set({ selected: next });
    try {
      await selectedService.reorder(order);
      toast.success('Порядок сохранён');
    } catch {
      set({ selected: previous });
      toast.error('Не удалось сохранить порядок');
    }
  },
});
