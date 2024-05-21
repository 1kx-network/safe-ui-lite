'use client';

import { useRef } from 'react';

import { ContractInterface } from '../../typings/models';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
  parseFormToProposedTransaction,
} from '../solidity-form';
import useNetwork from '../../hooks/useNetwork';
import { isValidAddress } from '../../utils/utils';
import { WalletButton, WalletTypography } from '@/ui-kit';
import useTransactionStore from '../../store/tr-context-store';

type NewTransactionForm = {
  contract: ContractInterface | null;
  to: string;
  showHexEncodedData: boolean;
};

const NewTransactionForm = ({ contract, to, showHexEncodedData }: NewTransactionForm) => {
  const memorizedMethod = useRef('0');
  const initialFormValues = {
    [TO_ADDRESS_FIELD_NAME]: isValidAddress(to) ? to : '',
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: memorizedMethod.current ?? '0',
  };

  const { addTransaction } = useTransactionStore();
  const { networkPrefix, getAddressFromDomain, nativeCurrencySymbol } = useNetwork();

  const onSubmit = (values: SolidityFormValuesTypes) => {
    const proposedTransaction = parseFormToProposedTransaction(
      values,
      contract,
      nativeCurrencySymbol,
      networkPrefix
    );
    memorizedMethod.current = values[CONTRACT_METHOD_INDEX_FIELD_NAME];

    addTransaction(proposedTransaction);
  };

  return (
    <>
      <WalletTypography fontSize={18} fontWeight={500}>
        Transaction information
      </WalletTypography>

      <SolidityForm
        id="solidity-contract-form"
        initialValues={initialFormValues}
        contract={contract}
        getAddressFromDomain={getAddressFromDomain}
        nativeCurrencySymbol={nativeCurrencySymbol}
        networkPrefix={networkPrefix}
        onSubmit={onSubmit}
        showHexEncodedData={showHexEncodedData}
      >
        <WalletButton type="submit" variant="contained" styles={styledBtn}>
          Add transaction
        </WalletButton>
      </SolidityForm>
    </>
  );
};

export default NewTransactionForm;

const styledBtn = {
  marginTop: '1rem',
  width: 'fit-content',
  padding: '0.75rem 1.25rem',
};
