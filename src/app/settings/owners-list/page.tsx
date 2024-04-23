'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { CSVLink } from 'react-csv';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { SingleValue } from 'react-select';
import { useRouter } from 'next/navigation';

import IconUser from '@/assets/svg/user.svg';
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
import { networks } from '@/context/networks';
import { CustomModal, CustomTabs } from '@/components';
import useActiveSafeAddress from '@/stores/safe-address-store';
import useSafeStore from '@/stores/safe-store';
import { TYPE_SIGN_TRX } from '@/constants/type-sign';
import routes from '@/app/routes';

import {
  BoxStyled,
  WrapperStyled,
  styledBtn,
  GridBtnStyled,
  ConfirmationsStyled,
  BodyAccountsStyled,
  styledCSV,
  BodyListAccountsStyled,
  AddOwnerStyled,
  GridBtnAddOwnerStyled,
  styledNonce,
} from './owners-list.styles';
import { ListAccount } from './components/list-account/list-account';
import { settingsMenu } from './fixutres';

export default function SettingsOwner() {
  const network = useNetwork();
  const router = useRouter();
  const { chainId } = useWeb3ModalAccount();
  const { getInfoByAccount } = useSafeSdk();
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
    setContractNonce,
    setContractVersion,
  } = useActiveSafeAddress();

  // eslint-disable-next-line
  const [csvData, setCsvData] = useState<Array<Array<string>>>([]);
  const [newCountNeedConfirm, setNewCountNeedConfirm] = useState(needConfirmOwner);

  // eslint-disable-next-line
  const [optionsCount, setOptionsCount] = useState<any>(null);

  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [nonce, setNonce] = useState(contractNonce);

  const safeAddress: string | null =
    typeof window !== 'undefined' ? localStorage.getItem('safeAddress') : null;
  const networkName =
    (network?.name || '').toString().charAt(0).toUpperCase() +
    (network?.name || '').toString().slice(1);

  useEffect(() => {
    const newCountNeedCormed = Array.from({ length: safeAccountOwners.length }, (_, index) => ({
      id: index + 1,
      label: index + 1,
      value: index + 1,
    }));
    setOptionsCount(newCountNeedCormed);
  }, [safeAccountOwners]);

  useEffect(() => {
    if (!safeSdk) return;

    const pendingBalance = async () => {
      if (chainId) {
        const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
        if (linkOnScan) {
          const updateLink = linkOnScan;
          setLinkOnScan(updateLink);
        }
      }

      const dataAcc = await getInfoByAccount(safeSdk);
      if (!dataAcc) return;

      const { ownersAccount, contractVersion, contractNonce, accountThreshold } = dataAcc;

      setSafeAccountOwners(ownersAccount);
      setContractNonce(contractNonce);
      setContractVersion(contractVersion);
      setNeedConfirmOwner(accountThreshold);

      // setDefOptionsCount(accountThreshold);
      setIsLoading(false);
    };

    pendingBalance();
  }, [network, chainId, safeSdk, safeAddress]);

  const handleGetCSV = () => {
    const csvContent = safeAccountOwners.map(address => `${address},"",${chainId}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'owners-list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRemoveOwnerAddress = async (address: string) => {
    setIsLoading(true);
    if (!safeAddress || !safeSdk) return;

    let threshold = needConfirmOwner;

    if (safeAccountOwners.length - 1 < needConfirmOwner) {
      threshold = needConfirmOwner - 1;
    }

    const safeTxHash = await safeSdk.createRemoveOwnerTx({
      ownerAddress: address,
      threshold,
    });

    const queryParams = {
      typeSignTrx: String(TYPE_SIGN_TRX.REMOVE_OWNER),
      chainId: String(chainId),
      address: encodeURIComponent(safeAddress),
      amount: '0',
      destinationAddress: address,
      tokenType: '',
      networkName: networkName,
      safeTxHash: JSON.stringify(safeTxHash),
      newThreshold: String(threshold),
      nonce: String(nonce),
    };

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`${routes.signTransaction}?${queryString}`);
    setIsLoading(false);
  };

  const handleChangeSettings = async () => {
    setIsLoading(true);
    if (!safeAddress || !safeSdk) return;
    const safeTxHash = await safeSdk.createChangeThresholdTx(newCountNeedConfirm);

    const queryParams = {
      typeSignTrx: String(TYPE_SIGN_TRX.CHANGE_THRESHOLD),
      chainId: String(chainId),
      address: encodeURIComponent(safeAddress),
      amount: '0',
      destinationAddress: safeAddress,
      tokenType: '',
      networkName: networkName,
      safeTxHash: JSON.stringify(safeTxHash),
      newThreshold: String(newCountNeedConfirm),
      nonce: String(nonce),
    };

    const queryString = new URLSearchParams(queryParams).toString();
    setIsLoading(false);

    router.push(`${routes.signTransaction}?${queryString}`);
  };

  const [isOpenAddOwner, setIsOpenAddOwner] = useState(false);
  const [valueNewOwner, setValueNewOwner] = useState('');
  const [valueNewOwnerError, setValueNewOwnerError] = useState<string | null | undefined>(null);

  const handleChangeNewOwner = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueNewOwner(value);

    if (value.length === 0) {
      setValueNewOwnerError(null);
      return;
    }

    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(value);

    if (isValidAddress) {
      if (!safeAccountOwners) return;

      const isUniqueAddress = !safeAccountOwners.includes(value);

      if (isUniqueAddress) {
        setValueNewOwnerError(null);
      } else {
        setValueNewOwnerError('Address already exists in account');
      }
    } else {
      setValueNewOwnerError('Invalid address format');
    }
  };

  const handleAddOwner = async () => {
    if (!safeAddress || !safeSdk) return;
    const safeTxHash = await safeSdk.createAddOwnerTx({ ownerAddress: valueNewOwner });
    const queryParams = {
      typeSignTrx: String(TYPE_SIGN_TRX.ADD_OWNER),
      chainId: String(chainId),
      address: encodeURIComponent(safeAddress),
      amount: '0',
      destinationAddress: valueNewOwner,
      tokenType: '',
      networkName: networkName,
      safeTxHash: JSON.stringify(safeTxHash),
      nonce: String(contractNonce),
    };

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`${routes.signTransaction}?${queryString}`);
  };

  const handleChangeNonce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value.replace(/\D/g, '');
    setNonce(newValue);
  };

  const handleChooseAccounConfirm = (
    elem: SingleValue<{
      value: number | string;
      label: number | string;
      id: number | string;
    }>
  ) => {
    elem && setNewCountNeedConfirm(+elem.label);
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
                  safeAccountOwners={safeAccountOwners}
                  linkOnScan={linkOnScan}
                  handleRemoveOwnerAddress={handleRemoveOwnerAddress}
                />
              </BodyListAccountsStyled>
              <GridBtnStyled>
                <WalletButton
                  variant="text"
                  styles={styledBtn}
                  onClick={() => setIsOpenAddOwner(true)}
                >
                  <IconPlus width="20px" height="21px" color={themeMuiBase.palette.success} />
                  Add new owner
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
                {/* <WalletSelect
                  isLoading={Boolean(!needConfirmOwner)}
                  controlShouldRenderValue
                  options={optionsCount}
                  defaultValue={[
                    { id: needConfirmOwner, label: needConfirmOwner, value: needConfirmOwner },
                  ]}
                  onChange={handleChooseAccounConfirm}
                /> */}
                <WalletSelect
                  isLoading={Boolean(!needConfirmOwner)}
                  controlShouldRenderValue
                  options={optionsCount}
                  defaultValue={[
                    { id: needConfirmOwner, label: needConfirmOwner, value: needConfirmOwner },
                  ]}
                  onChange={handleChooseAccounConfirm}
                />
              </Box>
              <WalletTypography fontSize={13} fontWeight={600}>
                out of {safeAccountOwners.length} owner(s)
              </WalletTypography>
            </Box>

            <WalletButton variant="contained" onClick={handleChangeSettings} loading={isLoading}>
              Change
            </WalletButton>
          </ConfirmationsStyled>
        </WalletPaper>
      </WrapperStyled>

      <CustomModal
        isOpen={isOpenAddOwner}
        closeModal={() => setIsOpenAddOwner(false)}
        styles={{ width: '560px' }}
      >
        <AddOwnerStyled>
          <WalletTypography fontSize={21} fontWeight={600}>
            New transaction
          </WalletTypography>
          <Box display={'flex'} flexDirection={'column'} gap={4} width={'100%'}>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              width={'100%'}
            >
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <IconUser />
                <WalletTypography fontSize={18} fontWeight={500}>
                  Add signer
                </WalletTypography>
              </Box>

              <Box display={'flex'} alignItems={'center'} gap={2}>
                <WalletTypography style={{ textWrap: 'nowrap' }}>Nonce #:</WalletTypography>
                <WalletInput
                  style={styledNonce}
                  value={nonce ?? '1'}
                  onChange={handleChangeNonce}
                />
              </Box>
            </Box>
            <WalletInput
              label="New owner address"
              placeholder="Address"
              value={valueNewOwner}
              onChange={handleChangeNewOwner}
              error={!!valueNewOwnerError}
              errorValue={valueNewOwnerError}
            />

            <Box display={'flex'} flexDirection={'column'} gap={1} mt={6}>
              <WalletTypography fontSize={14} fontWeight={600}>
                Required confirmations
              </WalletTypography>
              <WalletTypography fontSize={14} fontWeight={400}>
                Any transaction requires the confirmation of:
              </WalletTypography>
              <WalletTypography fontSize={14} fontWeight={600}>
                {needConfirmOwner} Thresholde
              </WalletTypography>
            </Box>
          </Box>
          <GridBtnAddOwnerStyled>
            <WalletButton
              styles={{ ...styledBtn, width: '50%' }}
              onClick={() => setIsOpenAddOwner(false)}
              variant="text"
            >
              Cancel
            </WalletButton>
            <WalletButton
              styles={{ ...styledBtn, width: '50%' }}
              onClick={handleAddOwner}
              variant="contained"
              disabled={!!valueNewOwnerError || !valueNewOwner}
            >
              Next
            </WalletButton>
          </GridBtnAddOwnerStyled>
        </AddOwnerStyled>
      </CustomModal>
    </WalletLayout>
  );
}
