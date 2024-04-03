import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${theme.spacing(3.5)};
  margin-top: 4rem;
`
);

export const Flex = styled('div')(
  () => `
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
`
);
