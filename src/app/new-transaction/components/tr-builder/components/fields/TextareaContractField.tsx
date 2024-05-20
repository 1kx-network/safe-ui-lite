import { WalletTextArea } from '@/ui-kit';
import { IWalletTextAreaProps } from '@/ui-kit/wallet-textarea';

const DEFAULT_ROWS = 4;

const TextareaContractField = (
  props: IWalletTextAreaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => {
  return <WalletTextArea {...props} multiline rows={props?.rows || DEFAULT_ROWS} />;
};

export default TextareaContractField;
