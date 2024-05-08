'use client';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useEffect } from 'react';

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

export default function Home() {
  const { address, chainId } = useWeb3ModalAccount();
  const { data } = useOwnerList(address);
  const { open } = useWeb3Modal();
  const router = useRouter();

  const handleCreateTransaction = async () => {
    if (address) {
      router.push(routes.newTransaction);
    } else {
      await open();
    }
  };

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

  useEffect(() => {
    if (!address) {
      open();
    }
  }, [chainId, address]);

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
      </WrapperStyled>
    </WalletLayout>
  );
}
