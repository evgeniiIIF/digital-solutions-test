import { toast } from 'sonner';

import { itemsService } from '@/services/items.service';
import { selectedService } from '@/services/selected.service';
import type { Item } from '@/types/item.types';
import { sortById } from '@/utils/items.utils';

import type { SliceCreator, SyncSlice } from '../types';

const removeByIds = (list: Item[], ids: Set<number>): Item[] =>
  list.filter((item) => !ids.has(item.id));

const addMissing = (list: Item[], toAdd: Item[]): Item[] => [
  ...list,
  ...toAdd.filter((item) => !list.some((existing) => existing.id === item.id)),
];

export const createSyncSlice: SliceCreator<SyncSlice> = (set, get) => ({
  select: async (item) => {
    const previousItems = get().items;
    const previousSelected = get().selected;

    set({
      items: removeByIds(previousItems, new Set([item.id])),
      selected: [...previousSelected, item],
    });

    try {
      await selectedService.select(item.id);
      toast.success(`Item ${item.id} выбран`);
    } catch {
      set({ items: previousItems, selected: previousSelected });
      toast.error(`Не удалось выбрать Item ${item.id}`);
    }
  },

  deselect: async (item) => {
    const previousItems = get().items;
    const previousSelected = get().selected;

    set({
      selected: removeByIds(previousSelected, new Set([item.id])),
      items: sortById([...previousItems, item]),
    });

    try {
      await selectedService.deselect(item.id);
      toast.success(`Item ${item.id} убран`);
    } catch {
      set({ items: previousItems, selected: previousSelected });
      toast.error(`Не удалось убрать Item ${item.id}`);
    }
  },

  addItem: async (id) => {
    try {
      await itemsService.addItem(id);
      toast.success(`Item ${id} добавлен (применится через 10 секунд)`);
    } catch {
      toast.error(`Не удалось добавить Item ${id}`);
    }
  },

  applyRemote: (added, removed) => {
    const addedIds = new Set(added.map((item) => item.id));
    const removedIds = new Set(removed.map((item) => item.id));

    const state = get();

    const items = sortById(addMissing(removeByIds(state.items, addedIds), removed));
    const selected = addMissing(removeByIds(state.selected, removedIds), added);

    set({ items, selected });
  },

  applyReorderRemote: (order) => {
    const selected = get().selected;
    const byId = new Map(selected.map((item) => [item.id, item]));

    const reordered = order
      .map((id) => byId.get(id))
      .filter((item): item is Item => item !== undefined);
    const remaining = selected.filter((item) => !order.includes(item.id));

    set({ selected: [...reordered, ...remaining] });
  },
});
