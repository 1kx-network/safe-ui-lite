import { themeMuiBase } from '@/assets/styles/theme-mui';
import { styled } from '@mui/system';

export const BodyStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(3.5)};

  @media (max-width: 1240px) {
   
  #send-tokens-body {
    width: 90%;
    max-width: 90% !important;
   }

   #trx-tokens-body {
    width: 10%;
    min-width: 260px !important;
   }
  }
  
  @media (max-width: 1040px) {
    flex-wrap: wrap;
   
    #send-tokens-body, #trx-tokens-body {
      width: 100%;
      max-width: 100% !important;
     }
  
     #trx-tokens-body {
      min-width: 260px;
     }
  }
`
);

export const NonceBoxStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    width: 84px;
    overflow: hidden;
    border: 1px solid ${theme.palette.black};
    border-radius: ${theme.spacing(7)};
    padding: ${theme.spacing(3.5)};
`
);

export const GridBtnStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
`
);

export const AmountSelectStyled = styled('div')`
  max-width: 184px;
  width: 30%;
`;

export const InputAmountStyled = styled('div')`
  width: 70%;
  & > input {
    padding: 15.5px 14px;
  }
`;

export const StatusLineStyled = styled('div')(
  ({ theme }) => `
  border-left: 1px solid ${theme.palette.borderColor};
  height: 30px;
  margin-left: ${theme.spacing(2)};
`
);

export const ConfirmedWaitStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items:center;
  justify-content: center;
  border: 1px solid ${theme.palette.black};
  background-color: ${theme.palette.black};
  color: ${theme.palette.white};
  border-radius: 50%;
  min-width: 1rem;
  height: 1rem;
`
);

export const ExecuteIconStyled = styled('div')(
  ({ theme }) => `
  border: 1px solid ${theme.palette.black};
  min-width: 1rem;
  height: 1rem;
  border-radius: 50%;
`
);

export const ProccessingBoxStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
`
);

export const ItemProccessingStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: center;
  gap: ${theme.spacing(3)};
`
);

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing(3.5)};
`
);

export const styledBtxMax = {
  width: '82px',
  height: '36px',
  margin: 0,
  padding: 0,
};

export const styledInput = {
  width: '100%',
  padding: `${themeMuiBase.spacing(3.875)} ${themeMuiBase.spacing(3.5)}`,
};

export const styledPaper: React.CSSProperties = {
  maxWidth: '50%',
  minWidth: '360px',
  gap: '12px',
  display: 'flex',
  flexDirection: 'column',
};

export const styledBoxTokens = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
};

export const styledBoxTrx = {
  display: 'flex',
  gap: '8px',
  borderBottom: '1px solid #e3e3e3',
  paddingBottom: '53px',
  marginBottom: '53px',
};

export const styledAlignCenter = {
  display: 'flex',
  alignItems: 'center',
};
