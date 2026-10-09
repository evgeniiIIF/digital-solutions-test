import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect } from 'react';

import { PAGE_SIZE } from '@/config/constants';
import { Filters } from '@/components/Board/Filters/Filters';
import { ItemCard } from '@/components/Board/ItemCard/ItemCard';
import { VirtualList } from '@/components/Board/VirtualList';
import { useItemsStore } from '@/store/itemsStore';

import './RightPanel.scss';

export const RightPanel = () => {
  const selected = useItemsStore((state) => state.selected);
  const selectedLoading = useItemsStore((state) => state.selectedLoading);
  const selectedHasMore = useItemsStore((state) => state.selectedHasMore);
  const loadMoreSelected = useItemsStore((state) => state.loadMoreSelected);
  const setSelectedFilter = useItemsStore((state) => state.setSelectedFilter);
  const reorder = useItemsStore((state) => state.reorder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (selected.length < PAGE_SIZE * 2 && selectedHasMore && !selectedLoading) {
      loadMoreSelected();
    }
  }, [selected.length, selectedHasMore, selectedLoading, loadMoreSelected]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selected.findIndex((item) => item.id === active.id);
    const newIndex = selected.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(selected, oldIndex, newIndex);
    reorder(reordered.map((item) => item.id));
  };

  return (
    <div className="right-panel">
      <div className="right-panel__header">Выбранные</div>
      <Filters onApply={setSelectedFilter} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={selected.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <VirtualList
            items={selected}
            keyOf={(item) => item.id}
            renderItem={(item) => <ItemCard item={item} sortable />}
            hasMore={selectedHasMore}
            isLoading={selectedLoading}
            loadMore={loadMoreSelected}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};
