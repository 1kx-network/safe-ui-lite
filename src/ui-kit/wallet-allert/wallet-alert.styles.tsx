import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';

export const AlertStyled = styled(
  'div',
  withTransientProps
)<{ $minWidth?: string }>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.palette.textDark,
  borderRadius: '14px',
  padding: `${theme.spacing(6)} ${theme.spacing(3.2)}`,
}));
