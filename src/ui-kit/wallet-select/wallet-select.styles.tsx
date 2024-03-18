import { Box } from '@mui/system';
import { components, CSSObjectWithLabel, OptionProps, SingleValueProps } from 'react-select';

import { themeMuiBase } from '@/assets/styles/theme-mui';

const { Option, SingleValue } = components;

// TODO type any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomOption = (props: OptionProps<any>) => (
  <Option {...props}>
    <Box display={'flex'} alignItems={'center'} gap={'8px'}>
      {props.data.icon}
      {props.data.label}
    </Box>
  </Option>
);

// TODO type any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomSingleValue = (props: SingleValueProps<any>) => (
  <SingleValue {...props}>
    <Box display={'flex'} alignItems={'center'} gap={'8px'}>
      {props.data.icon}
      {props.data.label}
    </Box>
  </SingleValue>
);

export const stylesSelect = {
  container: (base: CSSObjectWithLabel) => ({
    ...base,
    fontSize: '17px',

    '&:focus-visible': {
      borderColor: themeMuiBase.palette.black,
    },
  }),

  dropdownIndicator: (
    base: CSSObjectWithLabel,
    { selectProps: { menuIsOpen } }: { selectProps: { menuIsOpen: boolean } }
  ) => ({
    ...base,
    transition: 'all 0.3s',
    color: themeMuiBase.palette.black,
    transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),

  control: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: '28px',
    height: '52px',
    padding: '0 20px',
    borderWidth: '1px',
    flexWrap: 'nowrap',
    borderColor: themeMuiBase.palette.black,
    boxShadow: 'none',
    backgroundColor: themeMuiBase.palette.lightGrey,

    '&:hover': {
      borderColor: themeMuiBase.palette.black,
    },
  }),

  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: '8px',
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: '8px',
  }),

  option: (base: CSSObjectWithLabel, { isSelected }: { isSelected: boolean }) => ({
    ...base,
    display: 'flex',
    height: '52px',
    padding: '0 20px',
    flexWrap: 'nowrap',
    backgroundColor: isSelected ? themeMuiBase.palette.tetriaryDark : 'transparent',

    '&:hover': {
      backgroundColor: isSelected
        ? themeMuiBase.palette.tetriaryDark
        : themeMuiBase.palette.lightGrey,
    },

    '&:active': {
      backgroundColor: isSelected ? themeMuiBase.palette.tetriaryDark : 'transparent',
    },
  }),

  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '28px',
    flexWrap: 'nowrap',
  }),
};
