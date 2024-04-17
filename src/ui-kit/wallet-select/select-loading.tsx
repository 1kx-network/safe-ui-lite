import { Box } from '@mui/system';

import IconLoading from '@/assets/svg/loader.svg';
import IconArrowDown from '@/assets/svg/arrow_down.svg';

import { WrapperStyled } from './select-loading.styles';

export const LoadingSelect = () => {
  return (
    <WrapperStyled>
      <IconLoading />
      <Box display={'flex'} alignItems={'center'} pb={'5px'}>
        <IconArrowDown color="#777F88" />
      </Box>
    </WrapperStyled>
  );
};
