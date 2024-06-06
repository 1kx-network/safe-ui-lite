'use client';
import { useCallback, useEffect } from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

import { WalletButton, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { useOwnerList } from '@/queries/safe-accounts';
import { safeNetworksObj } from '@/constants/networks';

import {
  GridStepsStyled,
  IconPlusStyled,
  ItemStepPaperStyled,
  WrapperStyled,
  styledBtn,
} from './home.styles';
import routes from './routes';
import AddModule from './add-module/add-module';

export default function Home() {
  const { address, chainId } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  useEffect(() => {
    const walletIsConnected: string | null =
      typeof window !== 'undefined' ? localStorage.getItem('@w3m/wallet_id') : null;
    if (walletIsConnected) return;

    open();
  }, [address, walletProvider]);

  useEffect(() => {
    if (chainId && data && data.length) {
      const fetchedList = data[chainId];
      const localList = localStorage.getItem('createdSafes');
      const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;
      if (fetchedList === undefined || fetchedList.concat(localListParsed[chainId]).length === 0) {
        router.push(routes.safeAccountCreate);
      }
    }
  }, [data, chainId]);

  const handleCreateTransaction = useCallback(() => {
    if (address) {
      router.push(routes.newTransactionSendToken);
    } else {
      open();
    }
  }, [address]);

  return (
    <WalletLayout>
      <WrapperStyled>
        <GridStepsStyled>
          <ItemStepPaperStyled>
            <WalletPaper>
              <IconPlusStyled />
              <Box display={'flex'} flexDirection={'column'} gap={4}>
                <WalletTypography fontSize={22} fontWeight={600}>
                  Create transaction
                </WalletTypography>
                <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                  Simply send funds, add a new signer or swap tokens through a safe app.
                </WalletTypography>
              </Box>
              <WalletButton variant="outlined" styles={styledBtn} onClick={handleCreateTransaction}>
                Create Transaction
              </WalletButton>
            </WalletPaper>
          </ItemStepPaperStyled>
        </GridStepsStyled>
        <AddModule />
      </WrapperStyled>
    </WalletLayout>
  );
}
