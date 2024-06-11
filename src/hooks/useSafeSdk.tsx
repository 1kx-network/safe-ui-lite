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
import usdABI from '@/app/contracts/abi/usd.json';
import { CONTRACTS_TOKEN } from '@/constants/tokens-contract';
import useActiveSafeAddress from '@/stores/safe-address-store';
import { SEPOLIA_ZK_MODULE } from '../constants/addresses';

import { useEthersAdapter } from './useEthersAdapter';
import { updateSafeAccounts } from '@/utils/foramtters';

export interface ICreateTrancationERC20 {
  tokenAddress: string;
  toAddress: string;
  amount: string;
}

export function useSafeSdk(safeAddress: string | null = null) {
  const createEthAdapter = useEthersAdapter();
  const { saveSdk, safeSdk } = useSafeStore();
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId, address } = useWeb3ModalAccount();
  const { setClearActiveSafeStore } = useActiveSafeAddress();

  const createSdkInstance = async (address: string | null) => {
    if (!walletProvider) {
      console.error('Wallet provider is not available.');
      return;
    }

    if (safeAddress) {
      return await createSafe(safeAddress);
    }

    if (address) {
      return await createSafe(address);
    }
  };

  useEffect(() => {
    createSdkInstance(null);
  }, [safeAddress, walletProvider, chainId]);

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

      if (!chainId) {
        throw new Error('<-- Chain Id is undefinded -->');
      }

      const localList = localStorage.getItem('createdSafes')
        ? localStorage.getItem('createdSafes')
        : null;

      updateSafeAccounts(chainId, owners, addressAccount, localList);

      return safeSdk;
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      if (error.includes('Create2')) {
        customToasty(
          `A similar account has already been created. Error with deploy new safe account.`,
          'error',
          { duration: 4000 }
        );
      } else {
        customToasty('Error with deploy new safe account', 'error', { duration: 4000 });
        console.error(`<-- ${error} -->`);
        setClearActiveSafeStore();
      }

      throw new Error(error);
    }
  };

  const createSafe = async (safeAddress: string | null) => {
    try {
      const ethAdapter = await createEthAdapter?.createEthAdapter?.();

      if (!ethAdapter || !safeAddress) return null;

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
        isL1SafeSingleton: true,
      });

      saveSdk(safeSdk);
      return safeSdk;
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : String(e);
      // const errorMessage = `${error}. ${isCreateAcc ? 'Please check your RPC in wallet or change network': }`;

      setClearActiveSafeStore();
      console.error(`<-- ${error} -->`);
    }
  };

  const addZKModule = async (safeSdk: null | Safe, moduleAddress = SEPOLIA_ZK_MODULE) => {
    try {
      const txndata = safeSdk?.createEnableModuleTx(moduleAddress);
      return txndata;
    } catch (e) {
      customToasty(`Error add ZK module`, 'error');
      console.error(e);
    }
  };

  const getInfoByAccount = async (safeSdk: null | Safe) => {
    if (!safeSdk) return;

    try {
      const balanceAccount = await safeSdk.getBalance();
      const ownersAccount = await safeSdk.getOwners();
      const contractVersion = await safeSdk.getContractVersion();
      const contractNonce = await safeSdk.getNonce();
      const accountThreshold = await safeSdk.getThreshold();

      return { balanceAccount, ownersAccount, contractVersion, contractNonce, accountThreshold };
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);

      console.error(`<-- ${errorMessage} -->`);
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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`<-- ${errorMessage} -->`);
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
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);

      customToasty('Error get balance ERC20 token', 'error');
      console.error(`<-- ${errorMessage} -->`);
    }
  };

  return {
    addZKModule,
    deploySafe,
    createSafe,
    getInfoByAccount,
    createTrancationERC20,
    getTokenERC20Balance,
    createSdkInstance,
  };
}
