import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconDoneOpacity from '@/assets/svg/done-opacity.svg';
import IconPlus from '@/assets/svg/plus.svg';
import MetamaskIcon from '@/assets/svg/metamask.svg';
import IconProgress from '@/assets/svg/progress-bar.svg';

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
    width: 18px;
    min-width: 18px;
    height: 18px;
    color: ${theme.palette.main};
    margin-right: ${theme.spacing(2)};
  `
);

export const IconMetamaskStyled = styled(MetamaskIcon)(
  ({ theme }) => `
    width: 18px;
    min-width: 18px;
    height: 18px;
    color: ${theme.palette.main};
    margin-right: ${theme.spacing(2)};
  `
);

export const IconProgressStyled = styled(IconProgress)`
  width: 100%;
  max-width: 125px;
  height: auto;
`;

export const styledBtn = {
  fontSize: '14px',
  width: '295px',
  height: '44px',
  marginTop: themeMuiBase.spacing(6),
};

export const createBtn = {
  fontSize: '14px',
  width: '295px',
  height: '44px',
  marginTop: themeMuiBase.spacing(6),
};
