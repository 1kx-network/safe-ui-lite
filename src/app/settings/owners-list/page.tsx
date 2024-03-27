'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { CSVLink } from 'react-csv';
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
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useActiveOwnerStore from '@/stores/active-owners-store';
import { useNetwork } from '@/hooks/useNetwork';
import { TabsSettings } from '../tabs';
import InfoIcon from '@/assets/svg/infoIcon.svg';
import IconPlus from '@/assets/svg/plus.svg';
import IconDelete from '@/assets/svg/delete.svg';
import { networks } from '@/context/networks';
import { customToasty } from '@/components';

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

interface Owner {
  id: number;
  address: string;
}

export default function WalletSetup() {
  const { owners, needConfirmOwner, setNeedConfirmOwner, setOwners } = useActiveOwnerStore();
  const network = useNetwork();
  const { chainId } = useWeb3ModalAccount();

  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
  const [countNeedCorfimLocal, setNeedConfirmLocal] = useState([{ value: 1, label: 1, id: 1 }]);
  const [newOwners, setNewOwners] = useState<Owner[] | null>([]);

  const [newCountNeedConfirm, setNewCountNeedConfirm] = useState(needConfirmOwner);
  const [linkOnScan, setLinkOnScan] = useState<string>('');

  const countOwners = newOwners ? newOwners.length + owners.length : owners.length;

  useEffect(() => {
    const newCountNeedCormed = Array.from({ length: countOwners }, (_, index) => ({
      id: index + 1,
      label: index + 1,
      value: index + 1,
    }));

    setNeedConfirmLocal(newCountNeedCormed);
  }, [countOwners]);

  useEffect(() => {
    if (network && chainId) {
      const networkName = network.name.toString();
      setCsvData([['Address', 'Network'], ...owners.map(owner => [owner, networkName])]);

      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        const updateLink = linkOnScan;
        setLinkOnScan(updateLink);
      }
    }
  }, [network, chainId, owners]);

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

  const handleRemoveOwnerAddress = (address: string) => {
    console.log('_addres_', address);
  };

  const handleChangeSettings = () => {
    if (newOwners != null) {
      const updateDataOwners = newOwners
        .filter(elem => elem.address !== '')
        .map(elem => elem.address);
      setOwners([...owners, ...updateDataOwners]);

      const correctNeedConfirm =
        newCountNeedConfirm > [...owners, ...updateDataOwners].length
          ? [...owners, ...updateDataOwners].length
          : newCountNeedConfirm;

      setNeedConfirmOwner(correctNeedConfirm);
      setNewCountNeedConfirm(correctNeedConfirm);
    }

    setNewOwners([]);
    customToasty('Success account settings was applied', 'success');
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600} component="h2">
            Settings
          </WalletTypography>
        </Box>

        <TabsSettings />

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
                Current nonce: {needConfirmOwner}
              </WalletTypography>
            </BoxStyled>
            <BoxStyled>
              <WalletTypography fontSize={18} fontWeight={600}>
                Contract Version
              </WalletTypography>
              <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
                1.3.0+L2
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
                <CSVLink data={csvData} style={styledCSV}>
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
                  options={countNeedCorfimLocal}
                  defaultValue={countNeedCorfimLocal[needConfirmOwner - 1]}
                  onChange={handleChooseAccounConfirm}
                />
              </Box>
              <WalletTypography fontSize={13} fontWeight={600}>
                out of {countOwners} owner(s)
              </WalletTypography>
            </Box>

            <WalletButton variant="contained" onClick={handleChangeSettings}>
              Change
            </WalletButton>
          </ConfirmationsStyled>
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}
