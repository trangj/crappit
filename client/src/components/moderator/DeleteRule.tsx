import { Dialog } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import React, { useRef, useState } from 'react';
import useDeleteRule from 'src/hooks/moderator-query/useDeleteRule';
import { Rule, Topic } from 'src/types/entities/topic';
import { Button } from 'src/ui/Button';

type DeleteRuleProps = {
  topic: Topic;
  rule: Rule;
};

function DeleteRule({ topic, rule }: DeleteRuleProps) {
  const [open, setOpen] = useState(false);
  const { isLoading, mutateAsync } = useDeleteRule(topic);
  const cancelRef = useRef(null);

  const handleClick = async () => {
    try {
      await mutateAsync({
        topic: topic.title,
        rule,
      });
      setOpen(false);
    } catch {
      //
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        border="rounded"
        size="sm"
        icon={<TrashIcon className="h-4 w-4" />}
      />
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={() => setOpen(false)}
        initialFocus={cancelRef}
        id="delete-rule"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-4">
            <Dialog.Title as="h6">Remove rule?</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this rule?
            </Dialog.Description>
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={() => setOpen(false)} ref={cancelRef}>
                Cancel
              </Button>
              <Button
                onClick={handleClick}
                loading={isLoading}
                variant="danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default DeleteRule;
