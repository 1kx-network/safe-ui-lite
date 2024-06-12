'use client';
import React from 'react';
import { Box } from '@mui/system';

import { ProposedTransaction } from '../../typings/models';
import { weiToEther } from '../../utils/utils';
import useElementHeight from '../../hooks/useElementHeight';
import { WalletTypography } from '@/ui-kit';
import { formattedLabel } from '@/utils/formatters';
import { customToasty } from '@/components';

import {
  IconCopyStyled,
  StyledMethodNameLabel,
  StyledTxTitle,
  StyledTxValueLabel,
  TxSummaryContainer,
  Wrapper,
} from './TransactionDetailsItem.styles';

type TransactionDetailsProp = {
  transaction: ProposedTransaction;
};

const TransactionDetailsItem = ({ transaction }: TransactionDetailsProp) => {
  const { description, raw } = transaction;

  const { to, value, data } = raw;
  const { contractMethod, contractFieldsValues, customTransactionData, nativeCurrencySymbol } =
    description;

  const isCustomHexDataTx = !!customTransactionData;
  const isContractInteractionTx = !!contractMethod && !isCustomHexDataTx;

  const isTokenTransferTx = !isCustomHexDataTx && !isContractInteractionTx;

  const handleCopy = () => {
    navigator.clipboard.writeText(to);
    customToasty('Address was copy', 'success');
  };

  return (
    <Wrapper>
      <StyledTxTitle>
        {isTokenTransferTx
          ? `Transfer ${weiToEther(value)} ${nativeCurrencySymbol} to:`
          : 'Interact with:'}
      </StyledTxTitle>
      <WalletTypography>{to}</WalletTypography>

      <TxSummaryContainer>
        <WalletTypography>to (address)</WalletTypography>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <WalletTypography>{formattedLabel(to)}</WalletTypography>
          <IconCopyStyled onClick={handleCopy} />
        </Box>

        {/* value */}
        <WalletTypography>value:</WalletTypography>
        <TxValueLabel>{`${weiToEther(value)} ${nativeCurrencySymbol}`}</TxValueLabel>

        {/* data */}
        <WalletTypography>data:</WalletTypography>
        <TxValueLabel>{data}</TxValueLabel>

        {isContractInteractionTx && (
          <>
            {/* method */}
            <WalletTypography>method:</WalletTypography>
            <StyledTxValueLabel>{contractMethod.name}</StyledTxValueLabel>

            {/* method inputs */}
            {contractMethod.inputs.map(({ name, type }, index) => {
              const inputName = name || index;
              const inputLabel = `${inputName} (${type})`;
              const inputValue = contractFieldsValues?.[inputName];
              return (
                <React.Fragment key={`${inputLabel}-${index}`}>
                  <StyledMethodNameLabel>{inputLabel}</StyledMethodNameLabel>

                  <TxValueLabel>{inputValue}</TxValueLabel>
                </React.Fragment>
              );
            })}
          </>
        )}
      </TxSummaryContainer>
    </Wrapper>
  );
};

export default TransactionDetailsItem;

const TxValueLabel = ({ children }: { children: React.ReactNode }) => {
  const { elementRef } = useElementHeight<HTMLDivElement>();
  return (
    <div ref={elementRef}>
      <StyledTxValueLabel>{children}</StyledTxValueLabel>
    </div>
  );
};
