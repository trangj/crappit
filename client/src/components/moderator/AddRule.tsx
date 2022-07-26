import { Dialog } from '@headlessui/react';
import { Formik, Form, Field } from 'formik';
import React, { useRef, useState } from 'react';
import useAddRule from 'src/hooks/moderator-query/useAddRule';
import { Topic } from 'src/types/entities/topic';
import { Button } from 'src/ui/Button';
import { TextFieldForm } from 'src/ui/TextFieldForm';
import * as yup from 'yup';

const schema = yup.object({
  name: yup
    .string()
    .max(100, 'Rule names can be at most 100 characters')
    .required(''),
  description: yup
    .string()
    .max(500, 'Rule descriptions can be at most 500 characters')
    .required(''),
});

type AddRuleProps = {
  topic: Topic;
};

interface FormValues {
  name: string;
  description: string;
}

function AddRule({ topic }: AddRuleProps) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef(null);
  const { mutateAsync, isLoading } = useAddRule(topic);

  const handleSubmit = async ({ name, description }: FormValues) => {
    try {
      await mutateAsync({
        topic: topic.title,
        rule: { name, description, created_at: new Date().toISOString() },
      });
      setOpen(false);
    } catch {
      //
    }
  };

  const initialValues: FormValues = {
    name: '',
    description: '',
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        disabled={topic.rules.length === 15}
        className="ml-auto"
        variant="filled"
      >
        Add Rule
      </Button>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={() => setOpen(false)}
        initialFocus={cancelRef}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-3 gap-3 flex flex-col w-96">
            <Dialog.Title as="h6">Add rule</Dialog.Title>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ isValid }) => (
                <Form>
                  <Field
                    label="Rule"
                    name="name"
                    placeholder='Rule displayed (e.g. "No photos")'
                    component={TextFieldForm}
                  />
                  <Field
                    label="Description"
                    name="description"
                    placeholder="Enter the full description of the rule."
                    multiline
                    component={TextFieldForm}
                  />
                  <div className="flex mt-3 justify-end gap-2">
                    <Button onClick={() => setOpen(false)} ref={cancelRef}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      disabled={!isValid}
                      variant="filled"
                    >
                      Add new rule
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default AddRule;
