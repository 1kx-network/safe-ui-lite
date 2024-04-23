const { NODE_ENV } = process.env;

export const IS_PRODUCTION = NODE_ENV === 'production';

export const WALLETCONNECT_V2_PROJECT_ID = '52dd11535fb5239f7a487315253f3065';

export const SAFE_WALLET_METADATA = {
  name: 'Safe Wallet',
  description: 'The most trusted platform to manage digital assets on Ethereum',
  url: 'https://app.safe.global',
  icons: [
    'https://app.safe.global/favicons/mstile-150x150.png',
    'https://app.safe.global/favicons/logo_120x120.png',
  ],
};

export const WC_APP_PROD = {
  id: 111,
  url: 'https://apps-portal.safe.global/wallet-connect',
};
export const WC_APP_DEV = {
  id: 25,
  url: 'https://safe-apps.dev.5afe.dev/wallet-connect',
};

export const LS_NAMESPACE = 'SAFE_v2__';
export const LATEST_SAFE_VERSION = process.env.NEXT_PUBLIC_SAFE_VERSION || '1.3.0';

export const SAFE_APPS_INFURA_TOKEN = '6435197616d1417692b3d60c41f7d13d';
export const INFURA_TOKEN = '6435197616d1417692b3d60c41f7d13d';

export const POLLING_INTERVAL = 15_000;
