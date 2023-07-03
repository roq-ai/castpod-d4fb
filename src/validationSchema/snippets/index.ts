import * as yup from 'yup';

export const snippetValidationSchema = yup.object().shape({
  content: yup.string().required(),
  episode_id: yup.string().nullable(),
  individual_id: yup.string().nullable(),
});
