import Image from 'next/image';
import { styled } from '@mui/system';

import { themeMuiBase } from '@/assets/styles/theme-mui';
import CopyIcon from '@/assets/svg/copy.svg';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    gap: ${theme.spacing(3)};
    position: relative;
    padding-right: ${theme.spacing(6)};
    cursor: pointer;
    margin-bottom: ${theme.spacing(1)};
    display: flex;
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

export const BodyOpenStyled = styled('div')<{ isOpen?: boolean }>(
  ({ theme, isOpen }) => `
      overflow: hidden;
      position: absolute;
      z-index: 999;
      display: ${isOpen ? 'flex' : 'none'};
      width: 273px;
      border-radius: ${theme.spacing(4.5)};
      background-color: ${theme.palette.textDark};
      flex-direction: column;
      padding: ${theme.spacing(3)};
      top: 40px;
      right: 183px;
  `
);

export const WCButton = styled('div')(
  () => `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    margin-right: 12px;
    border-radius: 50%;
    background-color: ${themeMuiBase.palette.white};
`
);

export const ItemInfoStyled = styled('div')<{ noBorder?: boolean }>(
  ({ noBorder }) => `
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 6px 0;
    justify-content: space-between;
    border-bottom: 0.5px solid ${noBorder ? 'transparent' : 'rgba(228, 228, 228, 0.25)'};
`
);

export const ItemInfoNetworkStyled = styled('div')<{ noBorder?: boolean }>(
  ({ theme, noBorder }) => `
    display: flex;
    align-items: center;
    padding: ${theme.spacing(2)} ${theme.spacing(4)};
    gap:${theme.spacing(1.5)};
    border-bottom: 0.5px solid ${noBorder ? 'transparent' : 'rgba(228, 228, 228, 0.25)'};
    cursor: pointer;
    transition: 0.3s ease all;

    &:hover {
      background-color: ${theme.palette.greyToo};
    }
`
);

export const styledNetworks = {
  overflow: 'hidden',
  width: '150px',
  right: '21px',
  padding: `${themeMuiBase.spacing(2)} 0`,
};

export const styledBtnAddNetwork = {
  height: '34px',
  fontSize: '12px',
  color: 'white',
  marginTop: '0.2rem',
};

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

export const ImgWalletStyled = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;
