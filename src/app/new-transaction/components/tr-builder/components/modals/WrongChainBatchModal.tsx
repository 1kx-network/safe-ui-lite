'use client';
import { Box, styled } from '@mui/system';

import IconWarning from '@/assets/svg/infoIcon.svg';
import { WalletButton, WalletTypography } from '@/ui-kit';
import { CustomModal } from '@/components';

type WrongChainBatchModalProps = {
  onClick: () => void;
  onClose: () => void;
  isOpen: boolean;
  fileChainId: string | undefined;
};

const WrongChainBatchModal = ({
  onClick,
  onClose,
  isOpen,
  fileChainId,
}: WrongChainBatchModalProps) => {
  return (
    <CustomModal closeModal={onClose} isOpen={isOpen}>
      <StyledModalBodyWrapper>
        <Box display={'flex'} gap={2}>
          <IconWarning width="21px" height="21px" color={'tomato'} />
          <StyledWarningLabel>Warning</StyledWarningLabel>
        </Box>
        <WalletTypography textAlign="center">
          This batch is from another Chain
          {fileChainId ? ` (${fileChainId})` : ''}!
        </WalletTypography>

        <StyleButtonContainer
          display="flex"
          alignItems="center"
          justifyContent="center"
          maxWidth={'450px'}
        >
          <WalletButton onClick={onClick} variant="contained">
            Ok, I understand
          </WalletButton>
        </StyleButtonContainer>
      </StyledModalBodyWrapper>
    </CustomModal>
  );
};

export default WrongChainBatchModal;

const StyledWarningLabel = styled('span')`
  margin-left: 8px;
`;

const StyledModalBodyWrapper = styled('div')`
  padding: 24px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StyleButtonContainer = styled(Box)`
  margin-top: 24px;
`;
