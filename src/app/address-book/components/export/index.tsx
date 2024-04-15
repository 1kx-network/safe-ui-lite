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
    const csvContent = addressBook
      .map(entry => `${entry.address},${entry.name},${entry.chainId}`)
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'address_book.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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
