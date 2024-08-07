import { styled } from '@mui/system';
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
  height: auto;
  margin: auto;
  max-width: 650px;
`;

export const GridButtonStyled = styled('div')(
  ({ theme }) => `
   display: flex;
   align-items: center;
   width: 100%;
   gap: ${theme.spacing(3)};
   margin-bottom: ${theme.spacing(6)};
  `
);

export const OwnersInfoStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: ${theme.spacing(2.5)};
    flex-direction: column;
    margin-top: ${theme.spacing(4)};
    `
);

export const BoxOwnerLinkStyled = styled('div')(
  ({ theme }) => `
     display: flex;
     gap: ${theme.spacing(3)};
     align-items: center;
     margin: ${theme.spacing(3)} 0;
    `
);

export const OwnerLinkStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      padding: ${theme.spacing(3)} ${theme.spacing(2.5)};
      border-radius: 44px;
      border: 1px solid ${theme.palette.black};
      width: 100%;
      `
);

export const styledBtn = {
  maxWidth: '100%',
  height: '44px',
};

export const styledSecondaryBtn = {
  ...styledBtn,
  backgroundColor: '#122',
};

export const styledBtnBack: React.CSSProperties = {
  ...styledBtn,
  display: 'flex',
  alignItems: 'center',
  maxWidth: 'fit-content',
  position: 'absolute',
  top: '-75px',
  left: 0,
  paddingLeft: '5px',
  paddingRight: '20px',
};

export const styledPaper: React.CSSProperties = {
  position: 'relative',
};

export const WarningBoxStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(4)};
  padding: ${theme.spacing(2.5)};
  border-radius: 12px;
  background: #FFE793BD;

`
);
