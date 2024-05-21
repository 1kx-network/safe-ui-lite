'use client';

import { Box } from '@mui/system';

import { WalletButton, WalletTypography } from '@/ui-kit';
import { CustomModal } from '@/components';

type DeleteBatchModalProps = {
  count: number;
  onClick: () => void;
  onClose: () => void;
  isOpen: boolean;
};

const DeleteBatchModal = ({ count, onClick, onClose, isOpen }: DeleteBatchModalProps) => {
  return (
    <CustomModal closeModal={onClose} isOpen={isOpen}>
      <Box display={'flex'} flexDirection={'column'} gap={6}>
        <WalletTypography fontSize={21} fontWeight={500}>
          Clear transaction list?
        </WalletTypography>

        <Box display={'flex'} alignItems={'center'} gap={3.5}>
          <WalletTypography fontWeight={500}>Count: {count}</WalletTypography>

          <WalletTypography>
            {`Transaction${count > 1 ? 's' : ''}`} will be cleared
          </WalletTypography>
        </Box>
        <Box display={'flex'} alignItems={'center'} gap={4}>
          <WalletButton onClick={onClose} variant="outlined">
            Back
          </WalletButton>
          <WalletButton onClick={onClick} variant="contained">
            Yes, clear
          </WalletButton>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default DeleteBatchModal;
