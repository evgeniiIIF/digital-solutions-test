import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useItemsStore } from '@/store/itemsStore';
import type { Item } from '@/types/item.types';

import './ItemCard.scss';

interface ItemCardProps {
  item: Item;
  sortable?: boolean;
}

interface CardProps {
  item: Item;
  dragHandleProps?: Record<string, unknown>;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

const PlainCard = ({ item, setNodeRef, style }: CardProps) => {
  const select = useItemsStore((state) => state.select);

  return (
    <div ref={setNodeRef} style={style} className="item-card">
      <span className="item-card__title">{item.title}</span>
      <button className="item-card__button" onClick={() => select(item)} type="button">
        Выбрать
      </button>
    </div>
  );
};

const SortableCard = ({ item, dragHandleProps, setNodeRef, style }: CardProps) => {
  const deselect = useItemsStore((state) => state.deselect);

  return (
    <div ref={setNodeRef} style={style} className="item-card">
      <button
        className="item-card__button item-card__button--drag"
        {...dragHandleProps}
        type="button"
      >
        Переместить
      </button>
      <span className="item-card__title">{item.title}</span>
      <button
        className="item-card__button item-card__button--remove"
        onClick={() => deselect(item)}
        type="button"
      >
        Убрать
      </button>
    </div>
  );
};

const SortableWrapper = ({ item }: { item: Item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <SortableCard
      item={item}
      dragHandleProps={{ ...attributes, ...listeners }}
      setNodeRef={setNodeRef}
      style={style}
    />
  );
};

export const ItemCard = ({ item, sortable = false }: ItemCardProps) => {
  if (sortable) return <SortableWrapper item={item} />;
  return <PlainCard item={item} />;
};
