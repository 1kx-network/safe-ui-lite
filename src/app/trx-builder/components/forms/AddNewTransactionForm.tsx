import { Title, Button } from '@gnosis.pm/safe-react-components';
// import styled from 'styled-components';

import { styled } from '@mui/system';
import { useEffect, useState } from 'react';

import { ContractInterface } from '../../typings/models';
import { isValidAddress } from '../../utils';
import { useTransactions, useNetwork } from '../../store';
import { NetworkContextProps } from '../../store/networkContext';

import SolidityForm, {
  CONTRACT_METHOD_INDEX_FIELD_NAME,
  SolidityFormValuesTypes,
  TO_ADDRESS_FIELD_NAME,
  parseFormToProposedTransaction,
} from './SolidityForm';

type AddNewTransactionFormProps = {
  contract: ContractInterface | null;
  to: string;
  showHexEncodedData: boolean;
};

const AddNewTransactionForm = ({
  contract,
  to,
  showHexEncodedData,
}: AddNewTransactionFormProps) => {
  const initialFormValues = {
    [TO_ADDRESS_FIELD_NAME]: isValidAddress(to) ? to : '',
    [CONTRACT_METHOD_INDEX_FIELD_NAME]: '0',
  };

  const { addTransaction } = useTransactions();
  const [dataNetwork, setDataNetwork] = useState<NetworkContextProps | undefined>();

  const dataUseNetwork = useNetwork();

  useEffect(() => {
    if (!dataUseNetwork) return;
    setDataNetwork(dataUseNetwork);
  }, [dataNetwork]);

  const onSubmit = (values: SolidityFormValuesTypes) => {
    if (!dataNetwork) return;

    const proposedTransaction = parseFormToProposedTransaction(
      values,
      contract,
      dataNetwork.nativeCurrencySymbol,
      dataNetwork.networkPrefix
    );

    addTransaction(proposedTransaction);
  };

  return (
    <>
      <Title size="xs">Transaction information</Title>

      {dataNetwork && (
        <SolidityForm
          id="solidity-contract-form"
          initialValues={initialFormValues}
          contract={contract}
          getAddressFromDomain={dataNetwork.getAddressFromDomain}
          nativeCurrencySymbol={dataNetwork.nativeCurrencySymbol}
          networkPrefix={dataNetwork.networkPrefix}
          onSubmit={onSubmit}
          showHexEncodedData={showHexEncodedData}
        >
          <ButtonContainer>
            {/* Add transaction btn */}
            <Button size="md" color="primary" type="submit">
              Add transaction
            </Button>
          </ButtonContainer>
        </SolidityForm>
      )}
    </>
  );
};

export default AddNewTransactionForm;

const ButtonContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;
