import React from 'react';

import TransactionsProvider from './transactionsContext';
import TransactionLibraryProvider from './transactionLibraryContext';
import NetworkProvider from './networkContext';

const StoreProvider: React.FC = ({ children }: any) => {
  return (
    <NetworkProvider>
      {children}
      {/* <TransactionsProvider> */}
      {/* <TransactionLibraryProvider>{children}</TransactionLibraryProvider> */}
      {/* </TransactionsProvider> */}
    </NetworkProvider>
  );
};

export { useTransactions } from './transactionsContext';
export { useTransactionLibrary } from './transactionLibraryContext';
export { useNetwork } from './networkContext';

export default StoreProvider;
