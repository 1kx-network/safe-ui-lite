import { useState } from 'react';
import { SingleValue } from 'react-select';
import { Box } from '@mui/system';

import { WalletButton, WalletPaper, WalletSelect, WalletTypography } from '@/ui-kit';
import { IOptions, options } from '../../fixtures';
import { styledHeader, styledPaper } from '../../entry-page.styles';
import { TotalyBoxStyled, ButtonsGridStyled } from './overview.styles';

export const Overview = () => {
  const [value, setValue] = useState<SingleValue<IOptions> | null>(options[0]);

  const handleChangeSelect = (elem: SingleValue<IOptions>) => {
    setValue(elem);
  };

  const handleReceive = () => {};
  const handleSend = () => {};

  return (
    <>
      <WalletTypography style={styledHeader}>Overview</WalletTypography>
      <WalletPaper style={styledPaper}>
        <WalletTypography style={styledHeader}>Total asset value</WalletTypography>

        <TotalyBoxStyled>
          <WalletTypography style={styledHeader}>
            {value?.count} {value?.label}
          </WalletTypography>
          <Box width={'223px'}>
            <WalletSelect
              options={options}
              defaultValue={options[0]}
              onChange={handleChangeSelect}
            />
          </Box>
        </TotalyBoxStyled>
        <WalletTypography fontSize={17} fontWeight={600}>
          {value?.count} tokens
        </WalletTypography>
        <ButtonsGridStyled>
          <WalletButton onClick={handleSend} variant="contained">
            Send
          </WalletButton>
          <WalletButton onClick={handleReceive} variant="outlined">
            Receive
          </WalletButton>
        </ButtonsGridStyled>
      </WalletPaper>
    </>
  );
};
