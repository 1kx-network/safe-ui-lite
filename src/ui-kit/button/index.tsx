import { ThemeProvider } from '@emotion/react';
import { themeMuiBase } from '@/app/assets/themeMuiBase';
import { ButtonProps } from '@mui/base/Button';

import { Button } from './button.styles';

export const ButtonMui = (props: ButtonProps) => (
  <ThemeProvider theme={themeMuiBase}>
    <Button {...props}>{props.children}</Button>
  </ThemeProvider>
);
