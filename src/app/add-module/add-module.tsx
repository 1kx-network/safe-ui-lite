import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { Box } from '@mui/system';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';

import abi from '../../app/contracts/abi/safe.json';
import { ItemStepPaperStyled } from '../../app/home.styles'; // Assuming these are imported correctly
import { WalletButton, WalletPaper, WalletTypography } from '@/ui-kit';
import useActiveSafeAddress from '../../stores/safe-address-store';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import useSafeStore from '../../stores/safe-store';
import { useSafeSdk } from '../../hooks/useSafeSdk';
import { useNetwork } from '../../hooks/useNetwork';
import { setDataDB } from '../../db/set-info';
import { SEPOLIA_ZK_MODULE } from '../../constants/addresses';
import routes from '../../app/routes';
import { NATIVE_TOKENS } from '../../constants/tokens';
import { ITransaction } from '@/db';
import { IconPlusStyled } from '../../components/widgets/create-transaction/create-transaction.styles';
import { TYPE_SIGN_TRX } from '../../constants/type-sign';
import useNetworkStore from '../../stores/networks-store';

export default function AddModule() {
  const { address, chainId } = useWeb3ModalAccount();
  const { safeAddress } = useActiveSafeAddress();
  const { safeSdk } = useSafeStore();
  const { addZKModule } = useSafeSdk(safeAddress);
  const network = useNetwork();
  const router = useRouter();
  const { chosenNetwork } = useNetworkStore();
  const [nonce, setNonce] = useState('1');

  useEffect(() => {
    if (safeSdk) {
      const getNonce = async () => {
        const nonce = await safeSdk.getNonce();

        setNonce(String(nonce));
      };

      getNonce();
    }
  }, [safeSdk, safeAddress]);

  const { data: isModuleEnabled, isError } = useReadContract({
    abi,
    address: safeAddress as `0x${string}`,
    functionName: 'isModuleEnabled',
    args: [SEPOLIA_ZK_MODULE],
  });

  const onSubmit = async () => {
    if (!safeSdk || !chainId || !address) return;
    const networkName =
      (network?.name || '').toString().charAt(0).toUpperCase() +
      (network?.name || '').toString().slice(1);

    const safeTransaction = await addZKModule(safeSdk);

    if (!safeTransaction) return;

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const thesholders = await safeSdk.getThreshold();
    const currentDate = new Date();
    const dateTrx = currentDate.toLocaleString('en-GB', { timeZone: 'UTC' }).replace(',', '');

    if (chainId && safeAddress) {
      const queryParams = {
        chainId: String(chainId),
        address: encodeURIComponent(safeAddress),
        amount: safeTransaction.data.value,
        destinationAddress: safeTransaction.data.to,
        networkName,
        safeTxHash,
        nonce: nonce,
        tokenType: NATIVE_TOKENS.ETH,
        typeSignTrx: TYPE_SIGN_TRX.ADD_MODULE,
        calldata: safeTransaction.data.data,
        userNetworkTrx: JSON.stringify({
          name: chosenNetwork?.value ?? '',
          chainId: chosenNetwork?.chainId ?? '',
          rpcUrl: chosenNetwork?.rpc ?? '',
          explorerUrl: chosenNetwork?.explorerUrl ?? '',
          currency: chosenNetwork?.currency ?? '',
        }),
      };

      const transactionDB: ITransaction = {
        id: uuid(),
        date: dateTrx,
        theshold: thesholders,
        hash: safeTxHash,
        amount: safeTransaction.data.value,
        calldata: safeTransaction.data.data,
        destinationAddress: safeTransaction.data.to,
        nonce: safeTransaction.data.nonce.toString(),
        signatures: [],
        tokenType: NATIVE_TOKENS.ETH,
      };

      await setDataDB(safeAddress, {
        address: safeAddress,
        transactions: [transactionDB],
      });

      const queryString = new URLSearchParams(queryParams).toString();
      router.push(`${routes.signTransaction}?${queryString}`);
    }
  };

  if (!safeAddress) return null;

  if (isError) return <div>Error loading module status</div>;

  return (
    <Box marginTop="16px">
      <ItemStepPaperStyled>
        <WalletPaper>
          <IconPlusStyled />
          <Box display={'flex'} flexDirection={'column'} gap={4}>
            <WalletTypography fontSize={22} fontWeight={600}>
              Prover Module
            </WalletTypography>
            <WalletTypography color={themeMuiBase.palette.tetriaryGrey}>
              {isModuleEnabled
                ? '✅ Module is already enabled'
                : '⛔️ Module not enabled. Please enable it.'}
            </WalletTypography>
          </Box>
          {!isModuleEnabled && (
            <Box paddingTop={4}>
              <WalletButton variant="outlined" onClick={onSubmit}>
                Enable Module
              </WalletButton>
            </Box>
          )}
        </WalletPaper>
      </ItemStepPaperStyled>
    </Box>
  );
}
