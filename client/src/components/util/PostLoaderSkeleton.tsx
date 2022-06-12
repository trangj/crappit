import React from 'react';
import { Card } from 'src/ui/Card';

function PostLoaderSkeleton() {
  return (
    <Card className="p-3 pb-0 rounded-b-none border-b-0 mb-0">
      <div className="animate-pulse flex flex-col w-full gap-2 pl-8">
        <div className="h-3 w-1/5 mb-2 bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/5 bg-gray-200 dark:bg-gray-700" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700" />
      </div>
    </Card>
  );
}

export default PostLoaderSkeleton;
