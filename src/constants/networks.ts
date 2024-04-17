import { networks } from '@/context/networks';
import { formatterIcon } from '@/utils/icon-formatter';

export const safeNetworksObj = {
  '1': [],
  '10': [],
  '56': [],
  '100': [],
  '137': [],
  '324': [],
  '1101': [],
  '8453': [],
  '42161': [],
  '42220': [],
  '43114': [],
  '84532': [],
  '11155111': [],
  '1313161554': [],
};

export interface IOptionNetwork {
  chainId: number;
  label: string;
  value: string;
  name?: string;
  currency?: string;
  rpc: string;
  explorerUrl?: string;
  icon?: () => React.ReactNode;
}

export const optionsNetwork: IOptionNetwork[] = networks.map(
  ({ chainId, name, rpcUrl, explorerUrl, currency }) => ({
    chainId: chainId,
    label: name,
    value: name,
    rpc: rpcUrl,
    explorerUrl,
    currency,
    icon: () => formatterIcon(chainId),
  })
);
