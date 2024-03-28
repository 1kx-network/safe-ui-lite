import DollarIcon from '@/assets/svg/dollar.svg';
import EthIcon from '@/assets/svg/eth-icon.svg';

export interface IOptions {
  icon: JSX.Element;
  value: string;
  label: string;
  id: number;
  count?: number;
}

export const options = [{ id: 1, label: 'USD', value: 'USD', icon: DollarIcon }];

export const tokenList = [{ id: 1, value: 'Ethereum', label: 'ETH', icon: EthIcon, count: 12 }];

export const transactions = [
  {
    id: 1,
    status: 'On-chain rejection',
    timeHour: 1,
    owners: 2,
    checkStatus: '',
    signedByOwner: 1,
    addInfo: 'Needs confirmations',
  },
  {
    id: 2,
    status: 'On-chain rejection',
    timeHour: 1,
    owners: 2,
    checkStatus: '',
    signedByOwner: 0,
    addInfo: 'Needs confirmations',
  },
  {
    id: 3,
    status: 'On-chain rejection',
    timeHour: 1,
    owners: 2,
    checkStatus: '',
    signedByOwner: 0,
    addInfo: 'Needs confirmations',
  },
  {
    id: 4,
    status: 'On-chain rejection',
    timeHour: 1,
    owners: 2,
    checkStatus: '',
    signedByOwner: 1,
    addInfo: 'Needs confirmations',
  },
];
