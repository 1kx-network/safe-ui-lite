import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';

export const PaperStyled = styled(
  'div',
  withTransientProps
)<{ $minWidth?: string; $border?: boolean }>(({
  $minWidth = '100%',
  theme,
  style,
  $border = true,
}) => {
  return {
    background: $border ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
    border: $border ? '0.5px solid rgba(122, 199, 240, 0.4)' : 'none',
    borderRadius: $border ? '14px' : '0',
    padding: theme.spacing(6),
    width: '100%',
    minWidth: $minWidth,
    '@media (max-width: 1068px)': {
      minWidth: '100%',
    },
    ...style,
  };
});
