import express from 'express';
import { Notification, NotificationSetting } from '../entities';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      where: { recipient_id: req.user.id },
      take: 5,
      skip: parseInt(req.query.skip as string) || undefined,
      order: { sent_at: 'DESC' },
    });
    res.status(200).json({
      notifications,
      nextCursor: notifications.length
        ? parseInt(req.query.skip as string) + notifications.length
        : undefined,
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

router.get('/settings', auth, async (req, res) => {
  try {
    const notificationSettings = await NotificationSetting.find({
      where: { user_id: req.user.id },
      join: {
        alias: 'notification_setting',
        leftJoinAndSelect: {
          notification_type: 'notification_setting.notification_type',
        },
      },
    });
    res.status(200).json(notificationSettings);
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

router.put('/settings', auth, async (req, res) => {
  try {
    const notificationSetting = await NotificationSetting.findOne({
      user_id: req.user.id,
      notification_type_id: req.body.notification_type_id,
    });
    notificationSetting.value = !notificationSetting.value;
    notificationSetting.save();
    res.status(200).json(notificationSetting);
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

router.post('/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne(req.body.id);
    if (!notification) throw Error('Notification not found');
    notification.read_at = new Date();
    await notification.save();
    res.status(200).json(notification);
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

router.post('/read_all', auth, async (req, res) => {
  try {
    await Notification.query(`
      update notification n
      set read_at=$1
      where n.read_at is null
    `, [new Date()]);
    res.status(200).json({});
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

export const NotificationRouter = router;
