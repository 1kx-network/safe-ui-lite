import { WalletInput } from '@/ui-kit';
import { IWalletInputProps } from '@/ui-kit/wallet-input';

const TextContractField = (
  props: React.InputHTMLAttributes<HTMLInputElement> & IWalletInputProps
) => <WalletInput {...props} errorValue={String(props.error)} required />;

export default TextContractField;
