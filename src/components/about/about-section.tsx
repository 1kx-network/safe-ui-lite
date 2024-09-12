import React from 'react';
import { Box } from '@mui/system';
import { WalletPaper, WalletTypography } from '@/ui-kit';
import { ItemStepPaperStyled } from '../../app/home.styles';
import Link from 'next/link';
import { themeMuiBase } from '../../assets/styles/theme-mui';

const textColor = 'rgba(255, 255, 255, 0.87)';

export default function AboutSection() {
  return (
    <Box marginBottom="16px">
      <ItemStepPaperStyled>
        <WalletPaper>
          <Box display={'flex'} flexDirection={'column'} gap={4}>
            <WalletTypography fontSize={22} fontWeight={600} color={'white'}>
              About
            </WalletTypography>
            <WalletTypography color={textColor}>
              zkSafe is a Safe module that lets owners approve transactions without revealing their
              identities, enhancing privacy for multisig users.
            </WalletTypography>
            <WalletTypography color={textColor}>
              zkSafe enables Safe owners to sign transactions together while keeping individual
              signers anonymous. The module only verifies:
            </WalletTypography>
            <Box component="ul" color={textColor} sx={{ pl: 4 }}>
              <li>The minimum required number of valid transaction signatures</li>
              <li>Each signature being unique (no duplicate signatures to meet the threshold)</li>
              <li>Each signature being from a Safe owner</li>
            </Box>
            <WalletTypography color={textColor}>
              With a valid proof accompanying a transaction, the zkSafe module can execute it
              securely.
            </WalletTypography>
            <Box display={'flex'} gap={2}>
              <Link
                href="https://blog.example.com/zksafe"
                style={{ color: themeMuiBase.palette.blue }}
              >
                Read Blog Post
              </Link>
              <Link
                href="https://github.com/example/zksafe"
                style={{ color: themeMuiBase.palette.blue }}
              >
                Visit GitHub
              </Link>
            </Box>
          </Box>
        </WalletPaper>
      </ItemStepPaperStyled>
    </Box>
  );
}
