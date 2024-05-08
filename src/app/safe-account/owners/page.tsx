'use client';
import * as React from 'react';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { SingleValue } from 'react-select';

import {
  WalletButton,
  WalletInput,
  WalletLayout,
  WalletPaper,
  WalletSelect,
  WalletTypography,
} from '@/ui-kit';
import {
  GridButtonStyled,
  GridContainer,
  PreviewSectionStyled,
  StepStyled,
  WrapperStyled,
  styleWalletPaper,
} from '../safe-account.styles';
import IconDelete from '@/assets/svg/delete.svg';
import IconPlus from '@/assets/svg/plus.svg';
import WalletAlert from '@/ui-kit/wallet-allert';
import routes from '@/app/routes';
import Accordion from '../components/accordion';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { AccountInfo } from '../components/account-info/account-info';
import useActiveOwnerStore from '@/stores/active-owners-store';
import useNetworkStore from '@/stores/networks-store';

import {
  BoxAddressStyled,
  GridOwnerAddressStyled,
  OwnerStylesBtn,
  OwnersListStyled,
  RemoveAddressStyled,
} from './owners.styles';

const SafeAccountOwners = () => {
  const [countNeedCormed, setCountNeedCormed] = React.useState([{ value: 1, label: 1, id: 1 }]);
  const [owners, setOwners] = React.useState<{ name: string; address: string; id: number }[]>([
    { name: '', address: '', id: 1 },
  ]);
  const [needConfirmOwner, setNeedConfirmOwner] = React.useState<number>(1);
  const [account, setAccount] = React.useState('');

  const { address } = useWeb3ModalAccount();
  const { chosenNetwork } = useNetworkStore();
  const router = useRouter();
  const storeOwners = useActiveOwnerStore();

  const handleBack = () => {
    router.push(routes.safeAccountCreate);
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
    storeOwners.setOwners(filledOwners);
    const filterSigners =
      needConfirmOwner > filledOwners.length ? filledOwners.length : needConfirmOwner;
    storeOwners.setNeedConfirmOwner(filterSigners);
    router.push(routes.safeAccountReview);
  };

  const handleAddOwner = () => {
    const newOwnerId = countNeedCormed.length + 1;

    setOwners(prev => [
      ...prev,
      {
        name: '',
        address: '',
        id: newOwnerId,
      },
    ]);

    setCountNeedCormed(prev => [...prev, { id: newOwnerId, label: newOwnerId, value: newOwnerId }]);
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

  const handleChooseAccounConfirm = (
    elem: SingleValue<{
      value: number;
      label: number;
      id: number;
    }>
  ) => {
    elem && setNeedConfirmOwner(elem.label);
  };

  const handleRemodeAddress = (id: number) => {
    setOwners(prevOwners => prevOwners.filter(owner => owner.id !== id));
    setCountNeedCormed(prevCount => prevCount.slice(0, -1));
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
          Add Safe Account
        </WalletTypography>
        <GridContainer>
          <WalletPaper style={styleWalletPaper} minWidth="653px">
            <Box display="flex" alignItems="center">
              <StepStyled>
                <WalletTypography fontSize={18} fontWeight={600} color="#fff">
                  2
                </WalletTypography>
              </StepStyled>
              <Box>
                <WalletTypography component="h2" fontSize={18} fontWeight={600}>
                  Owners and confirmation
                </WalletTypography>
                <WalletTypography
                  fontSize={12}
                  fontWeight={400}
                  color={themeMuiBase.palette.tetriaryGrey}
                >
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
            </Box>
            <Box>
              <OwnersListStyled>
                {owners.map(owner => (
                  <GridOwnerAddressStyled key={owner.id}>
                    <BoxAddressStyled>
                      <WalletInput
                        placeholder={'Owner address'}
                        value={owner.address}
                        onChange={e => handleChangeOwner(e, owner.id, 'address')}
                        label="Owner address"
                        startAdornment
                      />

                      {owners.length !== 1 && (
                        <RemoveAddressStyled onClick={() => handleRemodeAddress(owner.id)}>
                          <IconDelete width="18px" height="19px" />
                        </RemoveAddressStyled>
                      )}
                    </BoxAddressStyled>
                  </GridOwnerAddressStyled>
                ))}
              </OwnersListStyled>
              <Box mt={2} mb={1} display={'flex'} flexDirection={'row-reverse'}>
                <WalletButton onClick={handleAddOwner} variant="text" styles={OwnerStylesBtn}>
                  <IconPlus width="20px" height="21px" color={themeMuiBase.palette.success} />
                  <WalletTypography fontWeight={600} fontSize={14}>
                    Add new owner
                  </WalletTypography>
                </WalletButton>
              </Box>
            </Box>
            <Box pb={5} borderBottom={1} borderColor={themeMuiBase.palette.tetriaryLightGrey}>
              <WalletAlert
                title="Safe(Wallet) mobile owner key (optional)"
                description="Use your mobile phone as an additional owner key"
              />
            </Box>
            <Box mt={3}>
              <WalletTypography component="p" fontSize={22} fontWeight={600}>
                Threshold
              </WalletTypography>
              <Box mt={3}>
                <WalletTypography
                  fontSize={14}
                  fontWeight={400}
                  color={themeMuiBase.palette.tetriaryGrey}
                >
                  Set the owner wallets of your Safe Account and how many need to confirm to execute
                  a valid transaction
                </WalletTypography>
              </Box>
              <Box mt={3} display="flex" alignItems="center">
                <Box mr={3} width={'84px'}>
                  <WalletSelect
                    options={countNeedCormed}
                    defaultValue={countNeedCormed[0]}
                    onChange={handleChooseAccounConfirm}
                  />
                </Box>
                <WalletTypography fontSize={13} fontWeight={600}>
                  out of {owners.length} owner(s)
                </WalletTypography>
              </Box>
            </Box>
            <GridButtonStyled>
              <WalletButton onClick={handleBack} variant="outlined">
                Back
              </WalletButton>
              <WalletButton onClick={handleNext} variant="contained">
                Next
              </WalletButton>
            </GridButtonStyled>
          </WalletPaper>
          <PreviewSectionStyled>
            <AccountInfo account={account} chosenNetwork={chosenNetwork} />
            <Box mt={3}>
              <WalletPaper style={{ ...styleWalletPaper, gap: themeMuiBase.spacing(3) }}>
                <Box mb={3}>
                  <WalletTypography fontSize={17} fontWeight={600}>
                    Safe account creation
                  </WalletTypography>
                </Box>
                <Accordion
                  title="Network fee"
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
