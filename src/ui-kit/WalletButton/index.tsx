import { MouseEvent } from 'react';
import classNames from 'classnames';
import style from './index.module.scss';
import { ButtonStyled } from './wallet-button.styles';

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

export const WalletButton: React.FunctionComponent<IButtonProps> = ({
  variant = 'outline',
  color = 'light',
  active,
  disabled,
  loading,
  children,
  className,
  onClick,
}) => {
  return (
    <ButtonStyled onClick={onClick} disabled={disabled} className={className}>
      {children}
    </ButtonStyled>
  );
};
