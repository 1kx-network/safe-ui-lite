import { Box } from '@mui/system';
import { components, CSSObjectWithLabel, OptionProps, SingleValueProps } from 'react-select';

import IconCheck from '@/assets/svg/check.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';

const { Option, SingleValue } = components;

const stylesOption = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
};

// TODO type any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomOption = (props: OptionProps<any>) => {
  const IconOption = props.data.icon;
  return (
    <Option {...props}>
      <Box sx={stylesOption}>
        <Box display={'flex'} alignItems={'center'} gap={'8px'}>
          {IconOption && <IconOption minWidth={'19px'} width={'19px'} height={'19px'} />}
          {props.data.label}
        </Box>
        {props.isSelected && <IconCheck width={'17px'} minWidth={'17px'} height={'18px'} />}
      </Box>
    </Option>
  );
};

// TODO type any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomSingleValue = (props: SingleValueProps<any>) => {
  const IconOption = props.data.icon;
  return (
    <SingleValue {...props}>
      <Box display={'flex'} alignItems={'center'} gap={'8px'}>
        {IconOption && <IconOption minWidth={'19px'} width={'19px'} height={'19px'} />}
        {props.data.label}
      </Box>
    </SingleValue>
  );
};

export const stylesSelect = {
  container: (base: CSSObjectWithLabel) => ({
    ...base,
    fontSize: '17px',
    width: '100%',

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
    color: themeMuiBase.palette.tetriaryGrey,
    transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),

  control: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: '1.75rem',
    height: '2.75rem',
    padding: `0 ${themeMuiBase.spacing(2)}`,
    borderWidth: '1px',
    flexWrap: 'nowrap',
    borderColor: themeMuiBase.palette.tetriaryLightGrey,
    boxShadow: 'none',
    backgroundColor: themeMuiBase.palette.white,

    '&:hover': {
      borderColor: themeMuiBase.palette.tetriaryGrey,
    },
  }),

  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: themeMuiBase.spacing(5.75),
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    borderRadius: themeMuiBase.spacing(5.75),
  }),

  option: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'flex',
    height: '44px',
    padding: '0 20px',
    flexWrap: 'nowrap',
    backgroundColor: 'transparent',
    color: themeMuiBase.palette.tetriaryDark,
    cursor: 'pointer',
  }),

  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '28px',
    flexWrap: 'nowrap',
  }),
};
