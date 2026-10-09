class BatchQueue<T> {
  private readonly buffer = new Map<string, T>();
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly intervalMs: number,
    private readonly keyOf: (item: T) => string,
    private readonly onFlush: (items: T[]) => void,
  ) {}

  has(key: string): boolean {
    return this.buffer.has(key);
  }

  push(item: T): void {
    const key = this.keyOf(item);
    if (this.buffer.has(key)) return;
    this.buffer.set(key, item);
    if (this.timer === null) {
      this.timer = setTimeout(() => this.flush(), this.intervalMs);
    }
  }

  private flush(): void {
    this.timer = null;
    if (this.buffer.size === 0) return;
    const batch = [...this.buffer.values()];
    this.buffer.clear();
    this.onFlush(batch);
  }
}

export { BatchQueue };
