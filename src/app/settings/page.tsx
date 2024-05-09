'use client';
import { useSearchParams } from 'next/navigation';
import { Box } from '@mui/system';

import { WalletLayout, WalletTypography } from '@/ui-kit';
import { CustomTabs } from '@/components';

import { NetworksSettings } from './environment-variables';
import { AddVariables } from './add-variables';
import { SettingsOwner } from './owners-list';
import { settingsMenu } from './fixutres';
import { WrapperStyled } from './settings.styles';

function Settings() {
  const searchParams = useSearchParams();
  const isEnvironmentVariables = searchParams.has('environment-variables');
  const isAddVariables = searchParams.has('add-variables');
  const isOwnersList = searchParams.has('owners-list');
  const isDefault = !isEnvironmentVariables && !isAddVariables && !isOwnersList;

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600} component="h2">
            Settings
          </WalletTypography>
        </Box>

        <CustomTabs tabs={settingsMenu} />
        {isEnvironmentVariables && <NetworksSettings />}
        {isAddVariables && <AddVariables />}
        {(isOwnersList || isDefault) && <SettingsOwner />}
      </WrapperStyled>
    </WalletLayout>
  );
}

export default Settings;
