import { styled } from '@mui/system';

export const GridContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 14px;
  justify-content: center;

  @media (min-width: 1068px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const GridButtonStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 4rem 2rem 0 2rem;
  max-width: 1114px;

  & > .safe-account_main-header {
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;

    @media (max-width: 1068px) {
      text-align: center;
    }
  }
`;

export const styleWalletPaper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
};

export const DisconnectButtonStyled = styled('div')`
  display: flex;
  justify-content: end;
`;
