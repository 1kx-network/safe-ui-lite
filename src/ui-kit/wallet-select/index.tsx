import React from 'react';
import Select, { Props, GroupBase } from 'react-select';

import { CustomOption, CustomSingleValue, stylesSelect } from './wallet-select.styles';

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, IsMulti, Group>;

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
      components={components}
      {...props}
      styles={stylesSelect}
    />
  );
};
