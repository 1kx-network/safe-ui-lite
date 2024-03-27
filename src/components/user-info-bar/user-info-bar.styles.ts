import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import CopyIcon from '@/assets/svg/copy.svg';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    position: relative;
    padding-right: ${theme.spacing(6)};
    cursor: pointer;
    margin-bottom: ${theme.spacing(1)};
`
);

export const InfoUserStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 173px;
    height: 34px;
    border-radius: ${theme.spacing(7)};
    background-color: ${theme.palette.textDark};
    color: ${theme.palette.white};
    overflow: hidden;
    padding: 0 ${theme.spacing(2)};
    margin-bottom: ${theme.spacing(1)};
    z-index: 1;
`
);

export const BodyOpenStyled = styled('div')<{ isOpen: boolean }>(
  ({ theme, isOpen }) => `
      overflow: hidden;
      position: absolute;
      z-index: 999;
      display: ${isOpen ? 'flex' : 'none'};
      width: 173px;
      border-radius: ${theme.spacing(4.5)};
      background-color: ${theme.palette.textDark};
      flex-direction: column;
      padding: ${theme.spacing(3)};
  `
);

export const ItemInfoStyled = styled('div')<{ noBorder?: boolean }>(
  ({ noBorder }) => `
    display: flex;
    align-items: center;
    padding: 6px 0;
    justify-content: space-between;
    border-bottom: 0.5px solid ${noBorder ? 'transparent' : 'rgba(228, 228, 228, 0.25)'};
`
);

export const GridButtonStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    margin-top: ${theme.spacing(2)}; 
    gap: ${theme.spacing(1)};
`
);

export const IconArrowStyled = styled('div')<{ isOpen: boolean }>(
  ({ isOpen }) => `
    display: flex;
    align-items: center;
    transition: all 0.3s;
    transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`
);

export const IconCopyStyled = styled(CopyIcon)(
  ({ theme }) => `
     width: 14px;
     height: 14px;
     cursor: pointer;
     color: ${theme.palette.grey};
  `
);

export const styledBtn = {
  fontSize: '12px',
  height: '28px',
  background: 'transparent',
  color: themeMuiBase.palette.white,
  border: `1px solid ${themeMuiBase.palette.white}`,
  fontWeight: 300,
};

export const styledBtnDisconnect = {
  ...styledBtn,
  border: 'none',
  color: themeMuiBase.palette.error,
};
