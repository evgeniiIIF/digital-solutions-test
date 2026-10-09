import { UIButton } from '@/uikit/UIButton';
import { UIInput } from '@/uikit/UIInput';
import type { FilterState } from '@/types/filter.types';

import { useFilters } from '@/components/Board/Filters/useFilters';

import './Filters.scss';

interface FiltersProps {
  onApply: (filter: FilterState) => void;
}

export const Filters = ({ onApply }: FiltersProps) => {
  const { minInput, maxInput, error, handleSubmit, onChangeMin, onChangeMax } = useFilters(onApply);

  return (
    <form className="filters" onSubmit={handleSubmit}>
      {error && <div className="filters__error">{error}</div>}
      <div className="filters__row">
        <UIInput
          type="text"
          inputMode="numeric"
          placeholder="От"
          value={minInput}
          onChange={(e) => onChangeMin(e.target.value)}
        />
        <UIInput
          type="text"
          inputMode="numeric"
          placeholder="До"
          value={maxInput}
          onChange={(e) => onChangeMax(e.target.value)}
        />
        <UIButton type="submit">Применить</UIButton>
      </div>
    </form>
  );
};
