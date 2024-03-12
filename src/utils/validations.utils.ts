import * as yup from 'yup';

export const CreateSafeAccountSchema = yup.object().shape({
  name: yup.string().trim().min(1).required('It is a requared'),
  chainId: yup.number().typeError('Must be a number').required('It is a required'),
});
