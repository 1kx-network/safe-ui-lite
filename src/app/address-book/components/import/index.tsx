'use client';
import { useState } from 'react';
import { Box } from '@mui/system';

import { WalletButton, WalletTypography } from '@/ui-kit';
import { CustomModal, customToasty } from '@/components';
import { IAddressBook } from '@/stores/address-book-store';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { BoxIconActionStyled } from '../table/table.styles';
import IconUser from '@/assets/svg/user.svg';
import IconTrash from '@/assets/svg/delete.svg';

import { AddStyled, DragAndDropStyled, GridBtnAddStyled, styledBtn } from './import-styles';

interface IImportModal {
  isOpen: boolean;
  closeModal: () => void;
  setAddressBookArray: (payload: IAddressBook[]) => void;
}

export const ImportModal = ({ isOpen, closeModal, setAddressBookArray }: IImportModal) => {
  const [addressImport, setAddressImport] = useState<IAddressBook[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImport = () => {
    closeModal();
    if (!addressImport) return;

    setAddressBookArray(addressImport);
    setAddressImport(null);
    setFileName(null);
  };

  const handleFileInput = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csvData = reader.result as string;
      const csvDataWithoutQuotes = csvData.replace(/['"]/g, '');

      const csvArray = csvDataWithoutQuotes.split('\n').map(row => {
        const [address, name, chainId] = row.split(',');
        return { address, chainId, name };
      });

      setAddressImport(csvArray);
    };
    reader.onerror = () => {
      customToasty('Error reading the CSV file', 'error');
    };
  };

  const handleOnDropOrChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if ('dataTransfer' in event && event.dataTransfer) {
      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFileInput(file);
      }
    } else if (event.target instanceof HTMLInputElement && event.target.files?.[0]) {
      const file = event.target.files[0];
      handleFileInput(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setAddressImport(null);
    setFileName(null);
  };

  return (
    <CustomModal isOpen={isOpen} closeModal={closeModal} styles={{ width: '560px' }}>
      <AddStyled>
        <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
          <IconUser />
          <WalletTypography fontSize={18} fontWeight={500}>
            Import address book
          </WalletTypography>
        </Box>
        <DragAndDropStyled onDragOver={handleDragOver} onDrop={handleOnDropOrChange}>
          <WalletTypography fontSize={14} fontWeight={400} color={themeMuiBase.palette.greyToo}>
            Drag and drop a CSV file or{' '}
            <label htmlFor="fileInput">
              <WalletTypography
                fontSize={14}
                fontWeight={400}
                color={themeMuiBase.palette.greyToo}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                choose file
              </WalletTypography>
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleOnDropOrChange}
            />
          </WalletTypography>
        </DragAndDropStyled>

        <WalletTypography fontSize={14} fontWeight={400}>
          Only CSV files can be imported.
        </WalletTypography>

        {addressImport?.length && (
          <Box display={'flex'} flexDirection={'column'} gap={1} mt={3}>
            <WalletTypography fontSize={14} fontWeight={400}>
              Found {addressImport.length - 1} entries
            </WalletTypography>

            <Box display={'flex'} alignItems={'center'} gap={3}>
              <WalletTypography fontSize={14} fontWeight={500}>
                {fileName}
              </WalletTypography>

              <BoxIconActionStyled onClick={handleRemove}>
                <IconTrash width="14px" height="14px" />
              </BoxIconActionStyled>
            </Box>
          </Box>
        )}

        <GridBtnAddStyled>
          <WalletButton styles={styledBtn} onClick={closeModal} variant="text">
            Cancel
          </WalletButton>
          <WalletButton
            styles={styledBtn}
            onClick={handleImport}
            variant="contained"
            disabled={!addressImport?.length}
          >
            Import
          </WalletButton>
        </GridBtnAddStyled>
      </AddStyled>
    </CustomModal>
  );
};
