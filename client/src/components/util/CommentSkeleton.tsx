import React from 'react';

function CommentSkeleton() {
  return (
    <div className="animate-pulse flex gap-2 mt-3">
      <div className="rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-700" />
      <div className="flex flex-col w-full gap-2 mt-1">
        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default CommentSkeleton;
