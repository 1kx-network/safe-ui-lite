import { styled } from '@mui/system';

export const OwnerStylesBtn = { fontSize: '13px', fontWeight: 500 };

export const OwnersListStyled = styled('div')(
  () => `
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow: scroll;
`
);
