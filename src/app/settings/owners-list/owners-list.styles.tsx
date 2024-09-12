import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column; 
    gap: ${theme.spacing(3.5)};
    margin-top: 1.5rem;
`
);

export const BodyAccountsStyled = styled('div')(
  ({ theme }) => `
display: flex;

@media (max-width: 1068px) {
  flex-wrap: wrap;
  gap: ${theme.spacing(3)};
}
`
);

export const BoxStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
`
);

export const GridBtnStyled = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const styledBtn = {
  width: 'fit-content',
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.87)',
};

export const styledCSV = {
  textDecoretion: 'none',
  color: 'transparent',
};

export const ConfirmationsStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(6)}
`
);

export const BodyListAccountsStyled = styled('div')`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: auto;
  max-height: 350px;
`;

export const AddOwnerStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap:${theme.spacing(6)};
  width: 100%;
`
);

export const GridBtnAddOwnerStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  justify-content:space-between;
  aling-items: center;
  gap: ${theme.spacing(3)};
`
);

export const styledNonce = {
  display: 'flex',
  alignItems: 'center',
  width: '5.25rem',
  overflow: 'hidden',
};

export const OnceSelectStyled = styled('div')(
  ({ theme }) => `
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-color: ${theme.palette.tetriaryLightGrey};
  border-radius: 1.75rem;
  border-style: solid;
  border-width: 1px;
  box-shadow: none;
  box-sizing: border-box;
  height: 44px;
  min-width: 38px;
  padding: 0 0.5rem;
  margin-right: ${theme.spacing(2)};
`
);
