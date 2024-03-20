'use client';
import * as React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WalletButton, WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import {
  GridButtonStyled,
  GridContainer,
  PreviewSectionStyled,
  StepStyled,
  WrapperStyled,
  styleWalletPaper,
} from '../safe-account.styles';
import QrCodeIcon from '@/assets/svg/qr_code.svg';
import WalletAlert from '@/ui-kit/wallet-allert';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { formattedLabel } from '@/utils/foramtters';
import { useNetwork } from '@/hooks/useNetwork';

import { OwnerStylesBtn } from './owners.styles';
import Accordion from './accordion';
import routes from '@/app/routes';

const SafeAccountOwners = () => {
  const { address } = useWeb3ModalAccount();

  const [account, setAccount] = React.useState('');

  const network = useNetwork();
  const router = useRouter();
  const [owners, setOwners] = React.useState<{ name: string; address: string; id: number }[]>([]);

  const networkName = network?.name.toString();

  const { deploySafe } = useSafeSdk();
  const handleBack = () => {
    router.back();
  };

  React.useEffect(() => {
    if (address) {
      setOwners([
        {
          name: '',
          address: address.toString(),
          id: 1,
        },
      ]);
      setAccount(address.toString());
    }
  }, [address]);

  const handleNext = async () => {
    const filledOwners = owners.filter(owner => owner.address).map(owner => owner.address);
    await deploySafe(filledOwners, filledOwners.length)
      .then(() => router.push(routes.entryPage))
      .catch(() => console.log('Something error with create account'));
  };

  const handleAddOwner = () => {
    setOwners(prev => [
      ...prev,
      {
        name: '',
        address: '',
        id: prev.length + 1,
      },
    ]);
  };

  const handleChangeOwner = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: 'name' | 'address'
  ) => {
    const value = e.target.value;
    const updatedOwners = owners.map(owner => {
      if (owner.id === id) {
        return { ...owner, [field]: value };
      }
      return owner;
    });
    setOwners(updatedOwners);
  };
  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletTypography
          className="safe-account_main-header"
          fontSize={22}
          fontWeight={600}
          component="h1"
        >
          Create new Safe Account
        </WalletTypography>
        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center" pb={5} sx={{ borderBottom: '1px solid' }}>
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  2
                </WalletTypography>
              </StepStyled>
              <Box>
                <WalletTypography component="h2" fontSize={22} fontWeight={600}>
                  Owners and confirmation
                </WalletTypography>
                <WalletTypography fontSize={12} fontWeight={400}>
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
            </Box>
            <Box mt={5}>
              {owners.map(owner => (
                <GridContainer key={owner.id}>
                  <WalletInput
                    placeholder={'Owner name'}
                    value={owner.name}
                    onChange={e => handleChangeOwner(e, owner.id, 'name')}
                    label="Owner name"
                  />
                  <WalletInput
                    placeholder={'Owner address'}
                    value={owner.address}
                    onChange={e => handleChangeOwner(e, owner.id, 'address')}
                    label="Owner address"
                    endAdornment={<QrCodeIcon />}
                  />
                </GridContainer>
              ))}
              <Box maxWidth="120px" mt={5}>
                <WalletButton onClick={handleAddOwner} variant="text" styles={OwnerStylesBtn}>
                  + Add new owner
                </WalletButton>
              </Box>
            </Box>
            <Box pb={5} borderBottom={1}>
              <WalletAlert
                title="Safe(Wallet) mobile owner key (optional)"
                description="Use your mobile phone as an additional owner key"
              />
            </Box>
            <Box mt={5}>
              <WalletTypography component="p" fontSize={22} fontWeight={600}>
                Threshold
              </WalletTypography>
              <Box mt={3}>
                <WalletTypography>
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
              <Box mt={3} display="flex" alignItems="center">
                <Box mr={3} maxWidth={82}>
                  <WalletInput value={owners.length} onChange={() => console.log} />
                </Box>
                <WalletTypography fontSize={13} fontWeight={600}>
                  out of {owners.length} owners
                </WalletTypography>
              </Box>
            </Box>
            <GridButtonStyled>
              <WalletButton onClick={handleBack}>Cancel</WalletButton>
              <WalletButton onClick={handleNext} variant="contained">
                Next
              </WalletButton>
            </GridButtonStyled>
          </WalletPaper>
          <PreviewSectionStyled>
            <WalletPaper style={styleWalletPaper}>
              <WalletTypography fontSize={17} fontWeight={600}>
                Your Safe Account preview
              </WalletTypography>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Wallet
                </WalletTypography>
                {account && (
                  <WalletTypography fontSize={17}>
                    {networkName?.substring(0, 3)}:{formattedLabel(account)}
                  </WalletTypography>
                )}
              </Box>

              <Box display="flex" justifyContent={'space-between'} mt={1.5}>
                <WalletTypography fontSize={12} fontWeight={600}>
                  Network
                </WalletTypography>
                <WalletTypography fontSize={17} fontWeight={600} textTransform="capitalize">
                  {networkName}
                </WalletTypography>
              </Box>
            </WalletPaper>
            <Box mt={3}>
              <WalletPaper style={styleWalletPaper}>
                <Box mb={3}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Safe account creation
                  </WalletTypography>
                </Box>
                <Accordion
                  title="Network fee"
                  initialOpen
                  description="We recommend using a threshold higher than one to prevent losing access to your safe account in case an owner key is lost or compromised."
                />
                <Accordion title="Address book privacy" description="Some info" />
              </WalletPaper>
            </Box>
            <Box mt={3}>
              <WalletPaper style={styleWalletPaper}>
                <Box mb={3}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Safe account setup
                  </WalletTypography>
                </Box>
                <Accordion
                  title="1/1 policy"
                  description="We recommend using a threshold higher than one to prevent losing access to your safe account in case an owner key is lost or compromised."
                />
              </WalletPaper>
            </Box>
          </PreviewSectionStyled>
        </GridContainer>
      </WrapperStyled>
    </WalletLayout>
  );
};

export default SafeAccountOwners;
