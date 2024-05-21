import routes from '../routes';

export const tabsMenu = [
  { id: 1, title: 'Send tokens', url: routes.newTransactionSendToken },
  { id: 2, title: 'Transaction builder', url: routes.newTransactionTrxBuilder },
];

export enum TYPE_ABI {
  PROXY = 'PROXY',
  IMPLEMENTATION = 'IMPLEMENTATION',
}

