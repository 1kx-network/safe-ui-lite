import routes from '@/app/routes';
import HomeSvg from '@/assets/svg/home.svg';
import SettingSvg from '@/assets/svg/settings.svg';
import TransactionSvg from '@/assets/svg/transaction.svg';

export const dataUserMock = {
  icon: 'https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png',
};

interface IMenu {
  id: number;
  url: string;
  title: string;
  icon: React.ElementType;
}

export const menuList: IMenu[] = [
  { id: 1, url: routes.home, title: 'Home', icon: HomeSvg },
  { id: 2, url: routes.walletPage, title: 'Wallet', icon: HomeSvg },
  { id: 3, url: routes.transactionsHistory, title: 'Transactions', icon: TransactionSvg },
  { id: 4, url: routes.settingsOwnersList, title: 'Settings', icon: SettingSvg },
];
