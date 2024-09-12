import { styled } from '@mui/system';

import IconPlus from '@/assets/svg/plus.svg';

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  width: 100%;
`;

export const IconPlusStyled = styled(IconPlus)(
  ({ theme }) => `
    width: 18px;
    min-width: 18px;
    height: 18px;
    color: ${theme.palette.main};
    margin-right: ${theme.spacing(2)};
  `
);

export const ItemStepPaperStyled = styled('div')`
  display: flex;
  width: 50%;

  @media (max-width: 1060px) {
    width: 100%;
  }
`;
