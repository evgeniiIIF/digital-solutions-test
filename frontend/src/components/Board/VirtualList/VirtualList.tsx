import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { ReactNode } from 'react';

import { BOTTOM_PX } from '@/config/constants';

import './VirtualList.scss';

const ITEM_HEIGHT = 49;
const OVERSCAN = 10;

interface VirtualListProps<T> {
  items: T[];
  keyOf: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
}

export const VirtualList = <T,>({
  items,
  keyOf,
  renderItem,
  hasMore,
  isLoading,
  loadMore,
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: OVERSCAN,
  });

  const handleScroll = () => {
    const element = parentRef.current;
    if (!element || !hasMore || isLoading) return;
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (distanceToBottom <= BOTTOM_PX) loadMore();
  };

  return (
    <div ref={parentRef} className="virtual-list" onScroll={handleScroll}>
      <div className="virtual-list__inner" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) return null;
          return (
            <div
              key={keyOf(item)}
              className="virtual-list__row"
              data-index={virtualItem.index}
              style={{ transform: `translateY(${virtualItem.start}px)`, height: ITEM_HEIGHT }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
