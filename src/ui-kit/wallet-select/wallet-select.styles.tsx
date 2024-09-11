import { Box } from '@mui/system';
import { components, GroupBase, OptionProps, SingleValueProps } from 'react-select';
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

// eslint-disable-next-line
interface ExtendedSelectProps extends OptionProps<any, boolean, GroupBase<any>> {
  selectProps: OptionProps<any, boolean, GroupBase<any>>['selectProps'] & {
    activeItemId?: string;
  };
}

// eslint-disable-next-line
export const CustomOption = (props: any) => {
  const { icon, id } = props.data;
  const { activeItemId, className } = props.selectProps;

  const isMethodOptions = className && className.includes('method-options');

  const IconOption = icon;
  const isSelected = isMethodOptions ? activeItemId && activeItemId === id : props.isSelected;

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
        {isSelected && (
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
    color: themeMuiBase.palette.black,

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
    borderWidth: '0', // Remove border
    flexWrap: 'nowrap',
    boxShadow: 'none',
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: themeMuiBase.palette.white,

    '&:hover': {
      borderColor: 'rgba(0,0,0,0.4)', // Remove border on hover
    },
  }),

  // eslint-disable-next-line
  menu: (base: CSSObject) => ({
    ...base,
    borderRadius: themeMuiBase.spacing(5.75),
    backgroundColor: 'rgba(0,0,0,0.7)', // Add this line
  }),

  // eslint-disable-next-line
  menuList: (
    base: CSSObject,
    { selectProps: { className } }: { selectProps: { className?: string } }
  ) => {
    const isMethodOptions = className && className.includes('method-options');

    return {
      ...base,
      height: isMethodOptions ? '175px' : base.height,
      borderRadius: themeMuiBase.spacing(5.75),
      backgroundColor: 'rgba(0,0,0,0.7)', // Add this line
    };
  },

  // eslint-disable-next-line
  option: (base: any, { selectProps: { className } }: { selectProps: { className?: string } }) => {
    const isMethodOptions = className && className.includes('method-options');

    return {
      ...base,
      display: 'flex',
      height: isMethodOptions ? '32px' : '44px',
      padding: '0 20px',
      flexWrap: 'nowrap',
      backgroundColor: 'transparent', // Changed to transparent
      color: themeMuiBase.palette.white, // Changed to white
      fontSize: '14px',
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: themeMuiBase.palette.hover,
      },
      '&:active': {
        backgroundColor: themeMuiBase.palette.hover,
      },
    };
  },

  // eslint-disable-next-line
  valueContainer: (base: any) => ({
    ...base,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '28px',
    flexWrap: 'nowrap',
  }),
};
