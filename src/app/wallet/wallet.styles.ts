import { styled } from '@mui/system';

export const styledHeader = {
  fontSize: '1.375rem',
  fontWeight: 600,
};

export const styledPaper = {
  height: 'auto',
  marginTop: '14px',
};

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4rem;
`;

export const BoxGridStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  width: 100%;
  gap: ${theme.spacing(3.5)};

  margin-bottom: ${theme.spacing(6)};

  @media (max-width: 1180px) {
    flex-wrap: wrap;
  }
`
);
