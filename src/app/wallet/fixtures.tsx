import USDCIcon from '@/assets/svg/USDC.svg';
import USDTIcon from '@/assets/svg/USDT.svg';
import EthIcon from '@/assets/svg/eth-icon.svg';
import { NATIVE_TOKENS, TOKENS_ERC20 } from '@/constants/tokens';

export interface IOptions {
  icon: JSX.Element;
  value: string;
  label: string;
  id: number;
  count?: number;
}

export const options = [
  { id: 0, label: NATIVE_TOKENS.ETH, value: NATIVE_TOKENS.ETH, icon: EthIcon },
  { id: 1, label: TOKENS_ERC20.USDT, value: TOKENS_ERC20.USDT, icon: USDTIcon },
  { id: 2, label: TOKENS_ERC20.USDC, value: TOKENS_ERC20.USDC, icon: USDCIcon },
];

export const tokenList = [
  { id: 0, value: 'Ethereum', label: NATIVE_TOKENS.ETH, icon: EthIcon, count: 12 },
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
