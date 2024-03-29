import { ItemMenuStyled, WrapperStyled } from './tabs.styles';

interface ITab {
  id: number;
  title: string;
  url: string;
}

export const TabsSettings = ({ tabs }: { tabs: ITab[] }) => {
  return (
    <WrapperStyled>
      {tabs.map(item => (
        <ItemMenuStyled href={item.url} key={item.id} $isActive={true}>
          {item.title}
        </ItemMenuStyled>
      ))}
    </WrapperStyled>
  );
};
