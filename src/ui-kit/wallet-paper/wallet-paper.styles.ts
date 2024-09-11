import { styled } from '@mui/system';
import { withTransientProps } from '@/utils/styled.utils';

export const PaperStyled = styled(
  'div',
  withTransientProps
)<{ $minWidth?: string }>(({ $minWidth = '100%', theme, style }) => {
  return {
    background: 'rgba(0, 0, 0, 0.2)',
    border: '0.5px solid rgba(122, 199, 240, 0.4)',
    borderRadius: '14px',
    padding: theme.spacing(6),
    width: '100%',
    minWidth: $minWidth,
    '@media (max-width: 1068px)': {
      minWidth: '100%',
    },
    ...style,
  };
});
