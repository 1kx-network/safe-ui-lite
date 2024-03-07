import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/system';

export const WrapperStyled = styled('div')`
  width: 246px;
  min-width: 178px;
  margin-right: 1.25rem;
  overflow: hidden;
  height: 100%;
  border-radius: 0 0 0.875rem 0.875rem;
`;

export const ImgUserStyled = styled(Image)`
  border-radius: 50%;
  margin-right: 0.875rem;
  object-fit: cover;
`;

export const InfoUserStyled = styled('div')`
  display: flex;
  align-items: center;
  padding: 0.625rem 0.875rem;
  border-radius: 0.875rem 0.875rem 0 0;
  background-color: rgb(255, 255, 255);
`;

export const MenuStyled = styled('div')(
  ({ theme }) => `
  display: flex;
	flex-direction: column;
	gap: 1px;
	width: 100%;
	padding: 1.25rem;
	background-color: rgba(255, 255, 255, 0.50);
	border-radus: 0 0 0.875rem 0.875rem;
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
	font-size: 14px;
	text-decoration: none;
	padding: 0.375rem 0.75rem;
	border-radius: 1.75rem;
	color: #020303;
  border-radius: 0.5rem;

 	&:hover {
    background-color: #02030305;
		text-decoration: none;
	}
`
);

export const boxStyleInfoUser = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

export const WrapperIconStyled = styled('div')`
  background-color: #020303;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.875rem;
  width: 1.875rem;
  height: 1.875rem;
`;
