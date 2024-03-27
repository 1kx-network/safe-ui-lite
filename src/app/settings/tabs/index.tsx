import { usePathname } from 'next/navigation';

import { ItemMenuStyled, WrapperStyled } from './tabs.styles';
import { settingsMenu } from './fixuters';

export const TabsSettings = () => {
  const pathname = usePathname();

  return (
    <WrapperStyled>
      {settingsMenu.map(item => (
        <ItemMenuStyled href={item.url} key={item.id} isActive={item.url === pathname}>
          {item.title}
        </ItemMenuStyled>
      ))}
    </WrapperStyled>
  );
};
