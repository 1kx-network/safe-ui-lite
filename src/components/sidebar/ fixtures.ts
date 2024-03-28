import routes from '@/app/routes';
import HomeSvg from '@/assets/svg/home.svg';
import SettingSvg from '@/assets/svg/settings.svg';

export const dataUserMock = {
  icon: 'https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png',
  name: 'Praiseworthy gnosis',
  id: 'gno:0x0eA9ecE',
  count: '0.00',
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
  { id: 3, url: routes.settingsOwnersList, title: 'Settings', icon: SettingSvg },
  // { id: 3, url: routes.transactions ,title: 'Transactions', icon: TransactionSvg },
  // { id: 4, url: routes.settings ,title: 'Settings', icon: SettingSvg },
];
