'use client';

import React, { useState } from 'react';
import { styled } from '@mui/system';

import { weiToEther } from '../../utils/utils';
import { ProposedTransaction } from '../../typings/models';
import useElementHeight from '../../hooks/useElementHeight';
import { WalletTypography } from '@/ui-kit';

type TransactionDetailsProp = {
  transaction: ProposedTransaction;
};

const TransactionDetails = ({ transaction }: TransactionDetailsProp) => {
  const { description, raw } = transaction;

  const { to, value, data } = raw;
  const {
    contractMethod,
    contractFieldsValues,
    customTransactionData,
    networkPrefix,
    nativeCurrencySymbol,
  } = description;

  const isCustomHexDataTx = !!customTransactionData;
  const isContractInteractionTx = !!contractMethod && !isCustomHexDataTx;

  const isTokenTransferTx = !isCustomHexDataTx && !isContractInteractionTx;

  return (
    <Wrapper>
      <StyledTxTitle>
        {isTokenTransferTx
          ? `Transfer ${weiToEther(value)} ${nativeCurrencySymbol} to:`
          : 'Interact with:'}
      </StyledTxTitle>
      <WalletTypography>{networkPrefix || ''}</WalletTypography>

      <TxSummaryContainer>
        {/* to address */}
        <WalletTypography>to (address)</WalletTypography>
        <WalletTypography>{to || ''}</WalletTypography>

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
            <WalletTypography>{contractMethod.name}</WalletTypography>

            {/* method inputs */}
            {contractMethod.inputs.map(({ name, type }, index) => {
              const inputName = name || index;
              const inputLabel = `${inputName} (${type})`;
              const inputValue = contractFieldsValues?.[inputName];
              return (
                <React.Fragment key={`${inputLabel}-${index}`}>
                  {/* input name */}
                  <WalletTypography>{inputLabel}</WalletTypography>
                  {/* input value */}
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

export default TransactionDetails;

const Wrapper = styled('div')`
  flex-grow: 1;
  padding: 0 16px;
  user-select: text;
`;

const TxSummaryContainer = styled('div')`
  display: grid;
  grid-template-columns: minmax(100px, 2fr) minmax(100px, 5fr);
  gap: 4px;

  margin-top: 16px;
`;

const StyledTxTitle = styled('div')`
  font-size: 16px;
  margin: 8px 0;
  font-weight: bold;
  line-height: initial;
`;

const LINE_HEIGHT = 22;
const MAX_HEIGHT = 2 * LINE_HEIGHT; // 2 lines as max height

const TxValueLabel = ({ children }: { children: React.ReactNode }) => {
  const [showMore, setShowMore] = useState(false);

  const { height: containerHeight, elementRef } = useElementHeight<HTMLDivElement>();
  const showMoreButton = containerHeight && containerHeight > MAX_HEIGHT;

  return (
    <div ref={elementRef}>
      <WalletTypography>{children}</WalletTypography>
      {showMoreButton && (
        <StyledButtonLink color="primary" onClick={() => setShowMore(showMore => !showMore)}>
          {showMore ? 'Show less' : 'Show more'}
        </StyledButtonLink>
      )}
    </div>
  );
};

const StyledButtonLink = styled('div')`
  padding: 0;

  && > p {
    margin 0;
  }

`;
