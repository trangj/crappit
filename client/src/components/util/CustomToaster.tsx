import React from 'react';
import { Toaster, ToastBar } from 'react-hot-toast';

function CustomToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        className:
        'bg-white border-gray-500 dark:bg-gray-850 dark:border-gray-500 dark:text-gray-200 w-full border justify-start',
        duration: 5000,
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={{ maxWidth: '476px', padding: '0.7rem' }}>
          {({ icon, message }) => (
            <>
              {icon}
              <div>{message}</div>
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export default CustomToaster;
