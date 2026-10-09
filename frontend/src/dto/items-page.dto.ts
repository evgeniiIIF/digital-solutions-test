import type { Item } from '@/types/item.types';

export interface ItemsPageDto {
  items: Item[];
  nextCursor: number | null;
}
