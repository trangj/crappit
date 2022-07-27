import React from 'react';

function NotificationSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
      <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
      <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export default NotificationSkeleton;
