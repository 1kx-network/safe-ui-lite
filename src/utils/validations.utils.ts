import * as yup from 'yup';

export const CreateSafeAccountSchema = yup.object().shape({
  name: yup.string().trim().min(1).required('This field is required'),
  chainId: yup.number().typeError('Must be a number').required('This field is required'),
});

// Ethereum address
const isValidEthereumAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

// Solana address (Base58 encoding)
const isValidSolanaAddress = (value: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);

// Bitcoin address
const isValidBitcoinAddress = (value: string) => /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(value);

// Function to validate Ethereum calldata (example function)
const isEthCalldataTransaction = (value: string) => /^0x([0-9a-fA-F]{2})*$/.test(value);

export const NewTransactionSchema = yup.object().shape({
  address: yup
    .string()
    .test(
      'is-valid-address',
      'Address must be a valid Ethereum, Solana, or Bitcoin address',
      value => {
        return (
          isValidEthereumAddress(value ?? '') ||
          isValidSolanaAddress(value ?? '') ||
          isValidBitcoinAddress(value ?? '')
        );
      }
    )
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
      value => isEthCalldataTransaction(value ?? '0x') // Call the ETH calldata validation function
    )
    .required('This field is required'),
});

function isEthCalldata(calldata: string) {
  if (calldata === '0x') return true;
  return /^0x[0-9a-fA-F]+$/.test(calldata);
}

export const AddNetworkSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  chainId: yup
    .string()
    .required('Chain ID is required')
    .matches(/^\d+$/, 'Chain ID must be a number'),
  rpc: yup.string().required('RPC URL is required').url('RPC URL must be a valid URL'),
  explorerUrl: yup.string().required('Explorer URL is required').url('RPC URL must be a valid URL'),
});

export const ChangeNetworkEnvSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  rpc: yup.string().required('RPC URL is required').url('RPC URL must be a valid URL'),
});
