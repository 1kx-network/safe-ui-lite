import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/system';

import IconTrash from '@/assets/svg/delete.svg';
import CopyIcon from '@/assets/svg/copy.svg';
import IconAddress from '@/assets/svg/defult-icon-address.svg';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  min-width: 246px;
  width: 246px;
  margin-right: ${theme.spacing(5)};
  overflow: hidden;
  height: 100%;
  padding: 1.5rem 0;
  border-radius: 0 0 0.875rem 0.875rem;
`
);

export const BodyMainInfoStyled = styled('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0 0 0.875rem 0.875rem;
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
  border-radius: 0.875rem 0.875rem 0 0;
  background-color: ${theme.palette.white}
`
);

export const MenuStyled = styled('div')(
  ({ theme }) => `
  display: flex;
	flex-direction: column;
	gap: 1px;
	width: 100%;
	padding: ${theme.spacing(5)};
	background-color: ${theme.palette.lightSecondary};
	border-radus: ${theme.spacing(0, 0, 3.5, 3.5)};
	gap: 1.25rem;
	font-weight: 600; 
	height: 100%;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none; 
  `
);

export const ItemMenuStyled = styled(Link)<{ disabled?: boolean }>(
  ({ theme, disabled }) => `
	border: 1px solid transparent;
	display: flex;
  align-items: center;
	font-size: ${theme.spacing(3.5)};
	text-decoration: none;
	padding: ${theme.spacing(1.5, 3)};  
	color: ${theme.palette.textDark};
  border-radius: 0.5rem;
  background-color: ${disabled ? theme.palette.textDarkLight : 'transparent'};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  opacity: ${disabled ? 0.3 : 1};
 	&:hover {
    text-decoration: none;
    background-color: ${theme.palette.textDarkLight};
	}
`
);

export const WrapperIconStyled = styled('div')<{ isActive: boolean }>(
  ({ theme, isActive }) => `
  background-color: ${isActive ? theme.palette.textDark : 'transparent'};
  border: 1px solid  ${theme.palette.textDark};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.875rem;
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  color: ${isActive ? theme.palette.white : theme.palette.textDark};
`
);

export const styleBtnTransaction = {
  justifyContent: 'center',
  border: '2px solid #020303',
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
  background-color: #FFFFFFB5;
  backdrop-filter: blur(25px);
  padding: ${theme.spacing(5)};
  border-radius:  0 0 0.625rem 0.625rem;
  height: calc(100% - 60px);
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
`
);

export const ItemAccountStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing(3.5)} 0;
  border-bottom: 0.5px solid ${theme.palette.tetriaryLightGrey};
  cursor: pointer;

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
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  padding: ${theme.spacing(2.5)};
  border-radius: 8px;
  transition: 0.25s ease all;
  cursor: pointer;

  &:hover {
    background-color: ${theme.palette.hover};
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
