import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './UIButton.scss';

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const UIButton = ({ children, ...rest }: UIButtonProps) => {
  return (
    <button className="ui-button" {...rest}>
      {children}
    </button>
  );
};
