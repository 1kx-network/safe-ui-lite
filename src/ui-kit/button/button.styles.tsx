import { Button as ButtonMUI } from '@mui/base/Button';
import { styled } from '@mui/system';

export const Button = styled(ButtonMUI)(
  ({ theme }) => `
      background-color: ${theme.palette.primary};
      border: 1px solid ${theme.palette.primary};
    `
);
