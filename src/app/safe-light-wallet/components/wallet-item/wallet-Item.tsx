import { Box } from '@mui/system';
import { WalletButton, WalletInput } from '@/ui-kit';
import { InputWrapperStyled, styledButton, styledButtonDelete } from './wallet-item.styles';
import DeleteIcon from '@/assets/svg/delete.svg';

interface IDataWallet {
  id: number;
  value?: string;
}

interface IWalletItem {
  dataItem: IDataWallet;
  handleAddWallet: (elem: IDataWallet) => void;
  handleRemoveWallet: (walletId: number) => void;
}

export const WalletItem = ({ dataItem, handleAddWallet, handleRemoveWallet }: IWalletItem) => {
  return (
    <InputWrapperStyled key={dataItem.id}>
      <Box width={'100%'}>
        <WalletInput
          label={`Wallet address ${dataItem.id}`}
          placeholder="Placeholder text"
          value={dataItem.value}
        />
      </Box>
      <WalletButton
        onClick={() => handleAddWallet(dataItem)}
        variant="contained"
        styles={styledButton}
      >
        Add Wallet
      </WalletButton>
      {dataItem.id !== 1 && (
        <WalletButton
          onClick={() => handleRemoveWallet(dataItem.id)}
          variant="outlined"
          styles={styledButtonDelete}
        >
          <DeleteIcon />
        </WalletButton>
      )}
    </InputWrapperStyled>
  );
};
