import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

import IconUser from '@/assets/svg/user.svg';
import IconChange from '@/assets/svg/edit.svg';
import IconDefaultAddress from '@/assets/svg/defult-icon-address.svg';
import IconTrash from '@/assets/svg/delete.svg';
import routes from '@/app/routes';
import { CustomModal, customToasty } from '@/components';
import { IAddressBook } from '@/stores/address-book-store';
import { WalletButton, WalletInput, WalletPaper, WalletTypography } from '@/ui-kit';

import {
  WrapperTable,
  HeaderGridStyled,
  ItemsInfoTable,
  TableInfoStyled,
  TableStringItemStyled,
  IconCopyStyled,
  LinkOpenInNewIconStyled,
  OpenInNewIconStyled,
  BoxIconActionStyled,
  styledBtn,
} from './table.styles';

interface ITableAddressBook {
  linkOnScan: string;
  chainId?: number;
  addressBook: IAddressBook[];
  setAddressBook: (payload: IAddressBook) => void;
  removeAddressBook: (payload: string) => void;
}

export const TableAddressBook = ({
  linkOnScan,
  addressBook,
  setAddressBook,
  removeAddressBook,
}: ITableAddressBook) => {
  const router = useRouter();
  const { chainId } = useWeb3ModalAccount();

  const [isOpenChangeAddress, setIsOpenChangeAddress] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userAddressError, setUserAddressError] = useState<string | null>(null);

  const handleChangeAddress = (user: IAddressBook) => {
    setUserName(user.name ?? '');
    setUserAddress(user.address);
    setIsOpenChangeAddress(true);
  };

  const handleRemoveAddress = (address: string) => {
    removeAddressBook(address);
    customToasty('Addres was remove', 'success', {
      duration: 1500,
    });
  };

  const handleReset = () => {
    setUserName('');
    setUserAddress('');
    setUserAddressError(null);
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    customToasty('Was copy', 'success');
  };

  const handleSendOnAddress = (address: string) => {
    const queryParams = {
      recipientAddress: address,
    };

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`${routes.newTransactionSendToken}?${queryString}`);
  };

  const handleChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);
  };

  const handleChangeUserAddress = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserAddress(value);

    if (value.length === 0) {
      setUserAddressError(null);
      return;
    }

    // Ethereum address
    const isValidEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(value);
    // Solana address (Base58 encoding)
    const isValidSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
    // Bitcoin address
    const isValidBitcoinAddress = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(value);

    if (isValidEthereumAddress || isValidSolanaAddress || isValidBitcoinAddress) {
      setUserAddressError(null);
    } else {
      setUserAddressError('Invalid address format');
    }
  };

  const handleChangeUserInfo = () => {
    setAddressBook({
      name: userName,
      address: userAddress,
      chainId: chainId ?? '',
    });
    setIsOpenChangeAddress(false);
    customToasty('User info was change', 'success');
  };

  return (
    <WrapperTable>
      {/*  */}
      <HeaderGridStyled>
        <ItemsInfoTable sx={{ width: '50%' }}>
          <WalletTypography fontWeight={500}>Name</WalletTypography>
        </ItemsInfoTable>
        <ItemsInfoTable sx={{ width: '40%' }}>
          <WalletTypography fontWeight={500}>Address</WalletTypography>
        </ItemsInfoTable>
        <ItemsInfoTable />
      </HeaderGridStyled>
      {/*  */}
      <WalletPaper>
        <TableInfoStyled>
          {addressBook &&
            addressBook.map((elem: IAddressBook) => (
              <TableStringItemStyled key={elem.address}>
                <Box display={'flex'} width={'66%'}>
                  <ItemsInfoTable sx={{ width: '40%' }}>
                    <WalletTypography fontSize={14} fontWeight={400}>
                      {elem.name}
                    </WalletTypography>
                  </ItemsInfoTable>
                  <ItemsInfoTable sx={{ width: '60%' }}>
                    <Box minWidth={'36px'} width="36px" height="36px">
                      <IconDefaultAddress />
                    </Box>
                    <WalletTypography fontSize={14} fontWeight={400}>
                      {elem.address}
                    </WalletTypography>

                    <LinkOpenInNewIconStyled
                      href={`${linkOnScan}address/${elem.address}`}
                      target="_blank"
                    >
                      <OpenInNewIconStyled />
                    </LinkOpenInNewIconStyled>

                    <IconCopyStyled onClick={() => handleCopy(elem.address)} />
                  </ItemsInfoTable>
                </Box>

                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'end'}
                  gap={1}
                  sx={{ width: '33%' }}
                >
                  <BoxIconActionStyled onClick={() => handleChangeAddress(elem)}>
                    <IconChange width="14px" height="14px" />
                  </BoxIconActionStyled>

                  <BoxIconActionStyled onClick={() => handleRemoveAddress(elem.address)}>
                    <IconTrash width="14px" height="14px" />
                  </BoxIconActionStyled>
                  <WalletButton
                    variant="outlined"
                    onClick={() => handleSendOnAddress(elem.address)}
                    styles={styledBtn}
                  >
                    Send
                  </WalletButton>
                </Box>
              </TableStringItemStyled>
            ))}
        </TableInfoStyled>
      </WalletPaper>
      {/*  */}
      <CustomModal
        isOpen={isOpenChangeAddress}
        closeModal={() => {
          setIsOpenChangeAddress(false);
          handleReset();
        }}
        styles={{ width: '560px' }}
      >
        <Box>
          <Box display={'flex'} alignItems={'center'} gap={1} mb={2}>
            <IconUser />
            <WalletTypography fontSize={18} fontWeight={500}>
              Edit entry
            </WalletTypography>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={3}>
            <WalletInput label="Name" onChange={handleChangeUserName} value={userName} />
            <WalletInput
              disabled={isOpenChangeAddress}
              label="Address"
              onChange={handleChangeUserAddress}
              value={userAddress}
              error={!!userAddressError}
              errorValue={userAddressError}
            />
          </Box>

          <Box display="flex" alignItems={'center'} justifyContent={'space-between'} gap={2} mt={4}>
            <WalletButton
              onClick={() => {
                setIsOpenChangeAddress(false);
                handleReset();
              }}
              variant="text"
            >
              Cancel
            </WalletButton>
            <WalletButton
              onClick={handleChangeUserInfo}
              variant="contained"
              disabled={!!userAddressError}
            >
              Save
            </WalletButton>
          </Box>
        </Box>
      </CustomModal>
    </WrapperTable>
  );
};
