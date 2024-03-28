import { Box } from '@mui/system';

import { WalletPaper, WalletTypography } from '@/ui-kit';
import { tokenList } from '../../fixtures';

import { TokenItemStyled, IconStyled, TokenListStyled, styledPaper } from './tokens-list.styles';

export const TokenList = () => {
  return (
    <WalletPaper style={styledPaper}>
      <WalletTypography fontWeight={600} fontSize={17}>
        Tokens
      </WalletTypography>
      <TokenListStyled>
        {tokenList.map(elem => {
          const IconToken = elem.icon;

          return (
            <TokenItemStyled key={elem.id}>
              <Box display={'flex'} alignItems={'center'}>
                <IconStyled>
                  <IconToken />
                </IconStyled>
                <WalletTypography fontWeight={600} fontSize={17}>
                  {elem.value}
                </WalletTypography>
              </Box>
              <WalletTypography fontWeight={600} fontSize={17}>
                {elem?.count} {elem.label}
              </WalletTypography>
            </TokenItemStyled>
          );
        })}
      </TokenListStyled>
    </WalletPaper>
  );
};
