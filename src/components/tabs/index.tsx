import { useSearchParams } from 'next/navigation';

import routes from '@/app/routes';

import { ItemMenuStyled, WrapperStyled } from './tabs.styles';

export interface ITab {
  id: number;
  title: string;
  url: string;
}

export const CustomTabs = ({ tabs }: { tabs: ITab[] }) => {
  const searchParams = useSearchParams();

  const defaultActive = (url: string) => url === routes.settingsOwnersList;

  return (
    <WrapperStyled>
      {tabs.map(item => (
        <ItemMenuStyled
          href={item.url}
          key={item.id}
          $isActive={
            searchParams.toString().includes(item.url.split('?')[1])
              ? true
              : defaultActive(item.url)
          }
        >
          {item.title}
        </ItemMenuStyled>
      ))}
    </WrapperStyled>
  );
};
