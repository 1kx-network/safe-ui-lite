import { ChangeEvent, useEffect, useState } from 'react';

import { WalletButton, WalletInput, WalletSelect } from '@/ui-kit';
import useTransactionsStore from '@/stores/transactions-store';

import { ItemMenuStyled, WrapperStyled, styledBtn } from './filters-menu.styles';

interface IOption {
  id: number;
  label: string;
  value: string;
  item: number;
}

const optionsDate: IOption[] = [
  { id: 1, label: 'All', value: 'All', item: 0 },
  { id: 2, label: 'Less 7 Days', value: 'Past 7 Days', item: 7 },
  { id: 3, label: 'Less 14 Days', value: 'Past 14 Days', item: 14 },
];

const optionsAmount: IOption[] = [
  { id: 1, label: 'All', value: 'All', item: 0 },
  { id: 2, label: 'Less 100', value: 'Less 100', item: 100 },
  { id: 3, label: 'Less 200', value: 'Less 200', item: 200 },
];

export const MenuFilters = () => {
  const { setTransactionsFilter, transactions } = useTransactionsStore();
  const [value, setValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<IOption | null | undefined>(null);
  const [selectedAmount, setSelectedAmount] = useState<IOption | null | undefined>(null);

  const applyFilters = () => {
    if (!transactions) return;

    let filteredTransactions = transactions;

    // Применяем фильтр по дате, если он установлен
    if (selectedDate !== null && selectedDate !== undefined) {
      filteredTransactions = filteredTransactions.filter(transaction => {
        const currentDate = new Date();
        const transactionDate = new Date(transaction.date);
        const dateDifference = currentDate.getTime() - transactionDate.getTime();
        const daysDifference = Math.ceil(dateDifference / (1000 * 60 * 60 * 24));
        return daysDifference <= selectedDate.item;
      });
    }

    console.log(selectedAmount);

    // Применяем фильтр по сумме, если он установлен
    if (selectedAmount !== null && selectedAmount !== undefined) {
      filteredTransactions = filteredTransactions.filter(
        transaction => parseFloat(transaction.amount) <= selectedAmount.item
      );
    }

    // Применяем фильтр по значению, если оно установлено
    if (value) {
      const lowercaseValue = value.toLowerCase();
      filteredTransactions = filteredTransactions.filter(
        transaction =>
          transaction.date.toLowerCase().includes(lowercaseValue) ||
          transaction.owners.some(owner => owner.toLowerCase().includes(lowercaseValue)) ||
          parseFloat(transaction.amount) <= parseFloat(lowercaseValue)
      );
    }

    setTransactionsFilter(filteredTransactions);
  };

  const handleReset = () => {
    setTransactionsFilter(transactions);
    setValue('');
    setSelectedDate(null);
    setSelectedAmount(null);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedDate, selectedAmount, value]);

  return (
    transactions && (
      <WrapperStyled>
        <ItemMenuStyled>
          <WalletSelect
            placeholder="Date"
            options={optionsDate}
            value={selectedDate}
            onChange={(newValue: IOption | null | undefined) => {
              if (newValue?.item === 0) {
                setSelectedDate(null);
                return;
              }
              setSelectedDate(newValue);
            }}
          />
        </ItemMenuStyled>
        <ItemMenuStyled>
          <WalletSelect
            placeholder="Amount"
            options={optionsAmount}
            value={selectedAmount}
            onChange={(newValue: IOption | null | undefined) => {
              if (newValue?.item === 0) {
                setSelectedAmount(null);
                return;
              }
              setSelectedAmount(newValue);
            }}
          />
        </ItemMenuStyled>
        <ItemMenuStyled isSearch>
          <WalletInput
            isSearch
            placeholder="Search..."
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
        </ItemMenuStyled>
        <WalletButton variant="text" onClick={handleReset} styles={styledBtn}>
          Reset
        </WalletButton>
      </WrapperStyled>
    )
  );
};
