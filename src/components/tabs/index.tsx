import { useSearchParams } from 'next/navigation';

import { ItemMenuStyled, WrapperStyled } from './tabs.styles';

export interface ITab {
  id: number;
  title: string;
  url: string;
}

export const CustomTabs = ({ tabs }: { tabs: ITab[] }) => {
  const searchParams = useSearchParams();
  const isActive = (url: string) => searchParams.toString().includes(url.split('?')[1]);

  return (
    <WrapperStyled>
      {tabs.map(item => (
        <ItemMenuStyled href={item.url} key={item.id} $isactive={isActive(item.url)}>
          {item.title}
        </ItemMenuStyled>
      ))}
    </WrapperStyled>
  );
};
