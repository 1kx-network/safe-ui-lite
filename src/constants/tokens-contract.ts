interface IContracts {
  [key: string]: { [key: string]: string };
}

export const CONTRACTS_TOKEN: IContracts = {
  // mainet
  1: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },

  // sepolia
  11155111: {
    USDT: '0x419Fe9f14Ff3aA22e46ff1d03a73EdF3b70A62ED',
    USDC: '0x13fA158A117b93C27c55b8216806294a0aE88b6D',
  },
};
