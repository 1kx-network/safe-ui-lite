import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/system';

import IconTrash from '@/assets/svg/delete.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconAddress from '@/assets/svg/defult-icon-address.svg';

export const commonStylesBasic = `
  color: rgb(255, 255, 255);
  font-family: Roboto, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  box-sizing: border-box;
  min-width: 0px;
  position: relative;
  border: 0.5px solid rgba(122, 199, 240, 0.4);
  background-color: rgba(0, 0, 0, 0.2);
  display: block;
  box-shadow: rgba(41, 49, 71, 0.1) 0px 8px 16px;
`;

export const commonStyles = `
  ${commonStylesBasic}
  border-radius: 25px;
`;

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  min-width: 326px;
  width: 326px;
  margin-top: 16px;
  margin-right: ${theme.spacing(5)};
  overflow: hidden;
  height: 100%;
  border-radius: 25px;
  background-color: rgba(0, 0, 0, 0.4);
    border: 0.5px solid rgba(122, 199, 240, 0.4);

`
);

export const BodyMainInfoStyled = styled('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
  box-shadow: none;
  border: none;
  margin-top: 0;
`;

export const ImgUserStyled = styled(Image)(
  ({ theme }) => `
  border-radius: 50%;
  margin-right: ${theme.spacing(3.5)};
  object-fit: cover;
`
);

export const InfoUserStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  position: relative;
  align-items: center;
  padding: ${theme.spacing(2.5, 3.5)};
  background-color: rgba(0, 0, 0, 0.4);
`
);

export const MenuStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding: ${theme.spacing(5)};

  font-weight: 600; 
  height: 100%;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none; 
  background-color: rgba(0, 0, 0, 0.2);
  `
);

export const ItemMenuStyled = styled(Link)<{ disabled?: boolean }>(
  ({ theme, disabled }) => `
  ${commonStyles}
  display: flex;
  align-items: center;
  font-size: ${theme.spacing(3.5)};
  text-decoration: none;
  padding: ${theme.spacing(1.5, 3)};  
  color: rgb(255, 255, 255);
  background-color: ${disabled ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  opacity: ${disabled ? 0.3 : 1};
  margin-top: 0;
  &:hover {
    text-decoration: none;
    background-color: rgba(255,255,255, 0.1);
    color: rgb(255, 255, 255);
  }
`
);

export const ItemMenuStyled2 = styled(Link)<{ disabled?: boolean }>(
  ({ theme, disabled }) => `
  display: flex;
  align-items: center;
  font-size: ${theme.spacing(3.5)};
  text-decoration: none;
  padding: ${theme.spacing(1.5, 3)};  
  color: rgb(255, 255, 255);
  background-color: ${disabled ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  opacity: ${disabled ? 0.3 : 1};
  margin-top: 0;
  &:hover {
    text-decoration: none;
    background-color: rgba(255,255,255, 0.1);
    color: rgb(255, 255, 255);
  }
`
);

export const WrapperIconStyled = styled('div')<{ isActive: boolean }>(
  ({ theme, isActive }) => `
  background-color: ${isActive ? 'rgba(255, 255, 255, 1)' : 'transparent'};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.875rem;
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  color: ${isActive ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 1)'};
`
);

export const styleBtnTransaction = {
  justifyContent: 'center',
  border: '0.5px solid rgba(122, 199, 240, 0.4)',
  borderRadius: '28px',
  padding: '0.5rem 0.75rem',
};

export const styledBtn = {
  width: '40%',
};

export const boxStyleInfoUser = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  width: '100%',
};

export const boxStyleInfoUserAddress = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  paddingRight: 3,
};

export const styledNetwork = {
  display: 'inline',
  width: 'auto',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '110px',
  textOverflow: 'ellipsis',
};

export const IconOpenAccountsStyled = styled('div')(
  ({ theme }) => `
  padding: ${theme.spacing(4.1)} 0 ${theme.spacing(4.1)} ${theme.spacing(1)};
  position: absolute;
  right: 0;
  cursor: pointer;
`
);

export const AccountWrapperStyled = styled('div')(
  ({ theme }) => `
  ${commonStyles}
  backdrop-filter: blur(25px);
  padding: ${theme.spacing(5)};
  border-radius: 25px;
  border: 0.5px solid rgba(122, 199, 240, 0.4);
  height: calc(100% - 60px);
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: rgba(0, 0, 0, 0.2);
  color: rgb(255, 255, 255);
`
);

export const ItemAccountStyled = styled('div')(
  ({ theme }) => `
  ${commonStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing(3.5)} 0;
  border-bottom: 0.5px solid rgba(122, 199, 240, 0.4);
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  margin-top: 0;
  box-shadow: none;

  &:last-child {
    border-bottom: 0.5px solid transparent;
  }
`
);

export const IconDefaultAddressStyled = styled(IconAddress)`
  margin-right: 4px;
`;

export const modalStyled = {
  content: {
    top: '0%',
    left: '0%',
    bottom: '0',
    width: '410px',
    height: '100%',
    border: 'none',
    padding: '1.5rem',
    background: 'transparent',
    overflow: 'hidden',
  },
};

export const IconRemoveAccountStyled = styled(IconTrash)`
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 999;
  width: 18px;
  height: 19px;
`;

export const CopyIconStyled = styled(CopyIcon)`
  width: 12px;
  min-width: 12px;
  height: 12px;
  cursor: pointer;
  margin-left: 8px;
`;

export const BoxAccountActionStyled = styled('div')(
  ({ theme }) => `
  ${commonStyles}
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  padding: ${theme.spacing(2.5)};
  border-radius: 25px;
  border: 0.5px solid rgba(122, 199, 240, 0.4);
  transition: 0.25s ease all;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  color: rgb(255, 255, 255);
  margin-top: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`
);

export const ShareAccountsListStyled = styled('div')(
  ({ theme }) => `
  display:flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
  overflow-y: scroll;
  max-height: 400px;
  margin: ${theme.spacing(3)} 0;
`
);
export const ShareAccountItemStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: ${theme.spacing(2)};
  padding: ${theme.spacing(2)} 0;
`
);

export const styledBalance = {
  overflow: 'hidden',
  maxWidth: '75px',
  textOverflow: 'ellipsis',
};
