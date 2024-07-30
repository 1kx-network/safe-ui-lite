import React, { useEffect, useRef, useState } from 'react';

import { WalletTypography } from '@/ui-kit';
import useAddressBookStore, { IAddressBook } from '@/stores/address-book-store';

import {
  BodyStyled,
  IconAddressStyled,
  ItemStyled,
  WrapperStyled,
  ItemInfoStyled,
} from './search-address.style';

interface ISearchAddress {
  value: string;
  setAddressBook: (name: string, address: string) => void;
}

export const SearchAddress = ({ value, setAddressBook }: ISearchAddress) => {
  const [filterAddress, setFilterAddress] = useState<IAddressBook[] | null>(null);
  const { addressBook } = useAddressBookStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && addressBook.length) {
      const filtered = addressBook.filter(
        (entry: IAddressBook) =>
          (entry.name?.toLowerCase().includes(value.toLowerCase()) ?? false) ||
          entry.address.toLowerCase().includes(value.toLowerCase())
      );
      setFilterAddress(filtered.length ? filtered : null);

      const exactMatch = addressBook.find(
        (entry: IAddressBook) => entry.address.toLowerCase() === value.toLowerCase()
      );

      if (exactMatch) {
        const nameAddress = exactMatch.name ?? 'Name is undefined';

        setAddressBook(nameAddress, exactMatch.address);
        setTimeout(() => setFilterAddress(null), 10);
      }
    } else {
      setFilterAddress(null);
    }
  }, [value, addressBook]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setFilterAddress(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleChoose = (name: string | undefined, address: string) => {
    const nameAddress = name ?? 'Name is undefined';

    setAddressBook(nameAddress, address);
    setTimeout(() => setFilterAddress(null), 10);
  };

  return filterAddress?.length ? (
    <WrapperStyled ref={wrapperRef}>
      <BodyStyled>
        {filterAddress.map(({ name, address }) => (
          <ItemStyled key={address} onClick={() => handleChoose(name, address)}>
            <IconAddressStyled />
            <ItemInfoStyled>
              <WalletTypography component="p">{name}</WalletTypography>
              <WalletTypography component="p">{address}</WalletTypography>
            </ItemInfoStyled>
          </ItemStyled>
        ))}
      </BodyStyled>
    </WrapperStyled>
  ) : null;
};
