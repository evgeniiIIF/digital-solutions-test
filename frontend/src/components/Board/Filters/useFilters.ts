import { useState } from 'react';
import type { SubmitEvent } from 'react';

import type { FilterState } from '@/types/filter.types';

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export const useFilters = (onApply: (filter: FilterState) => void) => {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const min = minInput ? Number(minInput) : null;
    const max = maxInput ? Number(maxInput) : null;

    if (min && max && min > max) {
      setError('От не может быть больше До');
      return;
    }

    setError(null);
    onApply({ min, max });
  };

  const handleChange = (setter: (v: string) => void) => (value: string) => {
    setter(digitsOnly(value));
    if (error) setError(null);
  };

  return {
    minInput,
    maxInput,
    error,
    handleSubmit,
    onChangeMin: handleChange(setMinInput),
    onChangeMax: handleChange(setMaxInput),
  };
};
