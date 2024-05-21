'use client';

import { Box, styled } from '@mui/system';

import useTransactionLibrary from '../../hooks/transactionLibrary';
import { WalletTypography } from '@/ui-kit';

const ChecksumWarning = () => {
  const { hasChecksumWarning, setHasChecksumWarning } = useTransactionLibrary();

  if (!hasChecksumWarning) {
    return null;
  }

  return (
    <ChecksumWrapperStyled>
      <Box onClick={() => setHasChecksumWarning(false)}>
        <WalletTypography>
          This batch contains some changed properties since you saved or downloaded it
        </WalletTypography>
      </Box>
    </ChecksumWrapperStyled>
  );
};

const ChecksumWrapperStyled = styled('div')`
  position: fixed;
  width: 100%;
  z-index: 10;
  background-color: transparent;
  height: 70px;
`;

export default ChecksumWarning;
