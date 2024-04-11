'use client';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import { WalletButton, WalletInput, WalletLayout, WalletTypography } from '@/ui-kit';
import { networks } from '@/context/networks';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import IconPlus from '@/assets/svg/plus.svg';
import IconImport from '@/assets/svg/import.svg';
import IconExport from '@/assets/svg/export.svg';
import useAddressBookStore from '@/stores/address-book-store';

import { TableAddressBook } from './components/table/table';
import { WrapperStyled, styledBtn, InputStyled, BoxSearchStyled } from './address-book.styles';
import { CreateEntryModal } from './components/create-entry';
import { ExportModal } from './components/export';
import { ImportModal } from './components/import';

export default function AddressBoook() {
  const { chainId } = useWeb3ModalAccount();
  const { addressBook, setAddressBook, removeAddressBook, setAddressBookArray } =
    useAddressBookStore();

  const [linkOnScan, setLinkOnScan] = useState<string>('');
  const [value, setValue] = useState('');

  const [isOpenExportModal, setIsOpenExportModal] = useState(false);
  const [isOpenCreateEntry, setIsOpenCreateEntry] = useState(false);
  const [isOpenImportModal, setIsOpenImportModal] = useState(false);

  useEffect(() => {
    setAddressBookArray([{ address: 'address1', chainId: 1, name: 'Name 1' }]);
  }, [chainId]);

  useEffect(() => {
    if (chainId) {
      const linkOnScan = networks.find(elem => elem.chainId === chainId)?.explorerUrl;
      if (linkOnScan) {
        setLinkOnScan(linkOnScan);
      }
    }
  }, [chainId]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
  };

  const filteredAddressBook = addressBook.filter(entry => {
    const searchLowercase = value.toLowerCase();
    return (
      entry.address.toLowerCase().includes(searchLowercase) ||
      (entry.name && entry.name.toLowerCase().includes(searchLowercase))
    );
  });

  return (
    <WalletLayout>
      <WrapperStyled>
        <Box mb={8}>
          <WalletTypography fontSize={22} fontWeight={600}>
            Address book
          </WalletTypography>
        </Box>
        <BoxSearchStyled>
          <InputStyled>
            <WalletInput placeholder="Search" isSearch value={value} onChange={handleChangeValue} />
          </InputStyled>

          <Box display={'flex'} alignItems={'center'} justifyContent={'end'} width={'50%'}>
            <WalletButton
              variant="text"
              onClick={() => setIsOpenImportModal(true)}
              styles={styledBtn}
            >
              <Box width="20px" height="21px" minWidth="20px" color={themeMuiBase.palette.success}>
                <IconImport />
              </Box>
              Import
            </WalletButton>
            <WalletButton
              variant="text"
              onClick={() => setIsOpenExportModal(true)}
              styles={styledBtn}
            >
              <Box width="20px" height="21px" minWidth="20px" color={themeMuiBase.palette.success}>
                <IconExport />
              </Box>
              Export
            </WalletButton>
            <WalletButton
              variant="text"
              onClick={() => setIsOpenCreateEntry(true)}
              styles={styledBtn}
            >
              <Box width="20px" height="21px" minWidth="20px" color={themeMuiBase.palette.success}>
                <IconPlus />
              </Box>
              Create entry
            </WalletButton>
          </Box>
        </BoxSearchStyled>

        {filteredAddressBook.length ? (
          <TableAddressBook
            linkOnScan={linkOnScan}
            chainId={chainId}
            addressBook={filteredAddressBook}
            setAddressBook={setAddressBook}
            removeAddressBook={removeAddressBook}
          />
        ) : (
          <WalletTypography fontWeight={500}>No Address</WalletTypography>
        )}
      </WrapperStyled>

      <CreateEntryModal
        isOpen={isOpenCreateEntry}
        closeModal={() => setIsOpenCreateEntry(false)}
        setAddressBook={setAddressBook}
      />
      <ExportModal
        addressBook={addressBook}
        isOpen={isOpenExportModal}
        closeModal={() => setIsOpenExportModal(false)}
      />

      <ImportModal
        isOpen={isOpenImportModal}
        closeModal={() => setIsOpenImportModal(false)}
        setAddressBookArray={setAddressBookArray}
      />
    </WalletLayout>
  );
}
