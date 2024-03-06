import styled from '@emotion/styled';

export interface WalletTypographyProps {
  fontSize?: number;
  fontWeight?: number;
  component?: 'div' | 'span' | 'time' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: string | number;
  letterSpacing?: number;
  color?: string;
  opacity?: number;
  className?: string;
  children: React.ReactNode;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

export const WalletTypography = ({
  fontSize = 16,
  fontWeight = 400,
  component = 'span',
  color = '#000000',
  className = '',
  opacity,
  lineHeight,
  letterSpacing,
  textAlign,
  children,
  textTransform,
}: WalletTypographyProps) => {
  const Component = styled(component)(() => ({
    fontSize,
    textAlign,
    fontWeight,
    lineHeight,
    letterSpacing,
    opacity,
    color: `var(--color-${color})`,
    margin: 0,
    textTransform,
  }));
  return <Component className={className}>{children}</Component>;
};
