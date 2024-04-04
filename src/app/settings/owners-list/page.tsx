'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { CSVLink } from 'react-csv';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { SingleValue } from 'react-select';
import * as utils from 'ethers';

import {
  WalletButton,
  WalletInput,
  WalletLayout,
  WalletPaper,
  WalletSelect,
  WalletTypography,
} from '@/ui-kit';
import { useSafeSdk } from '@/hooks/useSafeSdk';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { useNetwork } from '@/hooks/useNetwork';
import InfoIcon from '@/assets/svg/infoIcon.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconDelete from '@/assets/svg/delete.svg';
import { networks } from '@/context/networks';
import { CustomTabs } from '@/components';
import useActiveSafeAddress from '@/stores/safe-address-store';
import useSafeStore from '@/stores/safe-store';

import {
  BoxStyled,
  WrapperStyled,
  styledBtn,
  GridBtnStyled,
  ConfirmationsStyled,
  BodyAccountsStyled,
  styledCSV,
  BodyListAccountsStyled,
} from './owners-list.styles';
import { ListAccount } from './components/list-account/list-account';
import { settingsMenu } from './fixutres';

interface Owner {
  id: number;
  address: string;
}

const selectDef = {
  value: 1,
  label: 1,
  id: 1,
};

export default function SettingsOwner() {
  const network = useNetwork();
  const { chainId } = useWeb3ModalAccount();
  const { removeAddress, addAddress, changeThresholdTx, getInfoByAccount } = useSafeSdk();
  const { safeSdk } = useSafeStore();
  const {
    needConfirmOwner,
    safeAccountOwners,
    contractNonce,
    contractVersion,
    isLoading,

    setIsLoading,
    setSafeAccountOwners,
    setNeedConfirmOwner,
    setBalanceAccount,
    setContractNonce,
    setContractVersion,
  } = useActiveSafeAddress();

  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
  const [countNeedCorfimLocal, setNeedConfirmLocal] = useState([selectDef]);
  const [defCountConfirm, setDefCountConfirm] = useState([
    { id: needConfirmOwner, label: needConfirmOwner, value: needConfirmOwner },
  ]);
  const [newOwners, setNewOwners] = useState<Owner[] | null>([]);
  const [newCountNeedConfirm, setNewCountNeedConfirm] = useState(needConfirmOwner);
  const [linkOnScan, setLinkOnScan] = useState<string>('');

  const countOwners = newOwners
    ? newOwners.length + safeAccountOwners.length
    : safeAccountOwners.length;

  useEffect(() => {
    const newCountNeedCormed = Array.from({ length: countOwners }, (_, index) => ({
      id: index + 1,
      label: index + 1,
      value: index + 1,
    }));

    setNeedConfirmLocal(newCountNeedCormed);
  }, [countOwners, isLoading]);

  useEffect(() => {
    setDefCountConfirm([
      { id: needConfirmOwner, label: needConfirmOwner, value: needConfirmOwner },
    ]);
  }, [needConfirmOwner]);

  useEffect(() => {
    if (network && chainId) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        const updateLink = linkOnScan;
        setLinkOnScan(updateLink);
      }
    }
  }, [network, chainId, safeAccountOwners]);

  const handleGetCSV = () => {
    if (network && chainId) {
      const networkName = network.name.toString();

      setCsvData([['Address', 'Network'], ...safeAccountOwners.map(owner => [owner, networkName])]);
    }
  };

  const handleAddOwner = () => {
    if (!newOwners || newOwners.length === 0) {
      setNewOwners([{ id: 1, address: '' }]);
      return;
    }

    const newOwnerId = newOwners.length + 1;
    setNewOwners(prev => [
      ...(prev ?? []),
      {
        address: '',
        id: newOwnerId,
      },
    ]);
  };

  const handleChangeOwner = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = e.target.value;
    if (!newOwners) return;

    const updatedOwners = newOwners.map(owner => {
      if (owner.id === id) {
        return { ...owner, address: value };
      }
      return owner;
    });

    setNewOwners(updatedOwners);
  };

  const handleRemodeAddress = (id: number) => {
    setNewOwners(prevOwners => prevOwners && prevOwners.filter(owner => owner.id !== id));
  };

  const handleChooseAccounConfirm = (
    elem: SingleValue<{
      value: number;
      label: number;
      id: number;
    }>
  ) => {
    elem && setNewCountNeedConfirm(elem.label);
  };

  const handleRemoveOwnerAddress = async (address: string) => {
    setIsLoading(true);
    const owners = safeAccountOwners.filter(owner => owner !== address);

    if (owners.length < needConfirmOwner) {
      // await changeThresholdTx(owners.length);
      setNeedConfirmOwner(owners.length);

      await removeAddress(address);
    } else {
      await removeAddress(address);
    }

    setSafeAccountOwners(owners);

    setIsLoading(false);
  };

  const handleChangeSettings = async () => {
    setIsLoading(true);

    if (newOwners != null) {
      const updateDataOwners = newOwners
        .filter(elem => elem.address !== '')
        .map(elem => elem.address);

      const newAddressList = [...safeAccountOwners, ...updateDataOwners];

      setSafeAccountOwners(newAddressList);

      const dataAddress = newAddressList.filter(address => !safeAccountOwners.includes(address));
      const correctNeedConfirm =
        newCountNeedConfirm > [...safeAccountOwners, ...updateDataOwners].length
          ? [...safeAccountOwners, ...updateDataOwners].length
          : newCountNeedConfirm;

      setNewOwners([]);

      setNeedConfirmOwner(correctNeedConfirm);
      await addAddress(dataAddress);
      await changeThresholdTx(correctNeedConfirm);

      const dataAcc = await getInfoByAccount(safeSdk);
      if (!dataAcc) return;

      const { balanceAccount, ownersAccount, contractVersion, contractNonce, accountThreshold } =
        dataAcc;
      const parceBalance = utils.formatEther(String(balanceAccount));

      setBalanceAccount(parceBalance);
      setSafeAccountOwners(ownersAccount);
      setContractNonce(contractNonce);
      setContractVersion(contractVersion);
      setNeedConfirmOwner(accountThreshold);

      setNewCountNeedConfirm(correctNeedConfirm);
      setIsLoading(false);
    }
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600} component="h2">
            Settings
          </WalletTypography>
        </Box>

        <CustomTabs tabs={settingsMenu} />

        <WalletPaper>
          <Box display={'flex'} gap={themeMuiBase.spacing(3)}>
            <BoxStyled>
              <Box mr={themeMuiBase.spacing(3)} display={'flex'} alignItems={'center'} gap={2}>
                <WalletTypography fontSize={18} fontWeight={600}>
                  Safe Account nonce
                </WalletTypography>
                <Box display={'flex'} color={themeMuiBase.palette.error}>
                  <InfoIcon width="20px" height="20px" />
                </Box>
              </Box>
              <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                Current nonce: {contractNonce}
              </WalletTypography>
            </BoxStyled>
            <BoxStyled>
              <WalletTypography fontSize={18} fontWeight={600}>
                Contract Version
              </WalletTypography>
              <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                {contractVersion}
              </WalletTypography>
              <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                Latest version
              </WalletTypography>
            </BoxStyled>
          </Box>
        </WalletPaper>

        <WalletPaper>
          <BodyAccountsStyled>
            <Box mr={4} width={'40%'}>
              <WalletTypography fontSize={17} fontWeight={600}>
                Manage Safe Account owners
              </WalletTypography>
            </Box>
            <Box>
              <Box mb={3}>
                <WalletTypography
                  fontSize={17}
                  fontWeight={300}
                  color={themeMuiBase.palette.greyToo}
                >
                  Add, remove and replace or rename existing owners. Owner names are only stored
                  locally and will never be shared with us or any third parties.
                </WalletTypography>
              </Box>
              <BodyListAccountsStyled>
                <ListAccount
                  linkOnScan={linkOnScan}
                  handleRemoveOwnerAddress={handleRemoveOwnerAddress}
                />
                <Box display={'flex'} flexDirection={'column'} gap={3}>
                  {newOwners &&
                    newOwners.map(owner => (
                      <Box display={'flex'} key={owner.id} alignItems={'center'} gap={2}>
                        <WalletInput
                          value={owner.address}
                          startAdornment
                          onChange={e => handleChangeOwner(e, owner.id)}
                        />
                        <Box
                          sx={{ display: 'flex', cursor: 'pointer' }}
                          onClick={() => handleRemodeAddress(owner.id)}
                        >
                          <IconDelete />
                        </Box>
                      </Box>
                    ))}
                </Box>
              </BodyListAccountsStyled>
              <GridBtnStyled>
                <WalletButton variant="text" styles={styledBtn} onClick={handleAddOwner}>
                  <IconPlus width="20px" height="21px" color={themeMuiBase.palette.success} /> Add
                  new owner
                </WalletButton>
                <CSVLink data={csvData} style={styledCSV} onClick={handleGetCSV} href="/">
                  <WalletButton variant="text" styles={styledBtn}>
                    Export as CSV
                  </WalletButton>
                </CSVLink>
              </GridBtnStyled>
            </Box>
          </BodyAccountsStyled>

          <ConfirmationsStyled>
            <WalletTypography fontSize={17} fontWeight={600}>
              Required confirmations
            </WalletTypography>
            <WalletTypography fontSize={17} fontWeight={400}>
              Any transaction requires the confirmation of:
            </WalletTypography>

            <Box mt={3} display="flex" alignItems="center">
              <Box mr={3} width={'84px'}>
                <WalletSelect
                  isDisabled={isLoading}
                  options={countNeedCorfimLocal}
                  controlShouldRenderValue
                  defaultValue={defCountConfirm}
                  onChange={handleChooseAccounConfirm}
                />
              </Box>
              <WalletTypography fontSize={13} fontWeight={600}>
                out of {countOwners} owner(s)
              </WalletTypography>
            </Box>

            <WalletButton variant="contained" onClick={handleChangeSettings} loading={isLoading}>
              Change
            </WalletButton>
          </ConfirmationsStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
