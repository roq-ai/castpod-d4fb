import * as yup from 'yup';

export const playlistValidationSchema = yup.object().shape({
  name: yup.string().required(),
  individual_id: yup.string().nullable(),
});
