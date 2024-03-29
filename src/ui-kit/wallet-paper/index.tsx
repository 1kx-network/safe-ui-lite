import { ReactNode } from 'react';

import { PaperStyled } from './wallet-paper.styles';

interface IWalletPaper {
  children: ReactNode;
  style?: React.CSSProperties;
  minWidth?: string;
  id?: string;
}

export const WalletPaper: React.FunctionComponent<IWalletPaper> = ({
  children,
  style,
  minWidth,
  id,
}) => (
  <PaperStyled style={style} $minWidth={minWidth} id={id}>
    {children}
  </PaperStyled>
);
