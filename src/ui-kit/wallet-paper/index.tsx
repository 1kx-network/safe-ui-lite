import { ReactNode } from 'react';

import { PaperStyled } from './wallet-paper.styles';

interface IWalletPaper {
  children: ReactNode;
  style?: React.CSSProperties;
  minWidth?: string;
}

export const WalletPaper: React.FunctionComponent<IWalletPaper> = ({
  children,
  style,
  minWidth,
}) => (
  <PaperStyled style={style} minWidth={minWidth}>
    {children}
  </PaperStyled>
);
