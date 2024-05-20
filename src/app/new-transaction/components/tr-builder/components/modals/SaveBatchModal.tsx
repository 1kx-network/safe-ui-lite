'use client';

import { useForm, ValidateResult } from 'react-hook-form';
import { Box, styled } from '@mui/system';

import { Batch } from '../../typings/models';
import Field from '../fields/Field';
import { TEXT_FIELD_TYPE } from '../fields/fields';
import { WalletButton } from '@/ui-kit';
import useTransactionLibrary from '../../hooks/transactionLibrary';
import { CustomModal } from '@/components';

type SaveBatchModalProps = {
  onClick: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
};
const BATCH_NAME_FIELD = 'batchName';

type CreateBatchFormValuesTypes = {
  [BATCH_NAME_FIELD]: string;
};

const SaveBatchModal = ({ onClick, onClose, isOpen }: SaveBatchModalProps) => {
  const { handleSubmit, control } = useForm<CreateBatchFormValuesTypes>({
    mode: 'onTouched',
  });

  const { batches } = useTransactionLibrary();

  const onSubmit = (values: CreateBatchFormValuesTypes) => {
    const { [BATCH_NAME_FIELD]: batchName } = values;
    onClick(batchName.trim());
  };

  return (
    <CustomModal closeModal={onClose} isOpen={isOpen}>
      <StyledModalBodyWrapper>
        <form id={'create-batch-form'} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            id="batch-name-input"
            name={BATCH_NAME_FIELD}
            label={'Batch name'}
            fieldType={TEXT_FIELD_TYPE}
            validations={[(value: string) => validateBatchName(value, batches)]}
            fullWidth
            required
            control={control}
            showErrorsInTheLabel={false}
          />
          <Box display="flex" alignItems="center" justifyContent="center" maxWidth={'450px'}>
            <WalletButton variant="contained" type="submit">
              Create
            </WalletButton>
          </Box>
        </form>
      </StyledModalBodyWrapper>
    </CustomModal>
  );
};

export default SaveBatchModal;

const StyledModalBodyWrapper = styled('div')`
  padding: 24px;
  max-width: 450px;
`;

const validateBatchName = (batchName: string, batches: Batch[]): ValidateResult => {
  const batchNames = batches.map(({ name }) => name);
  const isBatchNameAlreadyTaken = batchNames.includes(batchName);

  if (isBatchNameAlreadyTaken) {
    return 'this Batch name is already taken';
  }

  const trimmedBatchName = batchName.trim();

  if (!trimmedBatchName) {
    return 'Required';
  }
};
