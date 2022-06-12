import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { Topic } from 'src/types/entities/topic';
import { Button } from 'src/ui/Button';
import { TextFieldForm } from 'src/ui/TextFieldForm';
import useUpdateTopic from '../../hooks/moderator-query/useUpdateTopic';

const schema = yup.object({
  headline: yup
    .string()
    .max(100, 'Topic headlines can be at most 100 characters'),
  description: yup
    .string()
    .max(500, 'Topic descriptions can be at most 500 characters')
    .required(''),
});

type Props = {
  topic: Topic;
};

interface FormValues {
  description: string;
  headline: string;
}

function UpdateTopic({ topic }: Props) {
  const { isLoading, mutate } = useUpdateTopic(topic);

  const handleSubmit = ({ description, headline }: FormValues) => {
    const newTopic = {
      description,
      headline,
    };
    mutate({ topic: topic.title, newTopic });
  };

  const initialValues: FormValues = {
    description: topic.description,
    headline: topic.headline,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {({ isValid }) => (
        <Form>
          <Field
            label="Topic Headline"
            name="headline"
            component={TextFieldForm}
          />
          <Field
            label="Topic Description"
            name="description"
            multiline
            component={TextFieldForm}
          />
          <Button
            type="submit"
            loading={isLoading}
            disabled={!isValid}
            className="mt-3 ml-auto"
            variant="filled"
          >
            Save changes
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default UpdateTopic;
