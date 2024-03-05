import classNames from 'classnames';
import style from './index.module.scss';

interface IButtonProps {
  variant?: 'outline' | 'text' | 'contained';
  active?: boolean;
  disabled?: boolean;
  loading?: boolean;
  customStyle?: React.CSSProperties;
  text: string | number;
  color?: 'dark' | 'light';
  className?: string;
}

export const Button: React.FunctionComponent<IButtonProps> = ({
  variant = 'outline',
  color = 'light',
  active,
  disabled,
  loading,
  text,
  customStyle,
  className,
  ...props
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
    <div className={buttonClasses} style={customStyle}>
      {text}
    </div>
  );
};
