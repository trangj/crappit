import AppDataSource from '../dataSource';
import {
  NotificationType, Notification, NotificationSetting, User,
} from '../entities';

type Context = {
  recipient: User,
  sender: User,
  type: string,
  body: string,
  url: string,
  title: string,
  comment_id?: number,
  post_id?: number,
  icon_name: string,
  icon_url: string,
}

export async function sendNotification({
  recipient, sender, type, body, url, title, comment_id, post_id, icon_name, icon_url,
}: Context) {
  try {
    // find notification type
    const notificationType = await AppDataSource.manager.findOne(
      NotificationType,
      { where: { type_name: type } },
    );
    if (!notificationType) throw Error('Notification type does not exist');

    // check if recipient allows notifications for
    const recipientNotificationSetting = await AppDataSource.manager.findOne(
      NotificationSetting,
      { where: { user_id: recipient.id, notification_type_id: notificationType.id } },
    );
    if (!recipientNotificationSetting.value) return;

    // create notification
    await AppDataSource.manager.create(
      Notification,
      {
        title,
        body,
        url,
        notification_type_id: notificationType.id,
        recipient_id: recipient.id,
        sender_id: sender.id,
        comment_id,
        post_id,
        icon_url,
        icon_name,
      },
    ).save();
  } catch (err) {
    throw Error(err.message);
  }
}
