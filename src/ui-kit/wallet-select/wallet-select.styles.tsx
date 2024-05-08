import { Box } from '@mui/system';
import { components, OptionProps, SingleValueProps } from 'react-select';
import { CSSObject } from '@emotion/react';

import IconCheck from '@/assets/svg/check.svg';
import { themeMuiBase } from '@/assets/styles/theme-mui';
import { WalletTypography } from '../wallet-typography';

const { Option, SingleValue } = components;

const stylesOption = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
};

const styledLabel = {
  fontSize: '14px',
  fontWeight: 400,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomOption = (props: OptionProps<any>) => {
  const IconOption = props.data.icon;
  return (
    <Option {...props}>
      <Box sx={stylesOption}>
        <Box display={'flex'} alignItems={'center'} gap={'8px'} overflow={'hidden'}>
          {IconOption && (
            <Box
              minWidth={'19px'}
              width={'19px'}
              height={'19px'}
              display={'flex'}
              alignItems={'center'}
            >
              <IconOption />
            </Box>
          )}
          <WalletTypography style={styledLabel}>{props.data.label}</WalletTypography>
        </Box>
        {props.isSelected && (
          <Box minWidth={'17px'} width={'17px'} height={'18px'}>
            <IconCheck />
          </Box>
        )}
      </Box>
    </Option>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomSingleValue = (props: SingleValueProps<any>) => {
  const IconOption = props.data.icon;
  return (
    <SingleValue {...props}>
      <Box display={'flex'} alignItems={'center'} gap={'8px'}>
        {IconOption && (
          <Box
            minWidth={'19px'}
            width={'19px'}
            height={'19px'}
            display={'flex'}
            alignItems={'center'}
          >
            <IconOption />
          </Box>
        )}
        <WalletTypography style={styledLabel}>{props.data.label}</WalletTypography>
      </Box>
    </SingleValue>
  );
};

export const stylesSelect = {
  container: (base: CSSObject) => ({
    ...base,
    fontSize: '14px',
    width: '100%',

    '&:focus-visible': {
      borderColor: themeMuiBase.palette.black,
    },
  }),

  placeholder: (base: CSSObject) => ({
    ...base,
    color: themeMuiBase.palette.black,
  }),

  dropdownIndicator: (
    base: CSSObject,
    { selectProps: { menuIsOpen } }: { selectProps: { menuIsOpen: boolean } }
  ) => ({
    ...base,
    transition: 'all 0.3s',
    color: themeMuiBase.palette.tetriaryGrey,
    transform: menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),

  // eslint-disable-next-line
  control: (base: any) => ({
    ...base,
    borderRadius: '1.75rem',
    height: '44px',
    padding: `0 ${themeMuiBase.spacing(2)} 0 0`,
    borderWidth: '1px',
    flexWrap: 'nowrap',
    borderColor: themeMuiBase.palette.tetriaryLightGrey,
    boxShadow: 'none',
    backgroundColor: themeMuiBase.palette.white,

    '&:hover': {
      borderColor: themeMuiBase.palette.tetriaryGrey,
    },
  }),

  menu: (base: CSSObject) => ({
    ...base,
    borderRadius: themeMuiBase.spacing(5.75),
  }),

  menuList: (base: CSSObject) => ({
    ...base,
    borderRadius: themeMuiBase.spacing(5.75),
  }),

  // eslint-disable-next-line
  option: (base: any) => ({
    ...base,
    display: 'flex',
    height: '44px',
    padding: '0 20px',
    flexWrap: 'nowrap',
    backgroundColor: 'transparent',
    color: themeMuiBase.palette.greyToo,
    fontSize: '14px',
    cursor: 'pointer',
  }),

  // eslint-disable-next-line
  valueContainer: (base: any) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '28px',
    flexWrap: 'nowrap',
  }),
};
