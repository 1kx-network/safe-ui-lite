import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const styledButton = {
  padding: themeMuiBase.spacing(3.125),
  borderWidth: '2px',
  maxWidth: '165px',
};

export const InputWrapperStyled = styled('div')(
  ({ theme }) => `
      gap: ${theme.spacing(2)};
      display: flex;
      justify-content: space-between;
      align-items: end;
      width: 100%;
  `
);

export const styledButtonDelete = {
  padding: themeMuiBase.spacing(2.5),
  borderWidth: '2px',
  maxWidth: '64px',
};
