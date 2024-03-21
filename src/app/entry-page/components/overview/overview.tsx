'use client';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { Box } from '@mui/system';
import dynamic from 'next/dynamic';
import * as utils from 'ethers';
import { useRouter } from 'next/navigation';

import {
  WalletButton,
  WalletPaper,
  WalletSelect as WalletSelectUi,
  WalletTypography,
} from '@/ui-kit';
import { IOptions, options } from '../../fixtures';
import { styledHeader, styledPaper } from '../../entry-page.styles';
import routes from '@/app/routes';
import useSafeStore from '@/stores/safe-store';

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
  const [balanceAccount, setBalanceAccount] = useState('0');
  const router = useRouter();

  const { safeSdk } = useSafeStore();

  useEffect(() => {
    if (safeSdk) {
      const pendingBalance = async () => {
        const balanceAccount = await safeSdk.getBalance();
        const parceBalance = utils.formatEther(String(balanceAccount));

        setBalanceAccount(parceBalance);
      };

      pendingBalance();
    }
  }, [safeSdk]);

  const handleChangeSelect = (elem: SingleValue<IOptions>) => {
    setValue(elem);
  };

  const handleReceive = () => {};

  const handleSend = () => {
    router.push(routes.newTransaction);
  };

  return (
    <>
      <WalletTypography style={styledHeader}>Overview</WalletTypography>
      <WalletPaper style={styledPaper}>
        <WalletTypography style={styledHeader}>Total asset value</WalletTypography>

        <TotalyBoxStyled>
          <WalletTypography style={styledHeader}>
            {balanceAccount} {value?.label}
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
          {balanceAccount} tokens
        </WalletTypography>
        <ButtonsGridStyled>
          <WalletButton
            onClick={handleSend}
            variant="contained"
            //  disabled={!!balanceAccount.length}
          >
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
