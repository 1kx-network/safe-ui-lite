import * as yup from 'yup';

export const CreateSafeAccountSchema = yup.object().shape({
  name: yup.string().trim().min(1).required('This field is required'),
  chainId: yup.number().typeError('Must be a number').required('This field is required'),
});

export const NewTransactionSchema = yup.object().shape({
  address: yup
    .string()
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Address must be correct')
    .required('This field is required'),
  amount: yup
    .string()
    .matches(/^\d*\.?\d*$/, 'Amount must be a valid number')
    .required('This field is required'),
  calldata: yup
    .string()
    .test(
      'is-eth-calldata',
      'Calldata must be a valid Ethereum calldata string',
      value => isEthCalldata(value ?? '0x') // Call the ETH calldata validation function
    )
    .required('This field is required'),
});

function isEthCalldata(calldata: string) {
  if (calldata === '0x') return true;
  return /^0x[0-9a-fA-F]+$/.test(calldata);
}
