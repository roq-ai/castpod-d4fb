import * as yup from 'yup';

export const podcastValidationSchema = yup.object().shape({
  title: yup.string().required(),
  genre: yup.string().required(),
  host: yup.string().required(),
  individual_id: yup.string().nullable(),
});
