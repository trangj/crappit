import express from 'express';
import AppDataSource from '../dataSource';
import { canManageEverything, canManagePostsAndComments, canManageSettings } from '../middleware/checkModPermission';
import { canModTopic } from '../middleware/checkModerator';
import { deleteFile, upload } from '../middleware/upload';
import { auth } from '../middleware/auth';
import {
  User, Post, Comment, Moderator,
} from '../entities';

const router = express.Router();

// @route   POST /api/moderation/:topic/user
// @desc    Add a moderator to a topic
// @access  Private

router.post('/:topic/user', auth, canModTopic, canManageEverything, async (req, res) => {
  try {
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { username: req.body.username } },
    );
    if (!user) throw Error('User does not exist');

    const moderator = await AppDataSource.manager.findOne(
      Moderator,
      { where: { topic_id: req.topic.id, user_id: user.id } },
    );
    if (moderator) throw Error('User is already a moderator');

    const newModerator = AppDataSource.manager.create(
      Moderator,
      {
        topic_id: req.topic.id,
        user_id: user.id,
        can_manage_everything: req.body.can_manage_everything,
        can_manage_posts_and_comments: req.body.can_manage_everything
          ? true : req.body.can_manage_posts_and_comments,
        can_manage_settings: req.body.can_manage_everything ? true : req.body.can_manage_settings,
      },
    );

    await newModerator.save();

    res.status(200).json({
      user: {
        user_id: user.id,
        username: user.username,
        topic_id: newModerator.topic_id,
        can_manage_everything: newModerator.can_manage_everything,
        can_manage_posts_and_comments: newModerator.can_manage_posts_and_comments,
        can_manage_settings: newModerator.can_manage_settings,
      },
      status: { text: 'Moderator successfully added', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/moderation/:topic/user/:userid
// @desc    Delete a moderator of a topic
// @access  Private

router.delete('/:topic/user/:userid', auth, canModTopic, canManageEverything, async (req, res) => {
  try {
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: parseInt(req.params.userid) } },
    );
    if (!user) throw Error('User does not exist');

    await AppDataSource.manager.delete(
      Moderator,
      { user_id: user.id, topic_id: req.topic.id },
    );

    res.status(200).json({
      user: { user_id: user.id, username: user.username, topic_id: req.topic.id },
      status: { text: 'Moderator successfully removed', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   DELETE /api/moderation/:topic/post/:post
// @desc    Delete a post
// @access  Private

router.delete('/:topic/post/:post', auth, canModTopic, canManagePostsAndComments, async (req, res) => {
  try {
    const post = await AppDataSource.manager.findOne(
      Post,
      { where: { id: parseInt(req.params.post), topic_id: req.topic.id } },
    );
    if (!post) throw Error('Post does not exist');

    await post.remove();
    if (post.type === 'photo') deleteFile(post.image_name);

    res.status(200).json({
      status: { text: 'Post successfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   DELETE /api/moderation/:topic/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete('/:topic/comment/:commentid', auth, canModTopic, canManagePostsAndComments, async (req, res) => {
  try {
    const comment = await AppDataSource.manager.findOne(
      Comment,
      { where: { id: parseInt(req.params.commentid) } },
    );
    if (!comment) throw Error('Comment does not exist');
    const post = await AppDataSource.manager.findOne(
      Post,
      { where: { id: comment.post_id } },
    );
    if (post.topic_id !== req.topic.id) throw Error('Comment does not belong to topic');

    comment.content = null;
    comment.author = null;
    comment.is_deleted = true;

    await comment.save();

    res.status(200).json({
      comment,
      status: { text: 'Comment succesfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/moderation/:topic/add_rule
// @desc    Add rule
// @access  Private

router.post('/:topic/add_rule', auth, canModTopic, canManageSettings, async (req, res) => {
  try {
    if (req.topic.rules.length === 15) throw Error('You can have at most 15 rules');
    if (req.body.rule.name.length > 100) throw Error('Rule name is too long');
    if (req.body.rule.description.length > 500) throw Error('Rule description is too long');

    req.topic.rules.push(req.body.rule);

    await req.topic.save();

    res.status(200).json({
      rule: req.body.rule,
      status: { text: 'Successfully added rule', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/delete_rule
// @desc    Delete rule
// @access  Private

router.post('/:topic/delete_rule', auth, canModTopic, canManageSettings, async (req, res) => {
  try {
    req.topic.rules = req.topic.rules.filter(
      (rule: any) => rule.created_at !== req.body.rule.created_at,
    );

    await req.topic.save();

    res.status(200).json({
      rule: req.body.rule,
      status: { text: 'Successfully deleted rule', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/icon
// @desc    Change topic icon
// @access  Private

router.post('/:topic/icon', auth, canModTopic, canManageSettings, upload, async (req, res) => {
  try {
    if (req.topic.icon_image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(req.topic.icon_image_name);
      req.topic.icon_image_url = req.file.location;
      req.topic.icon_image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      req.topic.icon_image_url = req.file.location;
      req.topic.icon_image_name = req.file.key;
    }

    await req.topic.save();

    res.status(200).json({
      topic: {
        icon_image_url: req.topic.icon_image_url,
        icon_image_name: req.topic.icon_image_name,
      },
      status: { text: 'Successfully updated icon', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/banner
// @desc    Change topic banner
// @access  Private

router.post('/:topic/banner', auth, canModTopic, canManageSettings, upload, async (req, res) => {
  try {
    if (req.topic.image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(req.topic.image_name);
      req.topic.image_url = req.file.location;
      req.topic.image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      req.topic.image_url = req.file.location;
      req.topic.image_name = req.file.key;
    }

    await req.topic.save();

    res.status(200).json({
      topic: { image_url: req.topic.image_url, image_name: req.topic.image_name },
      status: { text: 'Successfully updated banner', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/moderation/:topic
// @desc    Update a topic
// @access  Private

router.put('/:topic', auth, canModTopic, canManageSettings, async (req, res) => {
  try {
    if (req.body.description.length > 500) throw Error('Topic description is too long');
    if (req.body.headline.length > 100) throw Error('Topic headline is too long');

    req.topic.description = req.body.description;
    req.topic.headline = req.body.headline;

    await req.topic.save();

    res.status(200).json({
      topic: { description: req.topic.description, headline: req.topic.headline },
      status: { text: 'Successfully updated topic', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

export const ModerationRouter = router;
