'use client';
import { useSearchParams } from 'next/navigation';
import { Box } from '@mui/system';

import { WalletLayout, WalletTypography } from '@/ui-kit';
import { CustomTabs } from '@/components';

import { TrxBuilder } from './components/tr-builder';
import { SendTokens } from './components/send-tokens/send-tokens';
import { WrapperStyled } from './new-transaction.styles';
import { tabsMenu } from './fixutres';

export default function NewTransaction() {
  const searchParams = useSearchParams();
  const isSendTokens = searchParams.has('send-tokens');
  const isTrxBuilder = searchParams.has('tr-builder');
  const isDefault = !isTrxBuilder && !isSendTokens;

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600} component="h2">
            New Transaction
          </WalletTypography>
        </Box>

        <CustomTabs tabs={tabsMenu} />

        {(isSendTokens || isDefault) && <SendTokens />}
        {isTrxBuilder && <TrxBuilder />}
      </WrapperStyled>
    </WalletLayout>
  );
}
