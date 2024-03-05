import { MouseEvent } from 'react';
import classNames from 'classnames';
import style from './index.module.scss';

interface IButtonProps {
  variant?: 'outline' | 'text' | 'contained';
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  customStyle?: React.CSSProperties;
  children: string;
  color?: 'dark' | 'light';
  className?: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FunctionComponent<IButtonProps> = ({
  variant = 'outline',
  color = 'light',
  active,
  disabled,
  loading,
  children,
  customStyle,
  className,
  onClick,
}) => {
  const buttonClasses = classNames(
    style.btn,
    style[color],
    style[variant],
    {
      [style.active]: active,
      [style.disabled]: disabled,
      [style.loading]: loading,
    },
    className
  );

  return (
    <button onClick={onClick} disabled={disabled} className={buttonClasses} style={customStyle}>
      {children}
    </button>
  );
};
