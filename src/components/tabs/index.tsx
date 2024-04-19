import { usePathname } from 'next/navigation';

import { ItemMenuStyled, WrapperStyled } from './tabs.styles';

export interface ITab {
  id: number;
  title: string;
  url: string;
}

export const CustomTabs = ({ tabs }: { tabs: ITab[] }) => {
  const pathName = usePathname();

  return (
    <WrapperStyled>
      {tabs.map(item => (
        <ItemMenuStyled href={item.url} key={item.id} $isActive={item.url === pathName}>
          {item.title}
        </ItemMenuStyled>
      ))}
    </WrapperStyled>
  );
};
