import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { Box } from '@mui/system';

import { WalletButton, WalletPaper, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';

import {
  GridStepsStyled,
  IconPlusStyled,
  ItemStepPaperStyled,
  styledBtn,
} from './create-transaction.styles';

interface CreateTransactionWidgetProps {
  routes: Record<string, string>;
}

export const CreateTransactionWidget: React.FC<CreateTransactionWidgetProps> = ({ routes }) => {
  const { address } = useWeb3ModalAccount();
  const router = useRouter();

  const handleCreateTransaction = useCallback(() => {
    if (address) {
      router.push(routes.newTransactionSendToken);
    } else {
      open();
    }
  }, [address]);

  return (
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
  );
};
