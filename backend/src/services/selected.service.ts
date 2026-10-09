import { PAGE_SIZE, WRITE_BATCH_MS } from '../config/config';
import { db } from '../db/db';
import type { GetItemsFilterDto } from '../dto/get-items-filter.dto';
import type { ItemsPageDto } from '../dto/items-page.dto';
import { BatchQueue } from '../queues/batch.queue';
import { broadcast } from '../sse/events';
import type { Item } from '../types/item.types';
import type { WriteOperation } from '../types/write-operation.types';

class SelectedService {
  private readonly queue = new BatchQueue<WriteOperation>(
    WRITE_BATCH_MS,
    (op) => `${op.id}:${op.type}`,
    (ops) => this.applyBatch(ops),
  );

  getRightPage(filter: GetItemsFilterDto): ItemsPageDto {
    const items: Item[] = [];

    for (const item of db.selectedElements) {
      if (filter.min !== null && item.id < filter.min) continue;
      if (filter.max !== null && item.id > filter.max) continue;
      items.push(item);
    }

    const page = items.slice(filter.cursor, filter.cursor + PAGE_SIZE);
    const nextCursor = page.length === PAGE_SIZE ? filter.cursor + PAGE_SIZE : null;
    return { items: page, nextCursor };
  }

  select(id: number): 'ok' | 'not-found' {
    if (!db.findById(id)) return 'not-found';
    if (db.isSelected(id)) return 'ok';
    this.queue.push({ id, type: 'select' });
    return 'ok';
  }

  deselect(id: number): 'ok' | 'not-found' {
    if (!db.findById(id)) return 'not-found';
    if (!db.isSelected(id)) return 'ok';
    this.queue.push({ id, type: 'deselect' });
    return 'ok';
  }

  reorder(order: number[]): boolean {
    const first = order[0];
    if (first === undefined) return false;
    this.queue.push({ id: first, type: 'reorder', order });
    return true;
  }

  private applyReorder(fullList: Item[], order: number[]): Item[] {
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
  }

  private applyBatch(ops: WriteOperation[]): void {
    const added: Item[] = [];
    const removed: Item[] = [];
    let reordered = false;

    for (const op of ops) {
      if (op.type === 'select') {
        const item = db.findById(op.id);
        if (item) {
          db.addToSelected(item);
          added.push(item);
        }
      } else if (op.type === 'deselect') {
        const item = db.findById(op.id);
        if (item) {
          db.removeFromSelected(op.id);
          removed.push(item);
        }
      } else if (op.type === 'reorder') {
        db.replaceSelected(this.applyReorder(db.selectedElements, op.order ?? []));
        reordered = true;
      }
    }

    if (added.length > 0 || removed.length > 0) {
      broadcast('selected:changed', { added, removed });
    }
    if (reordered) {
      broadcast('selected:reordered', { order: db.selectedElements.map((it) => it.id) });
    }
  }
}

export const selectedService = new SelectedService();
