import styled from '@emotion/styled';

export interface WalletTextareaProps {
  fontSize?: number;
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string | number;
  letterSpacing?: number;
  color?: string;
  opacity?: number;
  className?: string;
  rows?: number;
  placeholder?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  style?: React.CSSProperties;
  fontFamily?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const WalletTextarea = ({
  fontSize = 16,
  fontWeight = 400,
  color = '#000000',
  className = '',
  opacity,
  lineHeight,
  letterSpacing,
  fontFamily,
  textAlign,
  rows = 5,
  placeholder = '',
  textTransform,
  style,
  value,
  onChange,
}: WalletTextareaProps) => {
  const StyledTextarea = styled.textarea(() => ({
    fontSize,
    textAlign,
    fontWeight,
    lineHeight,
    letterSpacing,
    fontFamily,
    opacity,
    color,
    textTransform,
    margin: 0,
    width: '100%',
    resize: 'none',
    boxSizing: 'border-box',
  }));
  return (
    <StyledTextarea
      className={className}
      style={style}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
