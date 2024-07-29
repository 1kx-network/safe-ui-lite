const routes = {
  home: '/',
  safeAccountCreate: '/safe-account/create',
  safeAccountImport: '/safe-account/import',
  safeAccountOwners: '/safe-account/owners',
  safeAccountReview: '/safe-account/review',

  settings: '/settings',
  settingsOwnersList: '/settings?owners-list',
  settingsEnvironmentVariables: '/settings?environment-variables',
  settingsAddVariables: '/settings?add-variables',

  transactions: '/transactions',
  transactionsHistory: '/transactions/history',

  walletPage: '/wallet',
  walletSetup: '/wallet-setup',

  safeAddressBook: '/address-book',

  newTransaction: '/new-transaction',
  newTransactionSendToken: '/new-transaction?send-tokens',
  newTransactionTrxBuilder: '/new-transaction?tr-builder',

  signTransaction: '/sign-transaction',
  signMessage: '/sign-message',
  newSignTransaction: '/sign-transaction/link-tr',
  signTrBuilder: '/sign-transaction?tr-builder',
  executeTransaction: '/execute-transaction',
};

export default routes;
