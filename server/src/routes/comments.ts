import express from 'express';
import { optionalAuth } from '../middleware/auth';
import { Comment } from '../entities';
import AppDataSource from '../dataSource';

const router = express.Router();

const createCommentThread = (comments: Comment[]): any => {
  const hashTable = Object.create(null);
  // eslint-disable-next-line no-return-assign
  comments.forEach((comment) => hashTable[comment.id] = { ...comment, children: [] });
  const dataTree: Comment[] = [];
  comments.forEach((comment) => {
    if (comment.parent_comment_id) {
      hashTable[comment.parent_comment_id].children.push(hashTable[comment.id]);
    } else {
      dataTree.push(hashTable[comment.id]);
    }
  });
  return dataTree;
};

// @route   GET /api/comments/:id
// @desc    Get comments for a post
// @access  Public

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const comments = await AppDataSource.query(`
      with recursive cte
      as (
        (select 
          c.*,
          u.username author,
            u.avatar_image_url avatar_image_url,
            u.avatar_image_name avatar_image_name,
            cv.value user_vote
        from comment c
        left join "user" u on c.author_id = u.id
        left join comment_vote cv on c.id = cv.comment_id and cv.user_id = $1
        where  c.parent_comment_id is null and c.post_id = $2
        order by 
          (case when $3 = 'top' then c.vote end) desc,
          (case when $3 = 'new' then c.created_at end) desc,
          (case when $3 = 'hot' or $3 = '' then c.id end) desc,
          c.id desc
        limit 5 offset $4)
        union all
          select cc.*,
            u.username author,
              u.avatar_image_url avatar_image_url,
              u.avatar_image_name avatar_image_name,
              cv.value user_vote
          from comment cc
          left join "user" u on cc.author_id = u.id
            left join comment_vote cv on cc.id = cv.comment_id and cv.user_id = $1
          inner join cte on cte.id = cc.parent_comment_id
      )
      select * from cte
    `, [req.user.id, req.params.id, req.query.sort, req.query.skip]);

    const commentThread = createCommentThread(comments);

    res.status(200).json({
      comments: commentThread,
      nextCursor: commentThread.length
        ? parseInt(req.query.skip as string) + commentThread.length
        : undefined,
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

export const CommentsRouter = router;
