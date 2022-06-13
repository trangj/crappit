import React, { Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Tab } from '@headlessui/react';
import { RichTextEditor } from 'src/ui/RichTextEditor';
import {
  DocumentTextIcon,
  LinkIcon,
  PhotographIcon,
} from '@heroicons/react/solid';
import { TextFieldForm } from '../ui/TextFieldForm';
import { FileFieldForm } from '../ui/FileFieldForm';
import { SelectFieldForm } from '../ui/SelectFieldForm';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Container } from '../ui/Container';
import { Divider } from '../ui/Divider';
import useTopics from '../hooks/topic-query/useTopics';
import useAddPost from '../hooks/post-query/useAddPost';
import { useUser } from '../context/UserState';

const types = ['text', 'link', 'photo'];
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const FILE_SIZE = 10485760;
const schema = yup.object({
  title: yup
    .string()
    .max(300, 'Post title can be at most 300 characters')
    .required('Enter a title for your post'),
  topic: yup.string().required('Select a topic to post to'),
  content: yup.string(),
  link: yup.string().url('Enter a valid URL'),
  file: yup
    .mixed()
    .test('fileSize', 'File Size is too large', (value) => (value === undefined ? true : value.size <= FILE_SIZE))
    .test('fileType', 'Unsupported File Format', (value) => (value === undefined ? true : SUPPORTED_FORMATS.includes(value.type))),
});

interface FormValues {
  title: string;
  content: string;
  link: string;
  file: File | '';
  topic: string;
  type: 0 | 1 | 2;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

function AddPost() {
  const {
    isLoading: topicsIsLoading,
    data: topicsData,
    error: topicsError,
  } = useTopics();
  const { isLoading, mutate } = useAddPost();
  const { user } = useUser();
  const router = useRouter();

  const queryType = router.query.type;
  let type = 0;
  if (queryType === 'link') {
    type = 1;
  } else if (queryType === 'photo') {
    type = 2;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSubmit = ({
    title,
    content,
    link,
    file,
    type,
    topic,
  }: FormValues) => {
    const formData = new FormData();
    if (types[type] === 'photo') formData.append('file', file);
    formData.append('title', title);
    formData.append('content', content || link);
    formData.append('type', types[type]);
    formData.append('topic', topic);
    mutate({ formData });
  };

  const displayPlaceholder = () => {
    if (topicsIsLoading) return 'Loading...';
    if (topicsError) return topicsError.status.text;
    return 'Choose a topic';
  };

  const initialValues: FormValues = {
    title: '',
    content: '',
    file: '',
    link: '',
    topic: '',
    type: type as FormValues['type'],
  };
  return (
    <Container>
      <Head>
        <title>Submit to Crappit</title>
      </Head>
      <h6>Create a post</h6>
      <Divider className="my-3" />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({
          setFieldValue, values, isSubmitting, isValid,
        }) => (
          <Form className="flex flex-col">
            <Field
              name="topic"
              className="sm:w-80 w-full"
              component={SelectFieldForm}
              placeholder={displayPlaceholder()}
            >
              {!topicsIsLoading
                && topicsData
                && topicsData.map((topic) => (
                  <option
                    key={topic.title}
                    value={topic.title}
                    className="select-option"
                  >
                    t/
                    {topic.title}
                  </option>
                ))}
            </Field>
            <Card className="mt-3">
              <Tab.Group
                defaultIndex={values.type}
                onChange={(i) => setFieldValue('type', i)}
              >
                <Tab.List as="div" className="flex">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <Button
                        variant="ghost"
                        border="none"
                        icon={<DocumentTextIcon className="w-6 h-6" />}
                        className="py-4 px-10 flex flex-1 items-center border-gray-300 dark:border-gray-700 border-r border-b"
                        active={selected}
                      >
                        Text
                      </Button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <Button
                        variant="ghost"
                        border="none"
                        icon={<LinkIcon className="w-6 h-6" />}
                        className="py-4 px-10 flex flex-1 items-center border-gray-300 dark:border-gray-700 border-r border-b"
                        active={selected}
                      >
                        Link
                      </Button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <Button
                        variant="ghost"
                        border="none"
                        icon={<PhotographIcon className="w-6 h-6" />}
                        className="py-4 px-10 flex flex-1 items-center border-gray-300 dark:border-gray-700 border-r border-b"
                        active={selected}
                      >
                        Photo/GIF
                      </Button>
                    )}
                  </Tab>
                </Tab.List>
                <Tab.Panels as="div" className="p-3">
                  <Field
                    name="title"
                    placeholder="Title"
                    component={TextFieldForm}
                  />
                  <Tab.Panel>
                    <RichTextEditor
                      value={values.content}
                      placeholder="Text (optional)"
                      name="content"
                      setFieldValue={setFieldValue}
                      isSubmitting={isSubmitting}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Field
                      placeholder="Link"
                      name="link"
                      component={TextFieldForm}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <Field
                      name="file"
                      component={FileFieldForm}
                      setFieldValue={setFieldValue}
                    />
                  </Tab.Panel>
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={!values.title || !values.topic || !isValid}
                    className="mt-2 w-20 ml-auto"
                    variant="filled"
                  >
                    Post
                  </Button>
                </Tab.Panels>
              </Tab.Group>
            </Card>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
export default AddPost;
