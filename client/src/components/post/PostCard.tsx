import React, { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Post } from 'src/types/entities/post';
import {
  ChatAltIcon, ExternalLinkIcon, PencilIcon, ReplyIcon,
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import useTopic from 'src/hooks/topic-query/useTopic';
import { useRouter } from 'next/router';
import ToolTip from 'src/ui/ToolTip';
import Embed from 'src/ui/Embed';
import DeletePostModerator from './DeletePostModerator';
import DeletePost from './DeletePost';
import UpdatePost from './UpdatePost';
import Voting from './Voting';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useUser } from '../../context/UserState';

type Props = {
  post: Post;
};

function PostCard({ post }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { data: topic } = useTopic(router.query.topic as string);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Card className="flex">
      <div className="pb-auto p-2">
        <Voting post={post} />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full pt-2 px-2">
          <small className="flex pb-1">
            <div className="text-gray-500 dark:text-gray-400">
              Posted by
              {' '}
              <Link href={`/user/${post.author_id}`} passHref>
                <a>
                  u/
                  {post.author}
                </a>
              </Link>
              {' '}
              <ToolTip className="inline" title={dayjs(post.created_at).format('llll')}>
                {dayjs(post.created_at).fromNow()}
              </ToolTip>
            </div>
          </small>
          <h5 className="font-medium">{post.title}</h5>
          {openEdit ? (
            <UpdatePost
              post={post}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
            />
          ) : (
            post.type === 'text' && (
              <div
                className="py-2 content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )
          )}
        </div>
        {post.type === 'link' && (
          <div className="ml-2">
            <a
              href={post.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
            >
              {`${post.content.slice(0, 30)}...`}
              <ExternalLinkIcon className="h-4 w-4 inline" />
            </a>
            <Embed url={post.content} />
          </div>
        )}
        {post.type === 'photo' && (
        <a
          href={`${process.env.NEXT_PUBLIC_IMAGE_LOADER_URL}${post.image_name}`}
          className="self-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_LOADER_URL}${post.image_name}?auto=format`}
            alt="post media"
            style={{ maxHeight: 700 }}
          />
        </a>
        )}
        <div className="flex flex-wrap gap-x-1 mt-1">
          <div className="p-2 text-gray-500 dark:text-gray-400 text-xs button rounded">
            <ChatAltIcon className="h-5 w-5 mr-1 inline" />
            {post.number_of_comments}
            {post.number_of_comments === 1 ? ' Comment' : ' Comments'}
          </div>
          <Button
            size="lg"
            variant="ghost"
            border="rounded"
            className="text-xs"
            icon={<ReplyIcon className="h-5 w-5 mr-1" />}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${post.topic}/comments/${post.id}`,
              );
              toast.success('Copied link!');
            }}
          >
            Share
          </Button>
          {user && user.id === post.author_id && (
          <>
            <DeletePost post={post} />
            {post.type === 'text' && (
            <Button
              onClick={() => setOpenEdit(!openEdit)}
              size="lg"
              variant="ghost"
              border="rounded"
              className="text-xs"
              icon={<PencilIcon className="h-5 w-5 mr-1" />}
            >
              Edit
            </Button>
            )}
          </>
          )}
          {user && topic && topic.user_moderator_id && topic.can_manage_posts_and_comments && (
          <DeletePostModerator post={post} />
          )}
        </div>
      </div>
    </Card>
  );
}

export default PostCard;
