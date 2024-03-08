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
  StepStyled,
} from './save-account.styles';

interface ICreatePageAccount {
  address: string;
  network: string;
}

export default function CreatePageAccount({
  address = 'gno:0x98BB81B...5D2e443',
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
  }, [isConnected, router]);

  const { disconnect } = useDisconnect();

  const handleClickCancel = () => {
    disconnect();
  };
  const handleClickNext = () => console.log('_next_');

  const handleChangeNetwork = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueNetwork(e.target.value);
  };

  const handleChangeValueName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueName(e.target.value);
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <DisconnectButtonStyled>
          <WalletButton onClick={() => disconnect()}>Disconnect</WalletButton>
        </DisconnectButtonStyled>

        <WalletTypography className="safe-account_main-header" fontSize={22} fontWeight={600}>
          Create new Safe Account
        </WalletTypography>

        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center">
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  1
                </WalletTypography>
              </StepStyled>
              <WalletTypography component="h2" fontSize={22} fontWeight={600}>
                Select network and name of your Safe Account
              </WalletTypography>
            </Box>

            <Box display="flex" flexDirection="column" mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Name
              </WalletTypography>
            </Box>

            <WalletInput
              placeholder={'Devoted Polygon Safe'}
              value={valueName}
              onChange={handleChangeValueName}
            />

            <Box display={'flex'} flexDirection={'column'} mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Network ID
              </WalletTypography>
            </Box>

            <WalletInput
              placeholder={'Chain ID'}
              value={valueNetwork}
              onChange={handleChangeNetwork}
            />

            <Box mt={1.5}>
              <WalletTypography fontWeight={600}>
                By continuing, you agree to our terms of use and privacy policy.
              </WalletTypography>
            </Box>

            <GridButtonStyled>
              <WalletButton onClick={handleClickCancel}>Cancel</WalletButton>
              <WalletButton onClick={handleClickNext} variant="contained">
                Next
              </WalletButton>
            </GridButtonStyled>
          </WalletPaper>

          {/* --- */}
          <WalletPaper style={styleWalletPaper}>
            <WalletTypography fontSize={22} fontWeight={600}>
              Your Safe Account preview
            </WalletTypography>

            <Box display="flex" justifyContent={'space-between'} mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Wallet
              </WalletTypography>
              <WalletTypography fontSize={17}>{address}</WalletTypography>
            </Box>

            <Box display="flex" justifyContent={'space-between'} mt={1.5}>
              <WalletTypography fontSize={12} fontWeight={600}>
                Network
              </WalletTypography>
              <WalletTypography fontSize={17} fontWeight={600}>
                {network}
              </WalletTypography>
            </Box>
          </WalletPaper>
        </GridContainer>
      </WrapperStyled>
      {/*  */}
    </WalletLayout>
  );
}
