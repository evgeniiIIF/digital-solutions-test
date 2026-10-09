export interface WriteOperation {
  id: number;
  type: 'select' | 'deselect' | 'reorder';
  order?: number[];
}
