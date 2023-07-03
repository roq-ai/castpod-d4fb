import * as yup from 'yup';

export const episodeValidationSchema = yup.object().shape({
  title: yup.string().required(),
  podcast_id: yup.string().nullable(),
  individual_id: yup.string().nullable(),
});
