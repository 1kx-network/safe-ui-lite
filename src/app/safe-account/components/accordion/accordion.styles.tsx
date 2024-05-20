import { styled } from '@mui/system';

import { withTransientProps } from '@/utils/styled.utils';
import ArrowUp from '@/assets/svg/arrow_up.svg';
import ArrowDown from '@/assets/svg/arrow_down.svg';

export const AccordionStyled = styled(
  'div',
  withTransientProps
)<{
  $backgroundColor?: boolean;
}>(({ $backgroundColor, theme }) => {
  return {
    padding: theme.spacing(5),
    borderRadius: '28px',
    backgroundColor: $backgroundColor || theme.palette.white,
    userSelect: 'none',
    cursor: 'pointer',
  };
});

export const ArrowUpStyled = styled(ArrowUp)`
  cursor: pointer;
`;

export const ArrowDownStyled = styled(ArrowDown)`
  cursor: pointer;
`;
