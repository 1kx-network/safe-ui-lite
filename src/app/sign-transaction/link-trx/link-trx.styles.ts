import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletTypography } from '@/ui-kit';
export const TransactionInfoStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: ${theme.spacing(3.25)};
    flex-direction: column;
    padding: ${theme.spacing(6)} ${theme.spacing(3.5)};
    background-color: ${theme.palette.black};
    font-size: 1.063rem;
    font-weight: 600;
    border-radius: 14px;
    margin: ${theme.spacing(6)} 0;
`
);

export const WrapperStyled = styled('div')`
  width: 100%;
  max-width: 650px;
  margin: auto;
`;

export const BoxLinkStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    aling-items: center;
    gap: ${theme.spacing(2)};
    margin-top: ${theme.spacing(2)};
`
);

export const styledBorderBox = {
  marginTop: themeMuiBase.spacing(5),
  paddingTop: themeMuiBase.spacing(2),
  borderTop: `1px solid ${themeMuiBase.palette.borderColor};`,
};

export const BoxAmountStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    aling-items: center;
    gap: ${theme.spacing(2)};
`
);

export const styledBtnCheck = {
  width: '100px',
  height: '40px',
  alignSelf: 'end',
};

export const ItemInfoStyled = styled('div')(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1.5)};
  padding: 0.625rem 1.25rem;
  color: ${theme.palette.textDark};
  font-size: 14px;
  font-width: 400;
  border-radius: 1.75rem;
  border: 1px solid #0000003f;
  background: ${theme.palette.white};
  text-overflow: ellipsis;
  height: 40px;
}
`
);

export const ItemInfoLabelStyled = styled(WalletTypography)`
  display: inline-block;
  font-weight: 400;
  color: ${themeMuiBase.palette.tetriaryGrey};
  font-size: 12px;
  padding-left: ${themeMuiBase.spacing(2)};
  margin-bottom: ${themeMuiBase.spacing(2)};
`;

export const SignersBoxStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
  max-height: 350px;
  overflow-y: scroll;
`
);

export const SingInfoStyled = styled('div')(
  ({ theme }) => `
  disaply: flex;
  align-items: center;
  padding: ${theme.spacing(3)};
  border-radius: 24px;
  background: ${theme.palette.white};
  border: 1px solid ${theme.palette.borderColor};
  width: 90%;
`
);
