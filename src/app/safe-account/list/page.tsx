'use client';
import React from 'react';

import { WalletTypography, WalletPaper, WalletLayout, WalletButton } from '@/ui-kit';

import { ListItem } from './components/list-item/list-item';
import { HeaderStyled, MainContainerStyled } from './list.styles';
import { mockAcc } from './fixtures';

export default function SafeAccountList() {
  return (
    <WalletLayout hideSidebar>
      <MainContainerStyled>
        <HeaderStyled>
          <WalletTypography fontWeight={600} fontSize={22}>
            Safe accounts
          </WalletTypography>
          <WalletButton variant="contained">Create account</WalletButton>
        </HeaderStyled>

        <WalletPaper>
          {mockAcc.length ? (
            mockAcc.map(elem => <ListItem key={elem.id} {...elem} />)
          ) : (
            <WalletTypography fontSize={17} textAlign="center">
              You dont have any Safe Account
            </WalletTypography>
          )}
        </WalletPaper>
      </MainContainerStyled>
    </WalletLayout>
  );
}
