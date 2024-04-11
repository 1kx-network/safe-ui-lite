import { Box } from '@mui/system';

import { CustomModal } from '@/components';
import { WalletButton, WalletTypography } from '@/ui-kit';
import IconUser from '@/assets/svg/user.svg';
import { IAddressBook } from '@/stores/address-book-store';

import { AddStyled, GridBtnAddStyled, styledBtn } from './export-styles';

interface IExportModal {
  isOpen: boolean;
  closeModal: () => void;
  addressBook: IAddressBook[];
}

export const ExportModal = ({ isOpen, closeModal, addressBook }: IExportModal) => {
  const handleExport = () => {
    console.log('_export_as_addressBook', addressBook);
    closeModal();
  };

  return (
    <CustomModal isOpen={isOpen} closeModal={closeModal} styles={{ width: '560px' }}>
      <AddStyled>
        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
          <IconUser />
          <WalletTypography fontSize={18} fontWeight={500}>
            Export address book
          </WalletTypography>
        </Box>

        <WalletTypography>
          Youre about to export a CSV file with {addressBook.length} address book entries.
        </WalletTypography>

        <GridBtnAddStyled>
          <WalletButton styles={styledBtn} onClick={closeModal} variant="text">
            Cancel
          </WalletButton>
          <WalletButton styles={styledBtn} onClick={handleExport} variant="contained">
            Export
          </WalletButton>
        </GridBtnAddStyled>
      </AddStyled>
    </CustomModal>
  );
};
