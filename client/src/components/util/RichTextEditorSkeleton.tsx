import React from 'react';

function RichTextEditorSkeleton() {
  return (
    <div className="w-full my-2 bg-transparent border rounded dark:border-gray-700 border-gray-300 flex flex-col">
      <div className="animate-pulse h-10 dark:bg-gray-800 bg-gray-50" />
      <div style={{ height: 130, padding: '0.3rem 1rem' }}>
        <div className="animate-pulse h-6 w-40 dark:bg-gray-800 bg-gray-50" />
      </div>
    </div>
  );
}

export default RichTextEditorSkeleton;
