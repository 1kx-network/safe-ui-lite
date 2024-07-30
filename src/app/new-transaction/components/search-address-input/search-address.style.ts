import { styled } from '@mui/system';

import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';

export const WrapperStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    max-height: 325px;
    max-width: 550px;
    border-radius: 16px;
    background: ${theme.palette.white};
    border: 1px solid ${theme.palette.tetriaryLightGrey};
    position: absolute;
    overflow: hidden;
    z-index: 9;

    @media (max-width: 1240px) {
      max-width: 100%;
  }
`
);

export const BodyStyled = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-height: 325px;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(2)} 0;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
`
);

export const ItemStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      align-items: center;
      width: 100%;
      gap: ${theme.spacing(2)};
      padding: ${theme.spacing(2)} ${theme.spacing(2.5)};
      transition: 0.2s ease all;
      cursor: pointer;

      &:hover {
        background-color: ${theme.palette.hover};
      }
  `
);

export const ItemInfoStyled = styled('div')(
  ({ theme }) => `
      display: flex;
      flex-direction: column;
      gap: ${theme.spacing(1)};
  `
);

export const IconAddressStyled = styled(IconDefaultAddress)`
  width: 32px;
  height: 32px;
`;
