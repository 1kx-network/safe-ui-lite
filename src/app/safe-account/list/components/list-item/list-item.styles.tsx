import { styled } from '@mui/system';

export const BodyStyled = styled('div')(
  ({ theme }) => `
    display:flex;
    align-items: center;
    border: 1px solid ${theme.palette.black};
    border-radius: ${theme.spacing(3.5)};
    padding: ${theme.spacing(6)};
    height: 65px;
    overflow: hidden;
    margin-bottom: ${theme.spacing(2.5)};
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background-color: ${theme.palette.textDarkLight};
    }
`
);

export const AccountInfoStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin-right: ${theme.spacing(3)};
    gap: 4px;
`
);
