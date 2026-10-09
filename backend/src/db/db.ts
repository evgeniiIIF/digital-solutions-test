import { BASE_MAX } from '../config/config';
import type { Item } from '../types/item.types';
import { sortById } from '../utils/items.utils';

class Db {
  readonly baseElements: Item[] = [];
  addedElements: Item[] = [];
  readonly selectedElements: Item[] = [];

  private readonly poolSet = new Set<number>();
  private readonly selectedSet = new Set<number>();

  constructor() {
    for (let i = 1; i <= BASE_MAX; i++) {
      const item: Item = { id: i, title: `Item ${i}` };
      this.baseElements.push(item);
      this.poolSet.add(i);
    }
  }

  hasInPool(id: number): boolean {
    return this.poolSet.has(id);
  }

  isSelected(id: number): boolean {
    return this.selectedSet.has(id);
  }

  selectedIds(): Set<number> {
    return this.selectedSet;
  }

  addToPool(item: Item): void {
    this.poolSet.add(item.id);
    this.addedElements = sortById([...this.addedElements, item]);
  }

  addToSelected(item: Item): void {
    this.selectedSet.add(item.id);
    this.selectedElements.push(item);
  }

  removeFromSelected(id: number): void {
    this.selectedSet.delete(id);
    const pos = this.selectedElements.findIndex((item) => item.id === id);
    if (pos !== -1) this.selectedElements.splice(pos, 1);
  }

  findById(id: number): Item | undefined {
    if (id >= 1 && id <= BASE_MAX) return this.baseElements[id - 1];
    return this.addedElements.find((item) => item.id === id);
  }

  replaceSelected(items: Item[]): void {
    this.selectedElements.length = 0;
    this.selectedElements.push(...items);
  }
}

export const db = new Db();
