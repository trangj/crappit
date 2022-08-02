import express from 'express';
import { auth, optionalAuth } from '../middleware/auth';
import {
  Moderator, Topic, User, Follow,
} from '../entities';
import { upload } from '../middleware/upload';
import AppDataSource from '../dataSource';

const router = express.Router();

// @route   GET /api/topic
// @desc    Get a topic
// @access  Public

router.get('/:topic', optionalAuth, async (req, res) => {
  try {
    const topic = await AppDataSource.query(`
      select
      t.*,
      f.user_id user_followed_id,
      m.user_id user_moderator_id,
      m.can_manage_everything can_manage_everything,
      m.can_manage_posts_and_comments can_manage_posts_and_comments,
      m.can_manage_settings can_manage_settings
      from topic t
      left join follow f on f.topic_id = t.id and f.user_id = $1
      left join moderator m on m.topic_id = t.id and m.user_id = $2
      where t.title = $3
    `, [req.user.id, req.user.id, req.params.topic]);
    if (!topic[0]) throw Error('Topic does not exist');

    const moderators = await AppDataSource.query(`
      select
      m.*,
      u.username
      from moderator m
      left join "user" u on u.id = m.user_id
      where m.topic_id = $1
    `, [topic[0].id]);

    topic[0].moderators = moderators;

    res.status(200).json({ topic: topic[0] });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/topic
// @desc    Create a topic
// @access  Private

router.post('/', auth, upload, async (req, res) => {
  try {
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: req.user.id } },
    );
    if (!user) throw Error('No user was found with that id');

    if (req.body.title.length > 21 || req.body.title < 3) throw Error('Topic title is too long or too short');
    if (req.body.description.length > 500) throw Error('Topic description is too long');

    let newTopic = AppDataSource.manager.create(
      Topic,
      {
        title: req.body.title,
        description: req.body.description,
        image_url: req.file ? req.file.location : '',
        image_name: req.file ? req.file.key : '',
        number_of_followers: 1,
      },
    );

    await AppDataSource.transaction(async (em) => {
      newTopic = await em.save(newTopic).catch(() => { throw Error('A topic already exists with that title'); });
      const follow = AppDataSource.manager.create(
        Follow,
        {
          topic_id: newTopic.id,
          user_id: user.id,
        },
      );
      await em.save(follow);
      const moderator = AppDataSource.manager.create(
        Moderator,
        {
          topic_id: newTopic.id,
          user_id: user.id,
        },
      );
      await em.save(moderator);
    });

    res.status(200).json({
      topic: { title: newTopic.title },
      status: { text: 'Topic successfully created', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/topic/:topic/follow_topic
// @desc    Follow a topic
// @access  Private

router.post('/:topic/follow_topic', auth, async (req, res) => {
  try {
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: req.user.id }, relations: { topics_followed: true } },
    );
    if (!user) throw Error('No user was found with that id');

    const topic = await AppDataSource.manager.findOne(
      Topic,
      { where: { title: req.params.topic } },
    );
    if (!topic) throw Error('No topic exists');

    const follow = await AppDataSource.manager.findOne(
      Follow,
      { where: { topic_id: topic.id, user_id: user.id } },
    );

    let message;
    let newFollow = AppDataSource.manager.create(
      Follow,
      {
        topic_id: topic.id,
        user_id: user.id,
      },
    );

    await AppDataSource.transaction(async (em) => {
      if (follow) {
        await em.remove(follow);
        topic.number_of_followers -= 1;
        message = 'Successfully unfollowed';
      } else {
        newFollow = await em.save(newFollow);
        topic.number_of_followers += 1;
        message = 'Successfully followed';
      }
      await em.save(topic);
    });

    res.status(200).json({
      follow: newFollow,
      user_followed_id: follow ? null : user.id,
      status: { text: message, severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

router.put('/:topic/favorite_topic', auth, async (req, res) => {
  try {
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: req.user.id } },
    );
    if (!user) throw Error('No user was found with that id');

    const topic = await AppDataSource.manager.findOne(
      Topic,
      { where: { title: req.params.topic } },
    );
    if (!topic) throw Error('No topic exists');

    const follow = await AppDataSource.manager.findOne(
      Follow,
      { where: { topic_id: topic.id, user_id: user.id } },
    );
    if (!follow) throw Error('No follow exists');

    follow.favorite = !follow.favorite;
    await follow.save();

    res.status(200).json(follow);
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

export const TopicRouter = router;
