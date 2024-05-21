'use client';

import { Box } from '@mui/system';

import { CustomModal } from '@/components';
import { WalletButton, WalletTypography } from '@/ui-kit';

type DeleteTransactionModalProps = {
  txIndex: number;
  txDescription: string;
  onClick: () => void;
  onClose: () => void;
  isOpen: boolean;
};

const DeleteTransactionModal = ({
  txIndex,
  txDescription,
  onClick,
  onClose,
  isOpen,
}: DeleteTransactionModalProps) => {
  const positionLabel = txIndex + 1;

  return (
    <CustomModal closeModal={onClose} isOpen={isOpen}>
      <Box display={'flex'} flexDirection={'column'} gap={6}>
        <WalletTypography fontSize={21} fontWeight={500}>
          Delete from batch?
        </WalletTypography>

        <Box display={'flex'} flexDirection={'column'} gap={3.5}>
          <WalletTypography fontWeight={500}>Transaction #{positionLabel}</WalletTypography>
          <WalletTypography>{`${txDescription} - will be permanently deleted from the batch`}</WalletTypography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={4}>
          <WalletButton onClick={onClose} variant="outlined">
            Back
          </WalletButton>
          <WalletButton onClick={onClick} variant="contained">
            Yes, delete
          </WalletButton>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default DeleteTransactionModal;
