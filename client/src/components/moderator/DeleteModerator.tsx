import { Dialog } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import React, { useRef, useState } from 'react';
import useDeleteModerator from 'src/hooks/moderator-query/useDeleteModerator';
import { Topic } from 'src/types/entities/topic';
import { Button } from 'src/ui/Button';

type DeleteModeratorProps = {
  topic: Topic;
  user: {
    username: string;
    user_id: number;
  };
};

function DeleteModerator({ topic, user }: DeleteModeratorProps) {
  const [open, setOpen] = useState(false);
  const { isLoading, mutateAsync } = useDeleteModerator(topic);
  const cancelRef = useRef(null);

  const handleClick = async () => {
    try {
      await mutateAsync({
        topic: topic.title,
        id: user.user_id,
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
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-4">
            <Dialog.Title as="h6">Remove moderator?</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to remove
              {' '}
              {user.username}
              {' '}
              as moderator? You
              can&apos;t undo this.
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
                Remove as moderator
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default DeleteModerator;
