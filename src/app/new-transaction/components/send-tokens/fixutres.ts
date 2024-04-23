import USDCIcon from '@/assets/svg/USDC.svg';
import USDTIcon from '@/assets/svg/USDT.svg';
import EthIcon from '@/assets/svg/eth-icon.svg';
import { NATIVE_TOKENS, TOKENS_ERC20 } from '@/constants/tokens';

export const options = [
  { id: 0, label: NATIVE_TOKENS.ETH, value: NATIVE_TOKENS.ETH, icon: EthIcon },
  { id: 1, label: TOKENS_ERC20.USDT, value: TOKENS_ERC20.USDT, icon: USDTIcon },
  { id: 2, label: TOKENS_ERC20.USDC, value: TOKENS_ERC20.USDC, icon: USDCIcon },
];
