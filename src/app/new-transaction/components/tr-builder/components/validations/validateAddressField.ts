import { ValidateResult } from 'react-hook-form';

import { isValidAddress } from '../../utils/utils';

const validateAddressField = (value: string): ValidateResult => {
  if (!isValidAddress(value)) {
    return 'Invalid address';
  }
};

export default validateAddressField;
