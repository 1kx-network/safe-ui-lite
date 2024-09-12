import { ReactNode } from 'react';

import { PaperStyled } from './wallet-paper.styles';

interface IWalletPaper {
  children: ReactNode;
  style?: React.CSSProperties;
  minWidth?: string;
  id?: string;
  border?: boolean;
}

export const WalletPaper: React.FunctionComponent<IWalletPaper> = ({
  children,
  style,
  minWidth,
  id,
  border,
}) => (
  <PaperStyled style={style} $minWidth={minWidth} id={id} $border={border}>
    {children}
  </PaperStyled>
);
