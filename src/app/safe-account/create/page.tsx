'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useDisconnect, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useRouter } from 'next/navigation';

import { WalletTypography, WalletPaper, WalletLayout, WalletButton, WalletInput } from '@/ui-kit';
import routes from '@/app/routes';

import {
  GridContainer,
  GridButtonStyled,
  WrapperStyled,
  styleWalletPaper,
  DisconnectButtonStyled,
} from './save-account.styles';

interface ICreatePageAccount {
  address: string;
  network: string;
}

export default function CreatePageAccount({
  address = '0x98BB81Bda45af3Ef8FA0C1E636CCEb3085D2e443',
  network = 'Polygon',
}: ICreatePageAccount) {
  const [valueNetwork, setValueNetwork] = useState<null | string>(null);
  const [valueName, setValueName] = useState<null | string>(null);

  const { isConnected } = useWeb3ModalAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push(routes.home);
    }
  }, [isConnected]);

  const { disconnect } = useDisconnect();

  const handleClickCancel = () => console.log('_cancel_');
  const handleClickNext = () => console.log('_next_');

  const handleChangeNetwork = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueNetwork(e.target.value);
  };

  const handleChangeValueName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueName(e.target.value);
  };

  return (
      <WalletLayout>
        <WrapperStyled>
          <DisconnectButtonStyled>
            <WalletButton onClick={() => disconnect()}>Disconnect</WalletButton>
          </DisconnectButtonStyled>

          <WalletTypography className="safe-account_main-header">
            Create new Safe Account
          </WalletTypography>

          <GridContainer>
            <WalletPaper style={styleWalletPaper}>
              <WalletTypography component="h2">
                Select network and name of your Safe Account
              </WalletTypography>

              <Box display={'flex'} flexDirection={'column'}>
                <WalletTypography fontSize={12}>Name</WalletTypography>
                <WalletTypography fontSize={11}>Devoted Polygon Safe</WalletTypography>
              </Box>

              <WalletInput
                placeholder={'Value Name'}
                value={valueName}
                onChange={handleChangeValueName}
              />

              <Box display={'flex'} flexDirection={'column'}>
                <WalletTypography fontSize={12}>Network ID</WalletTypography>
                <WalletTypography fontSize={11}>Devoted Polygon Safe</WalletTypography>
              </Box>

              <WalletInput
                placeholder={'123412412'}
                value={valueNetwork}
                onChange={handleChangeNetwork}
              />

              <WalletTypography fontSize={12}>
                By continuing, you agree to our terms of use and privacy policy.
              </WalletTypography>

              <GridButtonStyled>
                <WalletButton onClick={handleClickCancel}>Cancel</WalletButton>
                <WalletButton onClick={handleClickNext}>Next</WalletButton>
              </GridButtonStyled>
            </WalletPaper>

            {/* --- */}
            <WalletPaper style={styleWalletPaper}>
              <WalletTypography>Your Safe Account preview</WalletTypography>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12}>Address</WalletTypography>
                <WalletTypography fontSize={17}>{address}</WalletTypography>
              </Box>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12}>Network</WalletTypography>
                <WalletTypography fontSize={17}>{network}</WalletTypography>
              </Box>
            </WalletPaper>
          </GridContainer>
        </WrapperStyled>
        {/*  */}
      </WalletLayout>
  );
}
