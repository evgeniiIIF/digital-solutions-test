import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';

import { Filters } from '@/components/Board/Filters/Filters';
import { ItemCard } from '@/components/Board/ItemCard/ItemCard';
import { VirtualList } from '@/components/Board/VirtualList';
import { PAGE_SIZE } from '@/config/constants';
import { useItemsStore } from '@/store/itemsStore';
import { UIButton } from '@/uikit/UIButton';
import { UIInput } from '@/uikit/UIInput';

import './LeftPanel.scss';

export const LeftPanel = () => {
  const items = useItemsStore((state) => state.items);
  const itemsLoading = useItemsStore((state) => state.itemsLoading);
  const itemsHasMore = useItemsStore((state) => state.itemsHasMore);
  const loadMoreItems = useItemsStore((state) => state.loadMoreItems);
  const setItemsFilter = useItemsStore((state) => state.setItemsFilter);
  const addItem = useItemsStore((state) => state.addItem);

  const [idInput, setIdInput] = useState('');

  useEffect(() => {
    if (items.length < PAGE_SIZE * 2 && itemsHasMore && !itemsLoading) {
      loadMoreItems();
    }
  }, [items.length, itemsHasMore, itemsLoading, loadMoreItems]);

  const handleAdd = (event: SubmitEvent) => {
    event.preventDefault();
    if (idInput === '') return;
    addItem(Number(idInput));
    setIdInput('');
  };

  return (
    <div className="left-panel">
      <div className="left-panel__header">Все элементы</div>
      <Filters onApply={setItemsFilter} />
      <form className="left-panel__add" onSubmit={handleAdd}>
        <UIInput
          type="text"
          placeholder="Новый ID"
          value={idInput}
          onChange={(event) => setIdInput(event.target.value)}
        />
        <UIButton type="submit">Добавить</UIButton>
      </form>
      <VirtualList
        items={items}
        keyOf={(item) => item.id}
        renderItem={(item) => <ItemCard item={item} />}
        hasMore={itemsHasMore}
        isLoading={itemsLoading}
        loadMore={loadMoreItems}
      />
    </div>
  );
};
