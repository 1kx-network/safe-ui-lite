import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column; 
    gap: ${theme.spacing(3.5)};
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
    gap: ${theme.spacing(4)};
`
);

export const BoxIconStyled = styled('div')(
  ({ theme }) => `
    margin-left: ${theme.spacing(3)};
    margin-bottom: -${theme.spacing(1)};
  `
);

export const GridBtnStyled = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const styledBtn = {
  width: 'fit-content',
};

export const ConfirmationsStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(6)}
`
);
