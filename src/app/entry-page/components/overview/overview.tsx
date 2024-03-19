import { useState } from 'react';
import { SingleValue } from 'react-select';
import { Box } from '@mui/system';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  WalletButton,
  WalletPaper,
  WalletSelect as WalletSelectUi,
  WalletTypography,
} from '@/ui-kit';
import { IOptions, options } from '../../fixtures';
import { styledHeader, styledPaper } from '../../entry-page.styles';
import routes from '@/app/routes';

import { TotalyBoxStyled, ButtonsGridStyled } from './overview.styles';

const WalletSelect = dynamic(
  () => import('@/ui-kit/wallet-select/index').then(module => module.WalletSelect),
  {
    ssr: false,
    loading: () => <WalletSelectUi />,
  }
);

export const Overview = () => {
  const [value, setValue] = useState<SingleValue<IOptions> | null>(options[0]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const safeAddress = searchParams.get('account');
  const network = searchParams.get('network');

  const handleChangeSelect = (elem: SingleValue<IOptions>) => {
    setValue(elem);
  };

  const handleReceive = () => {};
  const handleSend = () => {
    router.push(
      `${routes.newTransaction}?network=${network}&address=${encodeURIComponent(String(safeAddress))}`
    );
  };

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
