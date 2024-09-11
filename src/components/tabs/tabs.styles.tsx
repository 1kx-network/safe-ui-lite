import { styled } from '@mui/system';
import Link from 'next/link';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
  
  margin-bottom: ${theme.spacing(4)};
  width: 100%;
  border-bottom: 2px solid rgba(255,255,255, 0.2);
  display: flex;
  gap: ${theme.spacing(6)};
  padding: 0 10%;
  padding-bottom: ${theme.spacing(6)};

`
);

export const ItemMenuStyled = styled(Link)<{ $isactive: boolean }>(
  ({ $isactive }) => `
    color: ${$isactive ? 'white' : 'rgba(255,255,255, 0.5)'};
    position: relative; 
    font-size: 18px;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;

    &:hover {
        text-decoration: none;
        color: white;
    }

    &:link, &:visited, &:active {
        color: ${$isactive ? 'white' : 'rgba(255,255,255, 0.5)'};
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -24.5px; 
      left: 0;
      width: 100%;
      height: 2px;
      border-bottom: 2px solid ${$isactive ? 'white' : 'transparent'};
    }
`
);
