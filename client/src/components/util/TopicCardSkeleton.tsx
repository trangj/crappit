import React from 'react';
import { Card } from 'src/ui/Card';

function TopicCardSkeleton() {
  return (
    <Card>
      <div className="animate-pulse flex flex-col">
        <div className="flex gap-2 m-2 items-center">
          <div className="h-14 w-14 flex-none rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="m-2">
          <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex m-2">
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="m-2">
          <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </Card>
  );
}

export default TopicCardSkeleton;
