import { ReactElement } from 'react';

import { WalletInput } from '@/ui-kit';

const AddressContractField = ({
  // id,
  // name,
  value,
  onChange,
  label,
  error,
  // getAddressFromDomain,
  // networkPrefix,
  // onBlur,
}: any): ReactElement => {
  return (
    <WalletInput
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      errorValue={error}
    />
  );
};

export default AddressContractField;
