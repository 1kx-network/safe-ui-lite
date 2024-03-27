import { WalletPaper, WalletTypography } from '@/ui-kit';
import CheckIcon from '@/assets/svg/check.svg';
import { transactions } from '../../fixtures';
import { styledHeader } from '../../entry-page.styles';

import { ItemTransactionStyled, styledPaper } from './transactions.styles';

export const Transactions = () => {
  return (
    <>
      <WalletTypography style={styledHeader}>Pending transactions</WalletTypography>
      <WalletPaper style={styledPaper}>
        {transactions.map(elem => (
          <ItemTransactionStyled key={elem.id}>
            <WalletTypography fontSize={12} fontWeight={600}>
              {elem.status}
            </WalletTypography>
            <WalletTypography fontSize={12}>about {elem.timeHour} hour ago</WalletTypography>
            <WalletTypography fontSize={12} fontWeight={600}>
              {elem.signedByOwner} out of {elem.owners}
            </WalletTypography>
            <WalletTypography fontSize={12}>
              {elem.status === 'done' ? <CheckIcon /> : ''}
            </WalletTypography>
            <WalletTypography fontSize={12}>{elem.addInfo}</WalletTypography>
          </ItemTransactionStyled>
        ))}
      </WalletPaper>
    </>
  );
};
