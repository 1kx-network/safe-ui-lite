'use client';
import { ThemeProvider } from '@emotion/react';
import { themeMuiBase } from '@/app/assets/themeMuiBase';
import { Button as ButtonMUI } from '@mui/base/Button';
import { styled } from '@mui/system';

const Btn = styled(ButtonMUI)(
  ({ theme }) => `
    background-color: ${theme.palette.primary};
    border: 1px solid ${theme.palette.primary};
  `
);

export const Button = () => {
  return (
    <ThemeProvider theme={themeMuiBase}>
      <Btn variant="outline">Create Repository</Btn>
    </ThemeProvider>
  );
};
