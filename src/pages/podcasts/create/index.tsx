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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPodcast } from 'apiSdk/podcasts';
import { Error } from 'components/error';
import { podcastValidationSchema } from 'validationSchema/podcasts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { IndividualInterface } from 'interfaces/individual';
import { getIndividuals } from 'apiSdk/individuals';
import { PodcastInterface } from 'interfaces/podcast';

function PodcastCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PodcastInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPodcast(values);
      resetForm();
      router.push('/podcasts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PodcastInterface>({
    initialValues: {
      title: '',
      genre: '',
      host: '',
      individual_id: (router.query.individual_id as string) ?? null,
    },
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
            Create Podcast
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(PodcastCreatePage);
