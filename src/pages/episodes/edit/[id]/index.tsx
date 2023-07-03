import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEpisodeById, updateEpisodeById } from 'apiSdk/episodes';
import { Error } from 'components/error';
import { episodeValidationSchema } from 'validationSchema/episodes';
import { EpisodeInterface } from 'interfaces/episode';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PodcastInterface } from 'interfaces/podcast';
import { IndividualInterface } from 'interfaces/individual';
import { getPodcasts } from 'apiSdk/podcasts';
import { getIndividuals } from 'apiSdk/individuals';

function EpisodeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EpisodeInterface>(
    () => (id ? `/episodes/${id}` : null),
    () => getEpisodeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEpisodeById(id, values);
      mutate(updated);
      resetForm();
      router.push('/episodes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EpisodeInterface>({
    initialValues: data,
    validationSchema: episodeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Episode
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PodcastInterface>
              formik={formik}
              name={'podcast_id'}
              label={'Select Podcast'}
              placeholder={'Select Podcast'}
              fetcher={getPodcasts}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <AsyncSelect<IndividualInterface>
              formik={formik}
              name={'individual_id'}
              label={'Select Individual'}
              placeholder={'Select Individual'}
              fetcher={getIndividuals}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'episode',
    operation: AccessOperationEnum.UPDATE,
  }),
)(EpisodeEditPage);
