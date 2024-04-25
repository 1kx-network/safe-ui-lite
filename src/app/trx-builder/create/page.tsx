'use client';

import { ReactElement, useCallback, useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
import { AddressInput, Divider, Switch, Text, Title } from '@gnosis.pm/safe-react-components';
// import styled from 'styled-components';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import Grid from '@material-ui/core/Grid';
// import CheckCircle from '@material-ui/icons/CheckCircle';
import detectProxyTarget from 'evm-proxy-detection';
import { Box } from '@mui/system';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { evalTemplate, FETCH_STATUS, isValidAddress } from '../utils';
import AddNewTransactionForm from '../components/forms/AddNewTransactionForm';
import JsonField from '../components/forms/fields/JsonField';
import { ContractInterface } from '../typings/models';
import { useNetwork } from '../store';
import { useAbi } from '../hooks/useAbi';
import { ImplementationABIDialog } from '../components/modals/ImplementationABIDialog';
import { WalletInput, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import SafeThemeProvider from '@/components/theme/SafeThemeProvider';

import { GridStyled, WrapperStyled } from './create.styles';

const TrxBuildCreate = () => {
  const { chainId } = useWeb3ModalAccount();
  const [abiAddress, setAbiAddress] = useState('');
  const [transactionRecipientAddress, setTransactionRecipientAddress] = useState('');
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [showHexEncodedData, setShowHexEncodedData] = useState<boolean>(false);
  // const { abi, abiStatus, setAbi } = useAbi(abiAddress);
  const [implementationABIDialog, setImplementationABIDialog] = useState({
    open: false,
    implementationAddress: '',
    proxyAddress: '',
  });

  const [abi, setAbi] = useState<string | null>('');
  const abiStatus = null;

  // const { interfaceRepo, networkPrefix, getAddressFromDomain, web3, chainInfo } = useNetwork();

  // useEffect(() => {
  //   if (!abi || !interfaceRepo) {
  //     setContract(null);
  //     return;
  //   }

  //   setContract(interfaceRepo.getMethods(abi));
  // }, [abi, interfaceRepo]);

  const isAbiAddressInputFieldValid = !abiAddress || isValidAddress(abiAddress);

  const contractHasMethods =
    abiStatus === FETCH_STATUS.SUCCESS && contract && contract.methods.length > 0;

  const isTransferTransaction =
    abiStatus === FETCH_STATUS.SUCCESS && isAbiAddressInputFieldValid && !abi;
  const isContractInteractionTransaction =
    (abiStatus === FETCH_STATUS.SUCCESS || abiStatus === FETCH_STATUS.NOT_ASKED) && abi && contract;

  const showNewTransactionForm = isTransferTransaction || isContractInteractionTransaction;

  const showNoPublicMethodsWarning = contract && contract.methods.length === 0;

  // The flow is the following:
  // 1. We receive the address input and check if it's a valid address
  // 2. If it's a valid address, we get the implementation address and check if there's an ABI for it
  // 3. If there's an ABI for the implementation address, we show the ABI dialog
  // 4. If the user chooses to use the implementation address, we set the ABI address to the
  //    implementation address, otherwise we keep the original address.
  const handleAbiAddressInput = useCallback(
    async (input: string) => {
      // For some reason the onchange handler is fired many times
      // Even if the value hasn't changed, we have to check if we already tried to fetch the ABI
      const alreadyExecuted = input.toLowerCase() === abiAddress.toLowerCase();
      if (alreadyExecuted) {
        return;
      }

      // if (isValidAddress(input) && web3?.currentProvider) {
      //   const implementationAddress = await detectProxyTarget(
      //     input,
      //     // @ts-expect-error currentProvider type is many providers and not all of them are compatible
      //     // with EIP-1193, but the one we use is compatible (safe-apps-provider)
      //     web3.currentProvider.request.bind(web3.currentProvider)
      //   );

      //   if (implementationAddress) {
      //     const showImplementationAbiDialog = await interfaceRepo?.abiExists(implementationAddress);

      //     if (showImplementationAbiDialog) {
      //       setImplementationABIDialog({
      //         open: true,
      //         implementationAddress,
      //         proxyAddress: input,
      //       });
      //       return;
      //     }
      //   }
      // }

      setAbiAddress(input);
      setTransactionRecipientAddress(input);
    },
    [abiAddress]
    // interfaceRepo, web3]
  );

  if (!chainId) {
    return <WalletLayout>Loading ...</WalletLayout>;
  }

  const [valueAddress, setValueAddress] = useState('');

  const handleChangeValueAddress = (elem: any) => {
    console.log('_elem', elem.target.value);
    setValueAddress(elem.target.value);
  };

  return (
    <WalletLayout>
      <WrapperStyled>
        <WalletTypography fontSize={18} fontWeight={600}>
          Transaction Builder
        </WalletTypography>
        <WalletPaper style={{ width: '560px', marginTop: '2rem' }}>
          <GridStyled>
            <Box display={'flex'} width={'100%'}>
              <WalletTypography fontWeight={500}>New Transaction</WalletTypography>

              {/* TODO */}
              {/* <Grid container item xs={6} alignItems="center" justifyContent="flex-end">
                <Grid item>
                  <Switch
                    checked={showHexEncodedData}
                    onChange={() => setShowHexEncodedData(!showHexEncodedData)}
                  />
                </Grid>
                <Grid item>
                  <Text size="lg">Custom data</Text>
                </Grid>
              </Grid> */}
              {/*  */}
            </Box>

            {/* <StyledDivider /> */}

            {/* ABI Address Input */}
            <AddressInput
              id="address"
              name="address"
              label="Enter Address or ENS Name"
              hiddenLabel={false}
              address={abiAddress}
              fullWidth
              // showNetworkPrefix={!!networkPrefix}
              // networkPrefix={networkPrefix}
              error={isAbiAddressInputFieldValid ? '' : 'The address is not valid'}
              showLoadingSpinner={abiStatus === FETCH_STATUS.LOADING}
              showErrorsInTheLabel={false}
              // getAddressFromDomain={getAddressFromDomain}
              getAddressFromDomain={async () => '0xce0da0a5BbE50ae093aD49963f2aB83da81437da'}
              onChangeAddress={handleAbiAddressInput}
              // InputProps={{
              //   endAdornment: contractHasMethods && isValidAddress(abiAddress) && (
              //     <InputAdornment position="end">
              //       <CheckIconAddressAdornment />
              //     </InputAdornment>
              //   ),
              // }}
            />

            {/* ABI Warning */}
            {abiStatus === FETCH_STATUS.ERROR && (
              <WalletTypography color={themeMuiBase.palette.error}>
                No ABI found for this address
              </WalletTypography>
            )}

            <JsonField id="abi" name="abi" label="Enter ABI" value={abi ?? ''} onChange={setAbi} />

            {/* No public methods Warning */}
            {showNoPublicMethodsWarning && (
              <WalletTypography color={themeMuiBase.palette.error}>
                Contract ABI doesn't have any public methods.
              </WalletTypography>
            )}

            {showNewTransactionForm && (
              <AddNewTransactionForm
                contract={contract}
                to={transactionRecipientAddress}
                showHexEncodedData={showHexEncodedData}
              />
            )}
          </GridStyled>
          {implementationABIDialog.open && (
            <ImplementationABIDialog
              networkPrefix={'chainId'}
              // blockExplorerLink={evalTemplate(chainInfo.blockExplorerUriTemplate.address, {
              //   address: implementationABIDialog.implementationAddress,
              // })}
              blockExplorerLink="https://google.com"
              implementationAddress={implementationABIDialog.implementationAddress}
              onCancel={() => {
                setAbiAddress(implementationABIDialog.proxyAddress);
                setTransactionRecipientAddress(implementationABIDialog.proxyAddress);
                setImplementationABIDialog({
                  open: false,
                  implementationAddress: '',
                  proxyAddress: '',
                });
              }}
              onConfirm={() => {
                setAbiAddress(implementationABIDialog.implementationAddress);
                setTransactionRecipientAddress(implementationABIDialog.proxyAddress);
                setImplementationABIDialog({
                  open: false,
                  implementationAddress: '',
                  proxyAddress: '',
                });
              }}
            />
          )}
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
};

export default TrxBuildCreate;
