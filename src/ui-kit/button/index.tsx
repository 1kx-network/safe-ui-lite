import classNames from 'classnames';
import stl from './index.module.scss';

interface IButtonProps {
  variant?: 'outline' | 'text' | 'contained';
  active?: boolean | null;
  disabled?: boolean | null;
  loading?: boolean | null;
  customStyle?: React.CSSProperties | undefined;
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
    stl.btn,
    stl[color],
    stl[variant],
    {
      [stl.active]: active,
      [stl.disabled]: disabled,
      [stl.loading]: loading,
    },
    className
  );

  return (
    <div className={buttonClasses} style={customStyle}>
      {text}
    </div>
  );
};
