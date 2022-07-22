import { ChatAltIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React from 'react';
import { Comment } from 'src/types/entities/comment';
import { Button } from 'src/ui/Button';
import useTopic from 'src/hooks/topic-query/useTopic';
import { useRouter } from 'next/router';
import { useUser } from '../../context/UserState';
import DeleteCommentModerator from './DeleteCommentModerator';
import DeleteComment from './DeleteComment';

type Props = {
    setOpenReply: (arg: boolean) => void,
    setOpenEdit: (arg: boolean) => void,
    openEdit: boolean,
    openReply: boolean,
    comment: Comment,
};

function CommentToolBar({
  setOpenReply, setOpenEdit, openEdit, openReply, comment,
}: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { data: topic } = useTopic(router.query.topic as string);

  if (!user) {
    return (
      <Link passHref href="/login">
        <Button
          variant="ghost"
          border="rounded"
          className="text-xs"
          icon={<ChatAltIcon className="h-5 w-5 mr-1" />}
          as="a"
        >
          Reply
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpenReply(!openReply)}
        variant="ghost"
        border="rounded"
        className="text-xs"
        icon={<ChatAltIcon className="h-5 w-5 mr-1" />}
      >
        Reply
      </Button>
      {user.id === comment.author_id && (
        <>
          <DeleteComment comment={comment} />
          <Button
            onClick={() => setOpenEdit(!openEdit)}
            variant="ghost"
            border="rounded"
            className="text-xs"
          >
            Edit
          </Button>
        </>
      )}
      {topic
                && user.id !== comment.author_id
                && topic.user_moderator_id && topic.can_manage_posts_and_comments && (
                <DeleteCommentModerator comment={comment} topic={topic} />
      )}
    </>
  );
}

export default CommentToolBar;
