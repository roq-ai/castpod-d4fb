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
import { createSnippet } from 'apiSdk/snippets';
import { Error } from 'components/error';
import { snippetValidationSchema } from 'validationSchema/snippets';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { EpisodeInterface } from 'interfaces/episode';
import { IndividualInterface } from 'interfaces/individual';
import { getEpisodes } from 'apiSdk/episodes';
import { getIndividuals } from 'apiSdk/individuals';
import { SnippetInterface } from 'interfaces/snippet';

function SnippetCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SnippetInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSnippet(values);
      resetForm();
      router.push('/snippets');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SnippetInterface>({
    initialValues: {
      content: '',
      episode_id: (router.query.episode_id as string) ?? null,
      individual_id: (router.query.individual_id as string) ?? null,
    },
    validationSchema: snippetValidationSchema,
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
            Create Snippet
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<EpisodeInterface>
            formik={formik}
            name={'episode_id'}
            label={'Select Episode'}
            placeholder={'Select Episode'}
            fetcher={getEpisodes}
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
    entity: 'snippet',
    operation: AccessOperationEnum.CREATE,
  }),
)(SnippetCreatePage);
