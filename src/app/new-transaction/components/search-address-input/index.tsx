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
  setAddress: (address: string) => void;
}

export const SearchAddress = ({ value, setAddress }: ISearchAddress) => {
  const [filterAddress, setFilterAddress] = useState<IAddressBook[] | null>(null);
  const { addressBook } = useAddressBookStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = addressBook.filter(
        (entry: IAddressBook) =>
          (entry.name?.toLowerCase().includes(value.toLowerCase()) ?? false) ||
          entry.address.toLowerCase().includes(value.toLowerCase())
      );
      setFilterAddress(filtered.length ? filtered : null);
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

  const handleChoose = (address: string) => {
    setAddress(address);
    setTimeout(() => setFilterAddress(null), 10);
  };

  return filterAddress?.length ? (
    <WrapperStyled ref={wrapperRef}>
      <BodyStyled>
        {filterAddress.map(({ name, address }) => (
          <ItemStyled key={address} onClick={() => handleChoose(address)}>
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
