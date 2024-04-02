import { styled } from '@mui/system';

export const TransactionBuilder = styled('iframe')(
  () => `
  display: flex;
  width: 100%;
  height: 85vh;
  flex-wrap: wrap;
  @media (max-width: 1240px) {
    flex-wrap: wrap;
  }
`
);
