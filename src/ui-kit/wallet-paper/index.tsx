import { ReactNode } from 'react';

import { PaperStyled } from './wallet-paper.styles';

interface IWalletPaper {
  children: ReactNode;
  style?: React.CSSProperties | {};
}

export const WalletPaper: React.FunctionComponent<IWalletPaper> = ({ children, style }) => (
  <PaperStyled style={style}>{children}</PaperStyled>
);
