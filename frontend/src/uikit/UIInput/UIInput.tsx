import type { InputHTMLAttributes } from 'react';

import './UIInput.scss';

export const UIInput = ({ ...rest }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className="ui-input" {...rest} />;
};
