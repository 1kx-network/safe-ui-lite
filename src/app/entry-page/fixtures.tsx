import DollarIcon from '@/assets/svg/dollar.svg';
import EthIcon from '@/assets/svg/eth.svg';

export interface IOptions {
  icon: JSX.Element;
  value: string;
  label: string;
  id: number;
  count: number;
}

export const options = [
  { id: 1, label: 'USD', value: 'USD', icon: <DollarIcon />, count: 12 },
  { id: 2, label: 'BTC', value: 'BTC', icon: <DollarIcon />, count: 3 },
  { id: 3, label: 'ETH', value: 'ETH', icon: <DollarIcon />, count: 5 },
];

export const tokenList = [
  { id: 1, value: 'Ethereum', label: 'ETH', count: 12, icon: <EthIcon /> },
  { id: 2, value: 'Ethereum', label: 'ETH', count: 12, icon: <EthIcon /> },
  { id: 3, value: 'Ethereum', label: 'ETH', count: 12, icon: <EthIcon /> },
  { id: 4, value: 'Ethereum', label: 'ETH', count: 12, icon: <EthIcon /> },
  { id: 5, value: 'Ethereum', label: 'ETH', count: 12, icon: <EthIcon /> },
];

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
