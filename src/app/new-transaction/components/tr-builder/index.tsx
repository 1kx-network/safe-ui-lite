'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import detectProxyTarget from 'evm-proxy-detection';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { Box } from '@mui/system';

import { WalletButton, WalletInput, WalletPaper, WalletTextArea, WalletTypography } from '@/ui-kit';
import { CustomModal, customToasty } from '@/components';
import { TYPE_ABI } from '../../fixutres';
import CopyIcon from '@/assets/svg/copy.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import WalletSwitch from '@/ui-kit/wallet-switch';

import { useAbi } from './utils/useAbi';
import useNetwork from './hooks/useNetwork';
import { FETCH_STATUS, isValidAddress, isValidJSON } from './utils/utils';
import { ContractInterface } from './typings/models';
import {
  BodyBatchStyled,
  BodyStyled,
  WrapperStyled,
  styledBtnTextArea,
  styledPaper,
} from './tr-builder.styles';
import NewTransactionForm from './components/new-tr-form/new-tr-form';
import CreateTransactions from './components/create-transaction';

export const TrxBuilder = () => {
  const [abiAddress, setAbiAddress] = useState('');
  const [transactionRecipientAddress, setTransactionRecipientAddress] = useState('');
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [showHexEncodedData, setShowHexEncodedData] = useState<boolean>(false);
  const { abi, abiStatus, setAbi } = useAbi(abiAddress);
  const [implementationABIDialog, setImplementationABIDialog] = useState({
    open: false,
    implementationAddress: '',
    proxyAddress: '',
  });
  const [isPrettified, setIsPrettified] = useState(false);

  const [hasErrorABI, setHasErrorABI] = useState<null | string>(null);

  const { walletProvider } = useWeb3ModalProvider();

  const { interfaceRepo } = useNetwork();

  useEffect(() => {
    if (!abi || !interfaceRepo) {
      setContract(null);
      return;
    }

    if (!!abi) {
      setHasErrorABI(isValidJSON(abi) ? null : 'Invalid JSON value');
    }

    setContract(interfaceRepo.getMethods(abi));
  }, [abi, interfaceRepo]);

  const isAbiAddressInputFieldValid = !abiAddress || isValidAddress(abiAddress);

  // const contractHasMethods =
  // abiStatus === FETCH_STATUS.SUCCESS && contract && contract.methods.length > 0;

  const isTransferTransaction =
    abiStatus === FETCH_STATUS.SUCCESS && isAbiAddressInputFieldValid && !abi;

  const isContractInteractionTransaction =
    (abiStatus === FETCH_STATUS.SUCCESS || abiStatus === FETCH_STATUS.NOT_ASKED) && abi && contract;

  const showNewTransactionForm =
    !implementationABIDialog.open && (isTransferTransaction || isContractInteractionTransaction);
  // const showNoPublicMethodsWarning = contract && contract.methods.length === 0;

  const handleAbiAddressInput = useCallback(
    async (input: string) => {
      const alreadyExecuted = input.toLowerCase() === abiAddress.toLowerCase();
      if (alreadyExecuted) {
        return;
      }

      if (isValidAddress(input) && walletProvider) {
        const implementationAddress = await detectProxyTarget(
          input as `0x${string}`,
          // currentProvider type is ma ny providers and not all of them are compatible
          // with EIP-1193, but the one we use is compatible (safe-apps-provider)
          walletProvider.request.bind(walletProvider)
        );

        if (implementationAddress) {
          const showImplementationAbiDialog = await interfaceRepo?.abiExists(
            implementationAddress.target
          );

          if (showImplementationAbiDialog) {
            setImplementationABIDialog({
              open: true,
              implementationAddress: implementationAddress.target,
              proxyAddress: input,
            });
            return;
          }
        }
      }

      setAbiAddress(input);
      setTransactionRecipientAddress(input);
    },
    [abiAddress, interfaceRepo]
  );

  const handleValueAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAbiAddress(value);
    handleAbiAddressInput(value);
    useAbi(value);
  };

  const handleValueAbi = (e: ChangeEvent<HTMLTextAreaElement> | string) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setAbi(value);

    if (!!value) setHasErrorABI(isValidJSON(value) ? null : 'Invalid JSON value');
  };

  const handleCloseModal = () => {
    setImplementationABIDialog(state => ({ ...state, open: false }));
  };

  const handleCopyProxyAddress = () => {
    navigator.clipboard.writeText(implementationABIDialog.proxyAddress);
    customToasty('Proxy address was copy', 'success');
  };

  const handleChooseABI = (type: TYPE_ABI) => {
    const toAbiAddress =
      type === TYPE_ABI.PROXY
        ? implementationABIDialog.proxyAddress
        : implementationABIDialog.implementationAddress;

    setTransactionRecipientAddress(implementationABIDialog.proxyAddress);
    setAbiAddress(toAbiAddress);
    setImplementationABIDialog({ open: false, implementationAddress: '', proxyAddress: '' });
  };

  const toggleFormatJSON = useCallback(() => {
    if (!abi) {
      return;
    }

    try {
      handleValueAbi(JSON.stringify(JSON.parse(abi), null, isPrettified ? 0 : 2));
      setIsPrettified(!isPrettified);
    } catch (e) {
      console.error(e);
      handleValueAbi(abi);
    }
  }, [handleValueAbi, abi, isPrettified]);

  const handleChangeSwitch = () => {
    setShowHexEncodedData(!showHexEncodedData);
  };

  return (
    <WrapperStyled>
      <BodyStyled>
        <WalletPaper style={styledPaper}>
          <Box display={'flex'} alignItems={'center'} gap={2.5} justifyContent={'space-between'}>
            <WalletTypography fontSize={18} fontWeight={500}>
              Create a new transaction
            </WalletTypography>
            <Box display={'flex'} alignItems={'center'} gap={2.5}>
              <WalletSwitch checked={showHexEncodedData} onChange={handleChangeSwitch} />
              <WalletTypography>Custom data</WalletTypography>
            </Box>
          </Box>

          <WalletInput label={'Enter Address'} value={abiAddress} onChange={handleValueAddress} />
          <Box my={5}>
            <WalletTextArea
              label={'Enter ABI'}
              value={abi}
              onChange={handleValueAbi}
              style={{
                maxHeight: '288px',
                height: abi ? '288px' : '110px',
                resize: 'none',
              }}
              error={!!hasErrorABI}
              errorValue={hasErrorABI}
            />
            <WalletButton
              variant="outlined"
              styles={styledBtnTextArea}
              onClick={toggleFormatJSON}
              disabled={!abi || !!hasErrorABI}
            >
              {isPrettified ? 'JSON to Stringify' : 'JSON to Prettify'}
            </WalletButton>
          </Box>

          {showNewTransactionForm && (
            <NewTransactionForm
              contract={contract}
              to={transactionRecipientAddress}
              showHexEncodedData={showHexEncodedData}
            />
          )}
        </WalletPaper>
      </BodyStyled>

      <BodyBatchStyled>
        <WalletTypography fontSize={18} fontWeight={500}>
          Start creating a new batch
        </WalletTypography>
        <CreateTransactions />
      </BodyBatchStyled>

      {/* ABI Warning */}
      {abiStatus === FETCH_STATUS.ERROR && (
        <WalletTypography color={themeMuiBase.palette.error}>
          No ABI found for this address
        </WalletTypography>
      )}

      <CustomModal
        isOpen={implementationABIDialog.open}
        closeModal={handleCloseModal}
        styles={{ width: '500px' }}
      >
        <WalletTypography fontSize={21} fontWeight={500}>
          Use the Implementation ABI?
        </WalletTypography>
        <Box display={'flex'} flexDirection={'column'} gap={6} mt={5}>
          <WalletTypography>
            The contract looks like a proxy. <br /> Do you want to use the Implementation ABI?
          </WalletTypography>

          <Box display={'flex'} alignItems={'center'} gap={2}>
            <WalletTypography fontWeight={600}>
              {implementationABIDialog.implementationAddress}
            </WalletTypography>
            <CopyIcon width="18px" height="18px" onClick={handleCopyProxyAddress} />
          </Box>

          <Box display={'flex'} gap={3}>
            <WalletButton onClick={() => handleChooseABI(TYPE_ABI.PROXY)} variant="outlined">
              Keep Proxy ABI
            </WalletButton>
            <WalletButton
              onClick={() => handleChooseABI(TYPE_ABI.IMPLEMENTATION)}
              variant="contained"
            >
              Use Implementation ABI
            </WalletButton>
          </Box>
        </Box>
      </CustomModal>
    </WrapperStyled>
  );
};
