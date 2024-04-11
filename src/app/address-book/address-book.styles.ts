import { styled } from '@mui/system';

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  width: 100%;
`;

export const BoxSearchStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(5)};
`
);

export const BtnGridStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};

`
);

export const InputStyled = styled('div')`
  width: 100%;
  max-width: 360px;
`;

//
export const styledBtn = {
  maxWidth: '150px',
  height: '44px',
  display: 'flex',
  alingItems: 'center',
};
