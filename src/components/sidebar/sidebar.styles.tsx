import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/system';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  width: 246px;
  min-width: 178px;
  margin-right: ${theme.spacing(5)};
  overflow: hidden;
  height: 100%;
  border-radius: 0 0 0.875rem 0.875rem;
`
);

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
  `
);

export const ItemMenuStyled = styled(Link)(
  ({ theme }) => `
	border: 1px solid transparent;
	display: flex;
  align-items: center;
	font-size: ${theme.spacing(3.5)};
	text-decoration: none;
	padding: ${theme.spacing(1.5, 3)};  
	color: ${theme.palette.dark};
  border-radius: 0.5rem;

 	&:hover {
    text-decoration: none;
    background-color: ${theme.palette.darkLight};
	}
`
);

export const WrapperIconStyled = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.dark};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.875rem;
  width: ${theme.spacing(7.5)};
  height: ${theme.spacing(7.5)};
`
);

export const styleBtnTransaction = {
  justifyContent: 'center',
  border: '2px solid #020303',
  borderRadius: '28px',
  padding: '0.719rem 0.75rem',
};

export const boxStyleInfoUser = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};
