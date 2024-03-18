import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const BodyStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(3.5)};
  width: 100%;

  @media (max-width: 1240px) {
    flex-wrap: wrap;
  }
`
);

export const NonceBoxStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    width: 5.25rem;
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

export const InputAmountStyled = styled('div')(
  ({ theme }) => `
  width: 70%;
  & > input {
    padding: ${theme.spacing(3.875)} ${theme.spacing(3.5)};
  }
`
);

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
  width: '5.125rem',
  height: '2.2rem',
  margin: 0,
  padding: 0,
};

export const styledInput = {
  width: '100%',
  padding: `${themeMuiBase.spacing(3.875)} ${themeMuiBase.spacing(3.5)}`,
};

export const HeaderTokensStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TrxHeaderStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(2)};
  border-bottom: 1px solid ${theme.palette.tetriaryLightGrey};
  padding-bottom: ${theme.spacing(12)};
  margin-bottom: ${theme.spacing(12)};
`
);

export const AlignCenterStyled = styled('div')`
  display: flex;
  align-items: center;
`;

export const styledPaper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  gap: themeMuiBase.spacing(3),
};

export const styledBtnNextStep = {
  width: '153px',
};

export const WrapPaperStyled = styled('div')`
  width: 50%;
  min-width: 360px;

  @media (max-width: 1240px) {
    min-width: 100%;
  }
`;

export const BtnMaxInputStyled = styled('div')(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(3.5)};
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
`
);
