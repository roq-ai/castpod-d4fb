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
import { getPodcastById, updatePodcastById } from 'apiSdk/podcasts';
import { Error } from 'components/error';
import { podcastValidationSchema } from 'validationSchema/podcasts';
import { PodcastInterface } from 'interfaces/podcast';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { IndividualInterface } from 'interfaces/individual';
import { getIndividuals } from 'apiSdk/individuals';

function PodcastEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PodcastInterface>(
    () => (id ? `/podcasts/${id}` : null),
    () => getPodcastById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PodcastInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePodcastById(id, values);
      mutate(updated);
      resetForm();
      router.push('/podcasts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PodcastInterface>({
    initialValues: data,
    validationSchema: podcastValidationSchema,
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
            Edit Podcast
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
            <FormControl id="genre" mb="4" isInvalid={!!formik.errors?.genre}>
              <FormLabel>Genre</FormLabel>
              <Input type="text" name="genre" value={formik.values?.genre} onChange={formik.handleChange} />
              {formik.errors.genre && <FormErrorMessage>{formik.errors?.genre}</FormErrorMessage>}
            </FormControl>
            <FormControl id="host" mb="4" isInvalid={!!formik.errors?.host}>
              <FormLabel>Host</FormLabel>
              <Input type="text" name="host" value={formik.values?.host} onChange={formik.handleChange} />
              {formik.errors.host && <FormErrorMessage>{formik.errors?.host}</FormErrorMessage>}
            </FormControl>
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
    entity: 'podcast',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PodcastEditPage);
