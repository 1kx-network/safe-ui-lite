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

export const NonceBoxStyled = {
  display: 'flex',
  alignItems: 'center',
  width: '5.25rem',
  overflow: 'hidden',
};

export const GridBtnStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
`
);

export const AmountSelectStyled = styled('div')`
  width: 145px;
  min-width: 145px;
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
  padding-bottom: 2px;
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

export const styledBtxMax = {
  width: '34px',
  height: '34px',
  margin: 0,
  padding: 0,
  fontSize: '14px',
};

export const styledInput = {
  width: '100%',
  padding: `${themeMuiBase.spacing(3)}`,
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
  padding-bottom: ${theme.spacing(13)};
  margin-bottom: ${theme.spacing(13)};
`
);

export const AlignCenterStyled = styled('div')`
  display: flex;
  align-items: center;
  gap: ${themeMuiBase.spacing(2)};
`;

export const styledPaper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  gap: themeMuiBase.spacing(3),
};

export const styledBtnNextStep = {
  width: '153px',
  marginTop: themeMuiBase.spacing(1.4),
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
