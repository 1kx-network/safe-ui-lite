import { styled } from '@mui/system';

const grey = {
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

export const ButtonStyled = styled('button')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  width: 155px;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${grey[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${grey[500]};
  box-shadow: 0 2px 1px ${
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
  }, inset 0 1.5px 1px ${grey[400]}, inset 0 -2px 1px ${grey[600]};

  &:hover {
    background-color: ${grey[600]};
  }
  `
);
