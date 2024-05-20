import { Box } from '@mui/system';

import { WalletSelect, WalletTypography } from '@/ui-kit';
import { SelectItem } from '../../typings/models';
import { themeMuiBase } from '@/assets/styles/theme-mui';

type SelectContractFieldTypes = {
  options: SelectItem[];
  onChange: (id: string) => void;
  value: string;
  label: string;
  name: string;
  id: string;
};

const SelectContractField = ({
  value,
  onChange,
  options,
  label,
  name,
  id,
}: SelectContractFieldTypes) => (
  <Box mt={themeMuiBase.spacing(2)}>
    <Box mb={2} pl={2}>
      <WalletTypography fontSize={12} fontWeight={400} color={themeMuiBase.palette.tetriaryGrey}>
        {label}
      </WalletTypography>
    </Box>
    <WalletSelect
      inputId={`${id}-input`}
      className="method-options"
      name={name}
      isDisabled={options.length === 1}
      options={options}
      onChange={elem => elem && onChange(elem.id)}
      activeItemId={value}
    />
  </Box>
);

export default SelectContractField;
