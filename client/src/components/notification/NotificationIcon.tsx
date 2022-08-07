import React from 'react';
import { ChatAltIcon } from '@heroicons/react/solid';

type NotificationIconProps = {
  type: string
}

function NotificationIcon({ type }: NotificationIconProps) {
  if (type === 'POST_REPLY' || type === 'COMMENT_REPLY') {
    return (
      <ChatAltIcon />
    );
  }
  return null;
}

export default NotificationIcon;
