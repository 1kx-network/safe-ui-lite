import { Box } from '@mui/system';
import { ChangeEvent, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { CustomModal, customToasty } from '@/components';
import { WalletButton, WalletInput, WalletTypography } from '@/ui-kit';
import IconUser from '@/assets/svg/user.svg';
import { IAddressBook } from '@/stores/address-book-store';

import { AddStyled, GridBtnAddStyled, styledBtn } from './create-entry-styles';

interface ICreateEntryModal {
  isOpen: boolean;
  closeModal: () => void;
  setAddressBook: (payload: IAddressBook) => void;
}

export const CreateEntryModal = ({ isOpen, closeModal, setAddressBook }: ICreateEntryModal) => {
  const { chainId } = useWeb3ModalAccount();

  const [valueName, setValueName] = useState('');
  const [valueAddress, setValueAddress] = useState('');
  const [valueAddressError, setValueAddressError] = useState<string | null>(null);

  const handleChangeValueAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueAddress(value);

    if (value.length === 0) {
      setValueAddressError(null);
      return;
    }

    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(value);

    if (isValidAddress) {
      setValueAddressError(null);
    } else {
      setValueAddressError('Invalid address format');
    }
  };

  const handleChangeValueName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValueName(value);
  };

  const handleAdd = () => {
    setAddressBook({
      name: valueName,
      address: valueAddress,
      chainId,
    });
    customToasty('New contact was add', 'success');
    closeModal();
  };

  return (
    <CustomModal isOpen={isOpen} closeModal={closeModal} styles={{ width: '560px' }}>
      <AddStyled>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <IconUser />
          <WalletTypography fontSize={18} fontWeight={500}>
            Add contact
          </WalletTypography>
        </Box>

        <WalletInput
          label="Name"
          placeholder="Name"
          value={valueName}
          onChange={handleChangeValueName}
        />

        <WalletInput
          label="New address"
          placeholder="Address"
          value={valueAddress}
          onChange={handleChangeValueAddress}
          error={!!valueAddressError}
          errorValue={valueAddressError}
        />

        <GridBtnAddStyled>
          <WalletButton styles={styledBtn} onClick={closeModal} variant="text">
            Cancel
          </WalletButton>
          <WalletButton
            styles={styledBtn}
            onClick={handleAdd}
            variant="contained"
            disabled={!!valueAddressError || !valueAddress}
          >
            Next
          </WalletButton>
        </GridBtnAddStyled>
      </AddStyled>
    </CustomModal>
  );
};
