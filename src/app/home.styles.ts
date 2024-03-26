import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconDoneOpacity from '@/assets/svg/done-opacity.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconProgress from '@/assets/svg/progress-bar.svg';

export const WrapperStyled = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 5rem;
  width: 100%;
`;

export const GridStepsStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};

  @media (max-width: 1060px) {
    flex-wrap: wrap;
  }
`
);

export const ItemStepPaperStyled = styled('div')`
  display: flex;
  width: 50%;

  @media (max-width: 1060px) {
    width: 100%;
  }
`;

export const IconDoneOpacityStyled = styled(IconDoneOpacity)(
  ({ theme }) => `
    margin-bottom: ${theme.spacing(4)};
`
);

export const IconPlusStyled = styled(IconPlus)(
  ({ theme }) => `
    width: 48px;
    min-width: 48px;
    height: 48px;
    margin-bottom: ${theme.spacing(4)};
    background-color: ${theme.palette.success};
    color: ${theme.palette.white};
    border-radius: 50%;
    padding: ${theme.spacing(2)};
  `
);

export const IconProgressStyled = styled(IconProgress)`
  width: 100%;
  max-width: 125px;
  height: auto;
`;

export const styledBtn = {
  width: '228px',
  marginTop: themeMuiBase.spacing(6),
};
