import { styled } from '@mui/system';

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
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
