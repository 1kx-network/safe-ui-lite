import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { Box } from '@mui/system';

import { WalletButton, WalletPaper, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import {
  GridStepsStyled,
  IconPlusStyled,
  ItemStepPaperStyled,
  IconMetamaskStyled,
  styledBtn,
  createBtn,
} from './get-started.styles';

interface GetStartedWidgetWidgetProps {
  routes: Record<string, string>;
}

export const GetStartedWidget: React.FC<GetStartedWidgetWidgetProps> = ({ routes }) => {
  const { address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const router = useRouter();

  const handleImportAccount = useCallback(() => {
    if (address) {
      router.push(routes.safeAccountImport);
    } else {
      open();
    }
  }, [address]);

  const handleCreateSafe = useCallback(() => {
    if (address) {
      router.push(routes.safeAccountCreate);
    } else {
      open();
    }
  }, [address]);

  return (
    <GridStepsStyled>
      <ItemStepPaperStyled>
        <WalletPaper>
          <Box display={'flex'} flexDirection={'column'} gap={4}>
            <WalletTypography fontSize={22} fontWeight={600}>
              Get Started
            </WalletTypography>
            <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
              The most trusted decentralized custody protocol and collective asset management
              platform
            </WalletTypography>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={4}>
            <WalletButton variant="outlined" styles={styledBtn} onClick={handleImportAccount}>
              <IconPlusStyled />
              Add Existing Account
            </WalletButton>
            <WalletButton variant="contained" styles={createBtn} onClick={handleCreateSafe}>
              <IconMetamaskStyled />
              Create Safe Account
            </WalletButton>
          </Box>
        </WalletPaper>
      </ItemStepPaperStyled>
    </GridStepsStyled>
  );
};
