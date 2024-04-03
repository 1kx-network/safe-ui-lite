interface ITokensERC20 {
  [key: string]: string;
}

interface INativeTokens {
  [key: string]: string;
}

export const TOKENS_ERC20: ITokensERC20 = {
  USDT: 'USDT',
  USDC: 'USDC',
};

export const NATIVE_TOKENS: INativeTokens = {
  ETH: 'ETH',
};
