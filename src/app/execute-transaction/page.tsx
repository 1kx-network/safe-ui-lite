'use client';
import React, { Suspense, useCallback, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useSendTransaction } from 'wagmi';

import { WalletButton, WalletLayout, WalletPaper, WalletTypography } from '@/ui-kit';
import {
  BoxOwnerLinkStyled,
  GridButtonStyled,
  WrapperStyled,
  styledBtn,
} from '../sign-transaction/sing-transaction.styles';
import { SEPOLIA_ZK_MODULE } from '../../constants/addresses';
import { customToasty } from '../../components';

import { WalletTextarea } from './execute-transaction.styles';

function ExecuteComponent() {
  const { address } = useWeb3ModalAccount();
  const [callData, setCallData] = useState<`0x${string}`>('' as `0x${string}`);
  const { sendTransactionAsync } = useSendTransaction();
  const [txnhash, setTxnHash] = useState<string>('');

  const handlePaste = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCallData(text as `0x${string}`);
  }, []);

  const execute = async () => {
    if (!address || !callData) {
      return;
    }
    setTxnHash('');
    try {
      const hash = await sendTransactionAsync({
        to: SEPOLIA_ZK_MODULE,
        data: callData,
      });
      customToasty('Transaction sent', 'success');
      customToasty(`Transaction hash: ${hash}`, 'success');
      setTxnHash(hash);
    } catch (e) {
      console.error(e);
      customToasty('Error while sending transaction', 'error');
    }
  };

  return (
    <WalletLayout hideSidebar>
      <WrapperStyled>
        <WalletPaper>
          <WalletTypography fontSize={22} fontWeight={600}>
            Execute proofed transaction
          </WalletTypography>
          <BoxOwnerLinkStyled>
            <WalletTextarea
              placeholder="Paste your callData here"
              onChange={handlePaste}
              value={callData}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                fontSize: '16px',
                borderRadius: '14px',
              }}
            />
          </BoxOwnerLinkStyled>
          <GridButtonStyled>
            {address ? (
              <WalletButton
                disabled={status === 'loading'}
                variant={status === 'success' ? 'outlined' : 'contained'}
                styles={styledBtn}
                onClick={execute}
              >
                Execute
              </WalletButton>
            ) : (
              <WalletButton variant="outlined" styles={styledBtn}>
                Connect Wallet
              </WalletButton>
            )}
          </GridButtonStyled>
          {txnhash && (
            <>
              <h3>Transaction:</h3>
              <BoxOwnerLinkStyled style={{ overflow: 'hidden' }}>
                <a target="_blank" href={`https://etherscan.io/tx/${txnhash}`}>
                  {txnhash}
                </a>
              </BoxOwnerLinkStyled>
            </>
          )}
        </WalletPaper>
      </WrapperStyled>
    </WalletLayout>
  );
}

export default function ExecuteTransaction() {
  return (
    <Suspense>
      <ExecuteComponent />
    </Suspense>
  );
}
