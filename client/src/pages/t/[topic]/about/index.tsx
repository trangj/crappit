import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Head from 'next/head';
import { useUser } from 'src/context/UserState';
import useTopic, { fetchTopic } from 'src/hooks/topic-query/useTopic';
import ModeratorLayout from 'src/components/moderator/ModeratorLayout';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';
import type { NextPageWithLayout } from 'src/pages/_app';
import { Formik, Form, Field } from 'formik';
import useUpdateTopic from 'src/hooks/moderator-query/useUpdateTopic';
import { Button } from 'src/ui/Button';
import { TextFieldForm } from 'src/ui/TextFieldForm';
import * as yup from 'yup';

const schema = yup.object({
  headline: yup
    .string()
    .max(100, 'Topic headlines can be at most 100 characters'),
  description: yup
    .string()
    .max(500, 'Topic descriptions can be at most 500 characters')
    .required(''),
});

interface FormValues {
  description: string;
  headline: string;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const TopicSettings : NextPageWithLayout = function () {
  const router = useRouter();
  const { topic } = router.query;
  const { user } = useUser();
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );
  const { isLoading, mutate } = useUpdateTopic(topic as string);

  if (topicLoading || !topicData) return <div>Loading...</div>;

  if (topicData.user_moderator_id !== user?.id) {
    return (
      <>
        <Head>
          <title>{topicData.title}</title>
        </Head>
        <div className="fixed inset-y-1/2 w-full text-center">
          You must be a moderator of t/
          {topicData.title}
          {' '}
          to view this page
        </div>
      </>
    );
  }

  const handleSubmit = ({ description, headline }: FormValues) => {
    const newTopic = {
      description,
      headline,
    };
    mutate({ topic: topicData.title, newTopic });
  };

  const initialValues: FormValues = {
    description: topicData.description,
    headline: topicData.headline,
  };

  return (
    <>
      <Head>
        <title>{topicData.title}</title>
      </Head>
      <Card className="p-3 flex flex-col gap-3 ml-64">
        <h5>Topic Settings</h5>
        <Divider className="my-1" />
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
      </Card>
    </>
  );
};

TopicSettings.getLayout = function getLayout(page) {
  return (
    <ModeratorLayout>
      {page}
    </ModeratorLayout>
  );
};

export default TopicSettings;
