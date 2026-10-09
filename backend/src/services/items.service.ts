import { ADD_BATCH_MS, PAGE_SIZE } from '../config/config';
import { db } from '../db/db';
import type { GetItemsFilterDto } from '../dto/get-items-filter.dto';
import type { ItemsPageDto } from '../dto/items-page.dto';
import { BatchQueue } from '../queues/batch.queue';
import { broadcast } from '../sse/events';
import type { Item } from '../types/item.types';

class ItemsService {
  private readonly queue = new BatchQueue<Item>(
    ADD_BATCH_MS,
    (item) => String(item.id),
    (items) => this.saveBatch(items),
  );

  getLeftPage(filter: GetItemsFilterDto): ItemsPageDto {
    const items: Item[] = [];
    const sources = [db.baseElements, db.addedElements];

    for (const source of sources) {
      for (const item of source) {
        if (item.id <= filter.cursor) continue;
        if (filter.min !== null && item.id < filter.min) continue;
        if (filter.max !== null && item.id > filter.max) return this.toPage(items);
        if (db.isSelected(item.id)) continue;
        items.push(item);
        if (items.length === PAGE_SIZE) return this.toPage(items);
      }
    }

    return this.toPage(items);
  }

  addItem(id: number): boolean {
    if (db.hasInPool(id)) return false;
    if (this.queue.has(String(id))) return false;
    this.queue.push({ id, title: `Item ${id}` });
    return true;
  }

  private toPage(items: Item[]): ItemsPageDto {
    const last = items[items.length - 1];
    const nextCursor = items.length === PAGE_SIZE && last ? last.id : null;
    return { items, nextCursor };
  }

  private saveBatch(items: Item[]): void {
    for (const item of items) {
      if (db.hasInPool(item.id)) continue;
      db.addToPool(item);
    }
    broadcast('add:done', { ids: items.map((item) => item.id) });
  }
}

export const itemsService = new ItemsService();
