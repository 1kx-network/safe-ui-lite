import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(6)};
  width: 100%;
  height: calc(100% - 190px);
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 1056px) {
    flex-direction: column;
  }
`
);

export const BodyStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  position: relative;
  width: 40%;
  flex-direction: column;
  gap: ${theme.spacing(6)};
  height: 100%;
  

  @media (max-width: 1056px) {
    width: 100%;
  }
`
);

export const BodyBatchStyled = styled('div')`
  width: 60%;
  max-width: 650px;
  height: 100%;
  position: relative;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 1056px) {
    width: 100%;
  }
`;

export const styledPaper = {
  gap: themeMuiBase.spacing(3),
};

export const styledBtnTextArea = {
  fontSize: '12px',
  width: 'auto',
  padding: '5px 10px',
  marginTop: '18px',
  fontWeight: '400',
};
