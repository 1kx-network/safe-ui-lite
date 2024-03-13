import React from 'react';
import Select, { Props, GroupBase } from 'react-select';

import { CustomOption, CustomSingleValue, stylesSelect } from './wallet-select.styles';

interface ICustomProps {
  icon?: JSX.Element;
  value?: string;
  label?: string;
  id?: string;
}

type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, IsMulti, Group> & ICustomProps;

export const WalletSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectProps<Option, IsMulti, Group>
) => {
  //   const id = props.id || Math.random().toString();

  const components = {
    Option: CustomOption,
    SingleValue: CustomSingleValue,
    IndicatorSeparator: () => null,
  };

  return (
    <Select
      isClearable={false}
      isSearchable={false}
      {...props}
      components={components}
      styles={stylesSelect}
    />
  );
};
