import React from 'react';
import Select, { Props, GroupBase } from 'react-select';

import { CustomOption, CustomSingleValue, stylesSelect } from './wallet-select.styles';
import { LoadingSelect } from './select-loading';

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, IsMulti, Group>;

export const WalletSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option & { activeItemId?: string }>,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: SelectProps<Option, IsMulti, Group> & { ref?: any; activeItemId?: string }
) => {
  //   const id = props.id || Math.random().toString();

  const components = {
    Option: CustomOption,
    SingleValue: CustomSingleValue,
    IndicatorSeparator: () => null,
  };

  return props.isLoading ? (
    <LoadingSelect />
  ) : (
    <Select
      isClearable={false}
      isSearchable={false}
      components={components}
      menuPlacement="auto"
      {...props}
      ref={props.ref}
      styles={stylesSelect}
    />
  );
};
