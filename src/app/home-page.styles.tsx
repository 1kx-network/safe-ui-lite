import { styled } from '@mui/system';

import SkeletonSvg from '@/assets/svg/skeleton.svg';
export const MainContainerStyled = styled('main')(
  () => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 135px;
    height: 100%;
`
);

export const ImageStyled = styled(SkeletonSvg)(
  () => `
    margin-top: 44px;
`
);
