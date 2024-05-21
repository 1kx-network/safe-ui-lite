'use client';

import { Box, styled } from '@mui/system';

import { ProposedTransaction } from '../../typings/models';
import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  CONTRACT_VALUES_FIELD_NAME,
  CUSTOM_TRANSACTION_DATA_FIELD_NAME,
  NATIVE_VALUE_FIELD_NAME,
  parseFormToProposedTransaction,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
} from '../solidity-form';
import { weiToEther } from '../../utils/utils';
import { WalletButton, WalletTypography } from '@/ui-kit';
import { CustomModal } from '@/components';

type EditTransactionModalProps = {
  txIndex: number;
  transaction: ProposedTransaction;
  onSubmit: (newTransaction: ProposedTransaction) => void;
  onDeleteTx: () => void;
  onClose: () => void;
  nativeCurrencySymbol: string | undefined;
  networkPrefix: string | undefined;
  getAddressFromDomain: (name: string) => Promise<string>;
  isOpen: boolean;
};

const EditTransactionModal = ({
  txIndex,
  transaction,
  onSubmit,
  onDeleteTx,
  onClose,
  nativeCurrencySymbol,
  networkPrefix,
  getAddressFromDomain,
  isOpen,
}: EditTransactionModalProps) => {
  const { description, contractInterface } = transaction;

  const { customTransactionData, contractFieldsValues, contractMethodIndex } = description;

  const isCustomHexDataTx = !!customTransactionData;

  const initialFormValues: Partial<SolidityFormValuesTypes> = {
    [TO_ADDRESS_FIELD_NAME]: transaction.raw.to,
    [NATIVE_VALUE_FIELD_NAME]: weiToEther(transaction.raw.value),
    [CUSTOM_TRANSACTION_DATA_FIELD_NAME]: customTransactionData,
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: contractMethodIndex,
    [CONTRACT_VALUES_FIELD_NAME]: {
      [`method-${contractMethodIndex}`]: contractFieldsValues || {},
    },
  };

  const handleSubmit = (values: SolidityFormValuesTypes) => {
    const editedTransaction = parseFormToProposedTransaction(
      values,
      contractInterface,
      nativeCurrencySymbol,
      networkPrefix
    );

    onSubmit({ ...editedTransaction, id: transaction.id });
  };

  return (
    <CustomModal closeModal={onClose} isOpen={isOpen}>
      <Box display={'flex'} flexDirection={'column'} gap={6}>
        <WalletTypography fontSize={21} fontWeight={500}>
          Transaction {txIndex + 1}
        </WalletTypography>

        <FormContainer>
          <SolidityForm
            id="solidity-contract-form"
            initialValues={initialFormValues}
            contract={contractInterface}
            nativeCurrencySymbol={nativeCurrencySymbol}
            networkPrefix={networkPrefix}
            getAddressFromDomain={getAddressFromDomain}
            showHexEncodedData={!!isCustomHexDataTx}
            onSubmit={handleSubmit}
          >
            <Box display={'flex'} alignItems={'center'} gap={3} mt={4}>
              <WalletButton variant="outlined" onClick={onDeleteTx}>
                Delete
              </WalletButton>

              <WalletButton variant="contained" type="submit">
                Save transaction
              </WalletButton>
            </Box>
          </SolidityForm>
        </FormContainer>
      </Box>
    </CustomModal>
  );
};

const FormContainer = styled('div')`
  width: 400px;
`;

export default EditTransactionModal;
