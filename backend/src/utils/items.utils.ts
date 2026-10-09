import type { Item } from '../types/item.types';

export const sortById = (items: Item[]): Item[] => [...items].sort((a, b) => a.id - b.id);
