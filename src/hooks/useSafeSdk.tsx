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
      const safeFactory = await SafeFactory.create({ ethAdapter, isL1SafeSingleton: true });
      const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
      const addressAccount = await safeSdk.getAddress();

      const localList = localStorage.getItem('createdSafes')
        ? localStorage.getItem('createdSafes')
        : null;

      const localListParsed = localList ? JSON.parse(localList) : safeNetworksObj;

      const updateLocalList =
        chainId && localListParsed[String(chainId)] === undefined
          ? {
              ...localListParsed,
              [chainId]: [],
            }
          : localListParsed;

      if (chainId && updateLocalList && updateLocalList[chainId]) {
        updateLocalList[chainId].push(addressAccount);
      } else {
        updateLocalList[chainId ?? 1] = [addressAccount];
      }

      localStorage.setItem('createdSafes', JSON.stringify(updateLocalList));
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
      return null;
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
    createTrancationERC20,
    getTokenERC20Balance,
  };
}
