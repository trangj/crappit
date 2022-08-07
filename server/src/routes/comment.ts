import express from 'express';
import sanitizeHtml from 'sanitize-html';
import AppDataSource from '../dataSource';
import { auth } from '../middleware/auth';
import {
  Post, User, Comment, CommentVote,
} from '../entities';
import { sendNotification } from '../common/notifications';

const router = express.Router();

// @route   POST /api/comment
// @desc    Create a comment
// @access  Private

router.post('/', auth, async (req, res) => {
  try {
    const commentPost = await AppDataSource.manager.findOne(
      Post,
      { where: { id: req.body.postId }, relations: { topic: true, author: true } },
    );
    if (!commentPost) throw Error('No post');
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: req.user.id } },
    );
    if (!user) throw Error('No user');

    let newComment = AppDataSource.manager.create(
      Comment,
      {
        author: user,
        content: sanitizeHtml(req.body.content),
        post: commentPost,
      },
    );
    commentPost.number_of_comments += 1;

    await AppDataSource.transaction(async (em) => {
      newComment = await em.save(newComment);
      await em.save(commentPost);
    });

    if (commentPost.author_id !== newComment.author_id) {
      await sendNotification({
        recipient: commentPost.author,
        sender: user,
        body: newComment.content,
        type: 'POST_REPLY',
        url: `${process.env.CLIENT_URL}/t/${commentPost.topic.title}/comments/${commentPost.id}`,
        title: `u/${user.username} replied to your post in t/${commentPost.topic.title}`,
        comment_id: newComment.id,
        post_id: commentPost.id,
        icon_name: user.avatar_image_name,
        icon_url: user.avatar_image_url,
      });
    }

    delete newComment.post;

    res.status(200).json({
      comment: {
        ...newComment,
        author: user.username,
        author_id: user.id,
        avatar_image_url: user.avatar_image_url,
        avatar_image_name: user.avatar_image_name,
        post_id: commentPost.id,
        user_vote: null,
        children: [],
      },
      status: { text: 'Comment succesfully added', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/comment/:commentid
// @desc    Update a comment
// @access  Private

router.put('/:commentid', auth, async (req, res) => {
  try {
    if (!req.body.content) throw Error('Missing required fields');
    const comment = await AppDataSource.manager.findOne(
      Comment,
      { where: { id: parseInt(req.params.commentid), author_id: req.user.id } },
    );
    if (!comment) throw Error('No comment exists or you are not the author');

    comment.content = sanitizeHtml(req.body.content);
    comment.is_edited = true;

    await comment.save();

    res.status(200).json({
      comment: { content: comment.content, updated_at: comment.updated_at },
      status: { text: 'Comment successfully updated', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   DELETE /api/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete('/:commentid', auth, async (req, res) => {
  try {
    const comment = await AppDataSource.manager.findOne(
      Comment,
      { where: { id: parseInt(req.params.commentid), author_id: req.user.id } },
    );
    if (!comment) throw Error('No comment exists or you are not the author');

    comment.content = null;
    comment.author = null;
    comment.is_deleted = true;

    await comment.save();

    res.status(200).json({
      status: { text: 'Comment succesfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   PUT /api/comment/:commentid/changevote
// @desc    Change vote on comment
// @access  Private

router.put('/:commentid/changevote', auth, async (req, res) => {
  try {
    const comment = await AppDataSource.manager.findOne(
      Comment,
      { where: { id: parseInt(req.params.commentid) } },
    );
    if (!comment) throw Error('No comment exists');
    const comment_author = await AppDataSource.manager.findOne(
      User,
      { where: { id: comment.author_id } },
    );
    if (!comment_author) throw Error('Comment author does not exist');

    const vote = await AppDataSource.manager.findOne(
      CommentVote,
      { where: { comment_id: comment.id, user_id: req.user.id } },
    );

    if (!vote) {
      const newVote = AppDataSource.manager.create(
        CommentVote,
        {
          comment,
          user_id: req.user.id,
          value: req.query.vote === 'like' ? 1 : -1,
        },
      );
      comment.vote += req.query.vote === 'like' ? 1 : -1;
      comment_author.karma += req.query.vote === 'like' ? 1 : -1;

      await AppDataSource.transaction(async (em) => {
        await em.save(newVote);
        await em.save(comment);
        await em.save(comment_author);
      });

      res.status(200).json({ vote: comment.vote, user_vote: newVote.value });
    } else {
      if (req.query.vote === 'like') {
        if (vote.value === 1) {
          // if user likes and already liked comment
          vote.value = 0;
          comment.vote -= 1;
          comment_author.karma -= 1;
        } else if (vote.value === 0) {
          // if user likes an unvoted comment
          vote.value = 1;
          comment.vote += 1;
          comment_author.karma += 1;
        } else {
          // if user likes an already disliked comment
          vote.value = 1;
          comment.vote += 2;
          comment_author.karma += 2;
        }
      } else if (vote.value === -1) {
        // if user dislikes an already disliked comment
        vote.value = 0;
        comment.vote += 1;
        comment_author.karma += 1;
      } else if (vote.value === 0) {
        // if user dislikes an unvoted comment
        vote.value = -1;
        comment.vote -= 1;
        comment_author.karma -= 1;
      } else {
        // if user dislikes an already liked comment
        vote.value = -1;
        comment.vote -= 2;
        comment_author.karma -= 2;
      }

      await AppDataSource.transaction(async (em) => {
        await em.save(vote);
        await em.save(comment);
        await em.save(comment_author);
      });

      res.status(200).json({ vote: comment.vote, user_vote: vote.value });
    }
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/comment/:commentid/reply
// @desc    Add a reply to a comment
// @access  Private

router.post('/:commentid/reply', auth, async (req, res) => {
  try {
    const comment = await AppDataSource.manager.findOne(
      Comment,
      { where: { id: parseInt(req.params.commentid) }, relations: { author: true } },
    );
    if (!comment) throw Error('No comment was found with that id');
    const user = await AppDataSource.manager.findOne(
      User,
      { where: { id: req.user.id } },
    );
    if (!user) throw Error('No user was found with that id');
    const commentPost = await AppDataSource.manager.findOne(
      Post,
      { where: { id: req.body.postId }, relations: { topic: true } },
    );
    if (!commentPost) throw Error('No post was found with that id');

    let newComment = AppDataSource.manager.create(
      Comment,
      {
        author: user,
        content: sanitizeHtml(req.body.content),
        post: commentPost,
        parent_comment: comment,
      },
    );
    commentPost.number_of_comments += 1;

    await AppDataSource.transaction(async (em) => {
      newComment = await em.save(newComment);
      await em.save(commentPost);
    });

    if (comment.author_id !== newComment.author_id) {
      await sendNotification({
        recipient: comment.author,
        sender: user,
        body: newComment.content,
        type: 'COMMENT_REPLY',
        url: `${process.env.CLIENT_URL}/t/${commentPost.topic.title}/comments/${commentPost.id}`,
        title: `u/${user.username} replied to your comment in t/${commentPost.topic.title}`,
        comment_id: newComment.id,
        post_id: commentPost.id,
        icon_url: user.avatar_image_url,
        icon_name: user.avatar_image_name,
      });
    }

    delete newComment.post;
    delete newComment.parent_comment;

    res.status(200).json({
      comment: {
        ...newComment,
        author: user.username,
        author_id: user.id,
        avatar_image_url: user.avatar_image_url,
        avatar_image_name: user.avatar_image_name,
        post_id: commentPost.id,
        user_vote: null,
        children: [],
      },
      status: { text: 'Reply made successfully', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

export const CommentRouter = router;
