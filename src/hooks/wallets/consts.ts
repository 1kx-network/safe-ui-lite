export const enum WALLET_KEYS {
  INJECTED = 'INJECTED',
  WALLETCONNECT_V2 = 'WALLETCONNECT_V2',
}

// TODO: Check if undefined is needed as a return type, possibly couple this with WALLET_MODULES
export const CGW_NAMES: { [key in WALLET_KEYS]: string | undefined } = {
  [WALLET_KEYS.INJECTED]: 'detectedwallet',
  [WALLET_KEYS.WALLETCONNECT_V2]: 'walletConnect_v2',
};
