import {
  ChainInfo,
  FEATURES,
  GAS_PRICE_TYPE,
  RPC_AUTHENTICATION,
} from '@safe-global/safe-gateway-typescript-sdk';

import { networks } from '@/context/networks';
import { formatterIcon } from '@/utils/icon-formatter';

interface ISafeNetworksObj {
  [key: string]: never[];
}

export const safeNetworksObj: ISafeNetworksObj = {
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

export const walletConnectChains: ChainInfo[] = [
  {
    chainId: '1',
    chainName: 'Ethereum',
    description: '',
    chainLogoUri: 'https://safe-transaction-assets.staging.5afe.dev/chains/1/chain_logo.png',
    l2: false,
    isTestnet: false,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-transaction-assets.staging.5afe.dev/chains/1/currency_logo.png',
    },
    transactionService: 'https://safe-transaction-mainnet.staging.5afe.dev/',
    blockExplorerUriTemplate: {
      address: 'https://etherscan.io/address/{{address}}',
      txHash: 'https://etherscan.io/tx/{{txHash}}',
      api: 'https://api.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['socialSigner'],
    ensRegistryAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    features: [
      FEATURES['CONTRACT_INTERACTION'],
      FEATURES['DOMAIN_LOOKUP'],
      FEATURES['EIP1271'],
      FEATURES['EIP1559'],
      FEATURES['ERC721'],
      FEATURES['SAFE_APPS'],
      FEATURES['SAFE_TX_GAS_OPTIONAL'],
      FEATURES['SPENDING_LIMIT'],
      FEATURES['TX_SIMULATION'],
    ],
    gasPrice: [
      {
        type: GAS_PRICE_TYPE.ORACLE,
        uri: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=JNFAU892RF9TJWBU3EV7DJCPIWZY8KEMY1',
        gasParameter: 'FastGasPrice',
        gweiFactor: '1000000000.000000000',
      },
    ],
    publicRpcUri: {
      authentication: RPC_AUTHENTICATION.API_KEY_PATH,
      value: 'https://mainnet.infura.io/v3/',
    },
    rpcUri: {
      authentication: RPC_AUTHENTICATION.API_KEY_PATH,
      value: 'https://mainnet.infura.io/v3/',
    },
    safeAppsRpcUri: {
      authentication: RPC_AUTHENTICATION.API_KEY_PATH,
      value: 'https://mainnet.infura.io/v3/',
    },
    shortName: 'eth',
    theme: {
      textColor: '#001428',
      backgroundColor: '#DDDDDD',
    },
  },
];

export interface IOptionNetwork {
  chainId: number;
  label: string;
  value: string;
  name?: string;
  currency: string;
  rpc: string;
  explorerUrl?: string;
  rpcOriginal?: string;
  icon?: () => React.ReactNode;
}

export const optionsNetwork: IOptionNetwork[] = networks.map(
  ({ chainId, name, rpcUrl, explorerUrl, currency }) => ({
    chainId: chainId,
    label: name,
    value: name,
    rpc: rpcUrl,
    rpcOriginal: rpcUrl,
    explorerUrl,
    currency,
    icon: () => formatterIcon(chainId),
  })
);
