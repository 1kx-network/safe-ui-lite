import Safe, {
  SafeAccountConfig,
  SafeFactory,
  createERC20TokenTransferTransaction,
} from '@safe-global/protocol-kit';
import { useEffect } from 'react';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import * as ethers from 'ethers';
import { Transaction } from '@safe-global/safe-core-sdk-types';

import useSafeStore from '@/stores/safe-store';
import { customToasty } from '@/components';
import { safeNetworksObj } from '@/constants/networks';
import usdABI from '@/app/contracts/abi/usd.json';
import { CONTRACTS_TOKEN } from '@/constants/tokens-contract';

import { useEthersAdapter } from './useEthersAdapter';

export interface ICreateTrancationERC20 {
  tokenAddress: string;
  toAddress: string;
  amount: string;
}

export function useSafeSdk(safeAddress: string | null = null) {
  const createEthAdapter = useEthersAdapter();
  const { saveSdk, safeSdk } = useSafeStore();
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId } = useWeb3ModalAccount();

  const createSdkInstance = async () => {
    if (safeAddress && walletProvider) {
      await createSafe(safeAddress);
    }
  };

  useEffect(() => {
    createSdkInstance();
  }, [safeAddress, walletProvider]);

  const deploySafe = async (owners: string[], threshold: number) => {
    try {
      const ethAdapter = await createEthAdapter?.createEthAdapter?.();
      const safeAddress = await ethAdapter?.getSignerAddress();

      if (!safeAddress || !ethAdapter) return null;

      const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold,
      };
      const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeSingleton: true }).catch(
        res => {
          return res;
        }
      );

      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
      const addressAccount = await safeSdk.getAddress();

      const localList = localStorage.getItem('createdSafes')
        ? localStorage.getItem('createdSafes')
        : null;
      const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;

      localListParsed[chainId ?? 1].push(addressAccount);
      localStorage.setItem('createdSafes', JSON.stringify(localListParsed));
      localStorage.setItem('safeAddress', addressAccount);

      return safeSdk;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createSafe = async (safeAddress: string) => {
    try {
      const ethAdapter = await createEthAdapter?.createEthAdapter?.();

      if (!ethAdapter) return null;

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
        isL1SafeSingleton: true,
      });

      saveSdk(safeSdk);
      return safeSdk;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const getInfoByAccount = async (safeSdk: null | Safe) => {
    try {
      if (!safeSdk) return;
      const balanceAccount = await safeSdk.getBalance();
      const ownersAccount = await safeSdk.getOwners();
      const contractVersion = await safeSdk.getContractVersion();
      const contractNonce = await safeSdk.getNonce();
      const accountThreshold = await safeSdk.getThreshold();

      return { balanceAccount, ownersAccount, contractVersion, contractNonce, accountThreshold };
    } catch (e) {
      customToasty(`Error get info by account`, 'error');
      return null;
    }
  };

  const removeAddress = async (ownerAddress: string) => {
    try {
      if (!safeSdk) return;

      // const safeTransactionRemoveOwner = await safeSdk.createRemoveOwnerTx({
      //   ownerAddress: ownerAddress,
      //   threshold: 1,
      // });

      // const signTrx = await safeSdk.signTransaction(safeTransactionRemoveOwner);
      // const res = await safeSdk.executeTransaction(safeTransactionRemoveOwner);
      // await res.transactionResponse?.wait();
      customToasty(`Success remove address ${ownerAddress}`, 'success');
    } catch (e) {
      console.log(e);
      customToasty(`Error remove address ${ownerAddress}`, 'error');
      return null;
    }
  };

  const addAddress = async (ownerAddresses: string[]) => {
    try {
      if (!safeSdk) return;

      const promises = ownerAddresses.map(async address => {
        try {
          const safeTrxAddAddress = await safeSdk.createAddOwnerTx({ ownerAddress: address });
          const txResponse = await safeSdk.executeTransaction(safeTrxAddAddress);

          await txResponse.transactionResponse?.wait();

          return address;
        } catch (e) {
          throw new Error(`Failed to add owner at address: ${address}`);
        }
      });

      await Promise.all(promises);

      customToasty(`Success add addresses`, 'success');
    } catch (e) {
      customToasty(`Error add address`, 'error');
    }
  };

  const changeThresholdTx = async (count: number) => {
    try {
      if (!safeSdk) return;

      await safeSdk.createChangeThresholdTx(count).then(() => {
        customToasty(`Success change thresholder count on ${count}`, 'success');
        return true;
      });
    } catch (e) {
      customToasty(`Error change thresholder count on ${count}`, 'error');
    }
  };

  const createTrancationERC20 = async ({
    tokenAddress,
    toAddress,
    amount,
  }: ICreateTrancationERC20): Promise<Transaction | undefined> => {
    try {
      const transferData = createERC20TokenTransferTransaction(tokenAddress, toAddress, amount);
      return transferData;
    } catch (e) {
      console.log('Error create token transfer transaction ERC20', e);
    }
  };

  const getTokenERC20Balance = async (typeToken: string, chainId: number) => {
    try {
      if (!walletProvider) return;

      const addressAccount = await safeSdk?.getAddress();
      const etherProvider = new ethers.BrowserProvider(walletProvider);

      const usdtContract = new ethers.Contract(
        CONTRACTS_TOKEN[chainId][typeToken],
        usdABI,
        etherProvider
      );
      const balance = await usdtContract.balanceOf(addressAccount);

      return balance;
    } catch (error) {
      customToasty(`Error get balance ERC20 token`, 'error');
      console.log(error);
      return null;
    }
  };

  return {
    deploySafe,
    createSafe,
    getInfoByAccount,
    removeAddress,
    changeThresholdTx,
    addAddress,
    createTrancationERC20,
    getTokenERC20Balance,
  };
}
