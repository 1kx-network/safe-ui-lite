import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    background: 'transparent',
    overflow: 'inherit',
  },
  overlay: {
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    zIndex: 999,
  },
};

export const TitleStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing(3)};
`
);

export const styledPaper = {
  border: `1px solid ${themeMuiBase.palette.grey}`,
  backgroundColor: themeMuiBase.palette.white,
};
