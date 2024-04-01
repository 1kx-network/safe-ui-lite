import { ItemMenuStyled, WrapperStyled } from './tabs.styles';

export interface ITab {
  id: number;
  title: string;
  url: string;
}

export const CustomTabs = ({ tabs }: { tabs: ITab[] }) => {
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
